const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);
db.connect((err) => {
  if (err) throw err;
  postConnect();
});
postConnect = () => {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
  console.log("***********************************");
  init();
};

function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Please choose from one of the options below",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Remove Employee",
        "EXIT",
      ],
    })
    .then(function (data) {
      switch (data.action) {
        case "View All Employees":
          getEmployees();
          break;
        case "View All Departments":
          getDepartments();
          break;
        case "View All Roles":
          getRoles();
          break;
        case "Add Employee":
          addEmployees();
          break;
        case "View Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Remove Employee":
          deleteEmployees();
          break;
        case "EXIT":
          end();
          break;
        default:
          break;
      }
    });
}

function getEmployees() {
  console.log("Showing all employees\n");
  const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function getDepartments() {
  console.log("Showing all departments\n");
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function getRoles() {
  console.log("Showing all roles\n");
  const sql = `SELECT role.id, role.title, department.name AS department FROM role JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function addEmployees() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What's the employee's first name?",
        allowNull: false,
      },
      {
        type: "input",
        name: "lastName",
        message: "What's the employee's last name?",
        allowNull: false,
      },
    ])
    .then((response) => {
      const answers = [response.firstName, response.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What's the employee's role?",
              choices: roles,
            },
          ])
          .then((choice) => {
            const role = choice.role;
            answers.push(role);
            const managerSql = `SELECT * FROM employee`;
            db.query(managerSql, (err, data) => {
              if (err) throw err;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who's this employee's manager?",
                    choices: managers,
                  },
                ])
                .then((mChoice) => {
                  const manager = mChoice.manager;
                  answers.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                  db.query(sql, answers, (err, results) => {
                    if (err) throw err;
                    console.log("New employee has been added!");
                    getEmployees();
                  });
                });
            });
          });
      });
    });
}
