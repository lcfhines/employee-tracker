
--  query to include department name on role table 
SELECT role.id, role.title, department.name AS 'department' , role.salary
FROM role
JOIN department ON role.department_id = department.id;


-- query to include data from department & role
SELECT employee.id, employee.first_name, employee.last_name, role.title AS 'title', department.name as 'department', role.salary as 'salary'
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;