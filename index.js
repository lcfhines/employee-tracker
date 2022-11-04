// dependencies: inquirer, console.table, mysql
const inquirer = require('inquirer');
require("console.table");
const mysql = require('mysql2');


// connect to database
// user needs to enter their own username and password in order to connect
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employees_db'
    }
);

db.connect(function (err) {
    if (err) throw err;
    // initialize employeeMenu function after connection is made
    employeeMenu();
});


// employee menu - will store all of the options
const employeeMenu = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
        ]
    }])
        .then(function (data) {
            // if statements based on what choice user makes, run appropriate function
            // data.choice will give us the user's selection
            if (data.choice === "View All Departments") {
                viewAllDepartments()
            } else if (data.choice === "View All Roles") {
                viewAllRoles()
            } else if (data.choice === "View All Employees") {
                viewAllEmployees()
            } else if (data.choice === "Add a Department") {
                addDepartment()
            } else if (data.choice === "Add a Role") {
                addRole()
            } else if (data.choice === "Add an Employee") {
                addEmployee()
            } else if (data.choice === "Update an Employee Role") {
                updateEmployeeRole()
            } else {
                // exit
                db.end();
            }
        })
}

// VIEW
// all columns from department table
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", function (err, result) {
        if (err) throw err
        console.table(result)
        employeeMenu();
    })
}

// id, title, salary from role table, department name from department table
const viewAllRoles = () => {
    db.query("SELECT role.id, role.title, department.name AS 'department', role.salary FROM role JOIN department ON role.department_id = department.id", function (err, result) {
        if (err) throw err
        console.table(result)
        employeeMenu();
    })
}

// id, first and last name from employee table, title and salary from role table, department name from department table
const viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS 'title', department.name as 'department', role.salary as 'salary' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;`, function (err, result) {
        if (err) throw err
        console.table(result)
        employeeMenu();
    })
}

// ADD DEPARTMENT
// NAME
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'name',
        },
    ])
        .then(function (name) {
            db.query('INSERT INTO department SET ?', name), function (err, result) {
                if (err) throw err;
                console.table(result);
            }
            employeeMenu();
        })

}


// ADD ROLE
// TITLE, SALARY, DEPARTMENT_ID (choice between existing ids in department table)
const addRole = () => {
    // use department table to get existing departments that role can be part of
    db.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the title of the role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'What department is the role in?',
                name: 'department_name',
                choices: result.map(department => department.name),
            },
        ])
            .then(function (data) {
                const chosenDepartment = result.find(department => department.name === data.department_name);
                console.log(chosenDepartment)

                db.query('INSERT INTO role SET ?',
                    {
                        title: data.title,
                        department_id: chosenDepartment.id,
                        salary: data.salary,
                    }, function (err, result) {
                        if (err) throw err
                        console.table(result)
                    })
                employeeMenu();
            })
    })
}

// ADD EMPLOYEE
// FIRST NAME, LAST NAME, ROLE_ID (of existing ids in role table), MANAGER_ID (of existing ids in employee table)

const addEmployee = () => {
    // use role table to get titles for new employee
    db.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'first_name',
            },
            {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'last_name',
            },
            {
                type: 'list',
                message: 'What is the title for the employee?',
                name: 'role_name',
                choices: result.map(role => role.title)
            },
            // figure out how to only display existing managers as choices
            {
                type: 'list',
                message: 'Who will be the manager for the employee?',
                name: 'manager_name',
                choices: () => {
                    db.query("SELECT * FROM employee", (err, employees) => {
                        return employees;
                        // console.log(employees);
                        // employees.map( employee => {
                        //     return employee.last_name
                        // })
                    })
                } 
                
                // result.map(employee => employee.last_name),
                // type: 'list',
                // message: 'Select the manager id for the employees manager',
                // name: 'manager_id',
                // choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
        ])
            .then(function (data) {
                const chosenRole = result.find(role => role.title === data.role_name);
                // const chosenManager = result.find(employee => employee.last_name === data.manager_name);

                db.query('INSERT INTO employee SET ?', {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role_id: chosenRole.id,
                    manager_id: data.manager_id,
                }, function (err, result) {
                    if (err) throw err
                    console.table(result)
                })
                employeeMenu();
            })
    })
}


// UPDATE EMPLOYEE ROLE

const updateEmployeeRole = () => {
    db.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
    db.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'chosen_employee',
            // display last names of existing employees
            choices: result.map(employee => employee.last_name),
        },
        {
            type: 'list',
            message: 'What is the employees new role?',
            name: 'chosen_role',
            // display roles
            choices: result.map(role => role.title),
        }
    ])
    // then prompt to select new role and update in the database
    .then(function (data) {
        const chosenEmployee = result.find(employee => employee.last_name === data.chosen_employee);
        const chosenRole = result.find(role => role.title === data.chosen_role);
        db.query('UPDATE employee SET ?', {
            role_id: chosenRole.id,
        }, function (err, result) {
            if (err) throw err
            console.table(result)
        })
        employeeMenu();
    })
})
    })
}