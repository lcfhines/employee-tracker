const inquirer = require('inquirer');
const consoleTable = require("console.table");
// import and require mysql2
const mysql = require('mysql2');

// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

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
    .then (function(data){
        // if statements based on what choice user makes, run appropriate function
        if('choice' === "View All Departments"){
            viewAllDepartments()
        } else if ('choice' === "View All Roles"){
            viewAllRoles()
        } else if ('choice' === "View All Employees"){
            viewAllEmployees()
        } else if ('choice' === "Add a Department"){
            addDepartment()
        } else if ('choice' === "Add a Role"){
            addRole()
        } else if ('choice' === "Add an Employee"){
            addEmployee()
        } else if ('choice' === "Update an Employee Role"){
            updateEmployeeRole()
        } else {
// how to exit?
        }
    })
}


// Connect to database and run menu
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employees_db'
    },
    employeeMenu()
  );

// VIEW
const viewAllDepartments = () => {
    db.query("SELECT * from department", function(err, result) {
        if(err) throw err
        console.table(result)
    })
}

const viewAllRoles = () => {
    db.query("SELECT * from role", function(err, result) {
        if(err) throw err
        console.table(result)
    })
}

const viewAllEmployees = () => {
    db.query("SELECT * from employee", function(err, result) {
        if(err) throw err
        console.table(result)
    })
}

// ADD DEPARTMENT
    // NAME
// repeat for roles and depts
// first name, last name, role id, manager id
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'name',
        },
    ])
.then (function({name}){
    db.query("INSERT INTO employee values ?", [name], function(err, result){
        if(err) throw err
        console.table(result)
    })
})
}

// ADD ROLE
    // TITLE, SALARY, DEPARTMENT_ID (choice between existing ids in department table)
const addRole = () => {
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
            name: 'department_id',
            choices: '',
        },
    ])
.then (function({title, salary, department_id}){
    db.query("INSERT INTO employee values (?, ?, ?)", [title, salary, department_id], function(err, result){
        if(err) throw err
        console.table(result)
    })
})
}

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
.then (function({first_name, last_name, role_id, manager_id}){
    db.query("INSERT INTO employee values (?, ?, ?,?)", [first_name, last_name, role_id, manager_id], function(err, result){
        if(err) throw err
        console.table(result)
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