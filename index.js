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
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", function (err, result) {
        if (err) throw err
        console.table(result)
        employeeMenu();
    })
}

const viewAllRoles = () => {
    db.query("SELECT * FROM role", function (err, result) {
        if (err) throw err
        console.table(result)
        employeeMenu();
    })
}

const viewAllEmployees = () => {
    db.query("SELECT * FROM employee", function (err, result) {
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
        // figure out how to only allow existing ids
        {
            type: 'list',
            message: 'What department is the role in?',
            name: 'department_name',
            choices: result.map(department => department.name),
        },              
    ])
        .then(function(data) {
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
})}

// ADD EMPLOYEE
// FIRST NAME, LAST NAME, ROLE_ID (of existing ids in role table), MANAGER_ID (of existing ids in employee table)
const addEmployee = () => {
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
        // figure out how to only display existing ids as choices
        {
            type: 'list',
            message: 'What is the last name of the employee?',
            name: 'role_id',
            choices: ''
        },
        // figure out how to only display existing ids as choices
        {
            type: 'list',
            message: 'What is the last name of the employee?',
            name: 'manager_id',
            choices: '',
        },
    ])
        .then(function ({ first_name, last_name, role_id, manager_id }) {
            db.query("INSERT INTO employee VALUES (?)", [first_name, last_name, role_id, manager_id], function (err, result) {
                if (err) throw err
                console.table(result)
                employeeMenu();
            })
        })
}


// UPDATE EMPLOYEE ROLE

const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'selection',
            // figure out how to only display existing employees
            choices: '',
        }
    ])
    // then prompt to select new role and update in the database
}