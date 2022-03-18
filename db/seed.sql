USE company_db; 
INSERT INTO department (name)
VALUES 
("Engineering"),
("Finance"),
("Sales"),
("Legal"),
("IT");

INSERT INTO role (title, salary, department_id)
VALUES
("Senior Engineer", 200000, 1),
("Software Engineer", 120000, 1),
("Account Manager", 160000, 2),
("Accountant", 125000, 2),
("Lead Sales", 100000, 3),
("Salesperson", 80000, 3),
("Legal: Partner", 250000, 4),
("Legal: Associate", 190000, 4),
("Cyber: Senior Tech", 180000, 5),
("Cyber: Network Tech", 130000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Dwane", "Johnson", 2, null),
("Devin", "Anderson", 1, 1),
("Caitlin", "McWeeney", 4, null),
("Ashley", "Miller", 3, 3),
("Tyler", "Moore", 6, null),
("Ana", "Sanchez", 5, 5),
("Lewis", "Allen", 7, null),
("Rick", "Sanchez", 1, null),
("Steve", "Wozniak", 1, null),
("Morty", "Smith", 2, 1),
("Donnie", "Azoff", 4, 5),
("Jordan", "Belfort", 3, null),
("Summer", "Smith", 6, 7),
("Jerry", "Smith", 6, 9),
("Jessic", "Jobs", 6, 10),
("Beth", "Smith", 5, null),
("Steve", "Jobs", 5, null),
("Mike", "Ross", 8, 17),
("Harvey", "Specter", 7, null),
("Kevin", "Flynn", 9, null),
("Sam", "Flynn", 10, 20),
("Jarvis", "AI", 10, 20),
('Katie', 'Worgen', 8, 7);