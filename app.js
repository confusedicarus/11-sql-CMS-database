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
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
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
        "Update Employee",
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
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee":
          updateRole();
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

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What department would you like to add?",
        allowNull: false,
      },
    ])
    .then((response) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, response.addDepartment, (err, results) => {
        if (err) throw err;
        console.log(`Added ${response.addDepartment} to departments.`);
        getDepartments();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
        allowNull: false,
      },
      {
        type: "input",
        name: "salary",
        message: "What's the annual salary for this role?",
        allowNull: false,
      },
    ])
    .then((response) => {
      const roleChoice = [response.role, response.salary];
      const roleSql = `SELECT name, id FROM department`;
      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department does this role belong?",
              choices: dept,
            },
          ])
          .then((dChoice) => {
            const dept = dChoice.dept;
            roleChoice.push(dept);
            const sql = `INSERT INTO  role (title, salary, department_id) Values (?, ?, ?)`;
            db.query(sql, roleChoice, (err, results) => {
              if (err) throw err;
              console.log(`Added ${response.role}  to roles`);
              getRoles();
            });
          });
      });
    });
}

function updateRole() {
  const employeeSql = `SELECT * FROM employee`;
  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to updata?",
          choices: employees,
        },
      ])
      .then((eChoice) => {
        const employee = eChoice.name;
        const eParams = [];
        eParams.push(employee);
        const roleSql = `SELECT * FROM role`;
        db.query(roleSql, (err, data) => {
          if (err) throw err;
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What's this employee's new role?",
                choices: roles,
              },
            ])
            .then((rChoice) => {
              const role = rChoice.role;
              eParams[0] = role;
              eParams[1] = employee;
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              db.query(sql, eParams, (err, results) => {
                if (err) throw err;
                console.log(`${eChoice.name}'s role has been updated`);
                getEmployees();
              });
            });
        });
      });
  });
}

function end() {
  console.log(`Goodbye`);
  db.end();
}
