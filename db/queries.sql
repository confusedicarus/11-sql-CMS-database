SELECT * FROM department;
SELECT * FROM employee_role;
SELECT * FROM employee;

--shows names and department roles--
SELECT first_name as first_name, last_name as last_name , department_id FROM employee_role
JOIN employee on employee.role_id = employee_role.department_id;