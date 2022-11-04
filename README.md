# Employee Tracker

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description

This command-line application can be used to manage a company's employee database using Node.js, Inquirer and MySQL.

The application allows the user to view and edit information about the company's departments, roles, and employees. 

This project introduces MySQL via creating, adding to and editing tables in the schema. The project also incorporates JOINs to relate data from one table to another.

## User Story
```
AS A business owner  
I WANT to be able to view and manage the departments, roles, and employees in my company  
SO THAT I can organize and plan my business  
```

## Acceptance Criteria
```
GIVEN a command-line application that accepts user input  
WHEN I start the application  
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role  
WHEN I choose to view all departments  
THEN I am presented with a formatted table showing department names and department ids  
WHEN I choose to view all roles  
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role  
WHEN I choose to view all employees  
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to  
WHEN I choose to add a department  
THEN I am prompted to enter the name of the department and that department is added to the database  
WHEN I choose to add a role  
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database  
WHEN I choose to add an employee  
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database  
WHEN I choose to update an employee role  
THEN I am prompted to select an employee to update and their new role and this information is updated in the database  
```

## Installation

To install the application, Node.js, Inquirer, MySQL and console.table all need to be installed.  

## Usage

In order to connect to the database, you need to create the database in MySQL first by executing schema.sql and seeds.sql.  

In index.js, input MySQL username and password in the mysql.createConnection to properly connect.  

Run node index to initiate the employee database and select an option. Answer prompts accordingly to add or edit information in the database. 

## Demo

The walkthrough video below demonstrates the functionality of the employee tracker.  

https://user-images.githubusercontent.com/113798073/200083795-16561317-037d-4a21-b050-5c137dbf9299.mp4


## License

This application is covered by [MIT License](https://choosealicense.com/licenses/mit/).
