INSERT INTO department (title)
VALUES 
("Engineering"),
("Finance"),
("Sales"),
("Legal"),
("IT"),
("Leadership: Engineering");
("Leadership: Finace");
("Leadership: Sales");
("Leadership: Legal");
("Leadership: IT");

INSERT INTO employee_role (title, salary, department_id)
VALUES
("Lead Sales", 100000, 8),
("Salesperson", 80000, 3),
("Lead Engineer", 150000, 6),
("Software Engineer", 120000, 1),
("Account Manager", 160000, 7),
("Accountant", 125000, 2),
("Legal: Partner", 250000, 9),
("Legal: Associate", 190000, 4),
("Cyber: Lead Tech", 160000, 10),
("Cyber: Network Tech", 130000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
("Rick", "Sanchez", 6),
("Morty", "Smith", 1),
("Summer", "Smith", 3),
("Jerry", "Smith", 8),
("Beth", "Smith", 3),
("Kevin", "Flynn", 10),
("Sam", "Flynn", 5),
("Jarvis", "AI", 5),
("Jessic", "Jobs", 3),
("Steve", "Jobs", 8),
("Steve", "Wozniak", 1),
("Jordan", "Belfort", 7),
("Donnie", "Azoff", 2);
("Harvey", "Specter", 9);
("Mike", "Ross", 4);