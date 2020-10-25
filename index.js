
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "kavya",
    database: "employeeTracker_db"
});
connection.connect(function (err) {
    if (err) throw err;
    afterConnection()
    // run the start function after the connection is made to prompt the user

});

function afterConnection() {
    connection.query("SELECT * FROM department ", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}


function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "update Employee Role", "Update Employee Manager"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.action === "View All Employees") {
                viewAllEmployees();
            }
            else if (answer.action === "View All Employees By Department") {
                viewAllEmployeesByDepartment();

            }
            else if (answer.action === "View All Employees By Manager") {
                viewAllEmployeesByManager();

            }
            else if (answer.action === "Add Employee") {
                AddEmployee();

            }
            else if (answer.action === "Remove Employee") {
                removeEmployee();

            }
            else if (answer.action === "update Employee Role") {
                updateEmployeeRole();

            }
            else if (answer.action === "Update Employee Manager") {
                updateEmployeeManager();

            }
            else {
                connection.end();
            }
        });
};


function viewAllEmployees() {
    connection.query("select * from emplo")
};

function viewAllEmployeesByDepartment() {
    console.log("viewAllEmployeesByDepartment");
};
function viewAllEmployeesByManager() {
    console.log("viewAllEmployeesByManager");

}
function AddEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is employee's first name?",
            name: "fName"
        },
        {
            type: "input",
            message: "what is employee's last name",
            name: "lName"

        },
        {
            type: "list",
            message: "what is employee's role?",
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer",
                "Accountant", "Legal Team Lead", "Lawyer"],
            name: "title1"
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            choices: ["Ashley Rodriguez", "John Doe", "Sarah Lourd", "Kevin Tupik", "No Manager"],
            name: "managerName"

        }


    ]).then(function (answers) {
        var d = answers.managerName.split(" ");
        connection.query("select id from role where ?", { title: answers.title1 }, function (err, res) {
            var query1 = res[0].id;
            if (answers.managerName != "No Manager") {
                connection.query("select role_id from employee where ?", { first_name: d[0] }, function (err, res) {
                    query2 = res[0].role_id;
                    connection.query(
                        "INSERT INTO employee SET?",
                        {
                            first_name: answers.fName,
                            last_name: answers.lName,
                            role_id: query1,
                            manager_id: query2


                        }
                    )

                });
            }
            else {
                connection.query(
                    "INSERT INTO employee SET?",
                    {
                        first_name: answers.fName,
                        last_name: answers.lName,
                        role_id: query1,
                        manager_id: null


                    }
                )

            }


        });


    });
}
function removeEmployee() {
    console.log("removeEmployee");
    connection.query("select first_name , last_name from employee ", function (err, res) {

        var employeeNames = [];
        for (var i = 0; i < res.length; i++) {
            var firstAndLastName = (res[i].first_name + " " + res[i].last_name);
            employeeNames.push(firstAndLastName);
        }
        inquirer.prompt([
            {
                type: "list",
                message: "which employee do you wanna delete?",
                choices: employeeNames,
                name: "employeeName"
            }

        ]).then(function (answers) {
            var firstName = answers.employeeName.split(" ");
            console.log(firstName[0]);
            connection.query("Delete from employee where first_name = ?", [firstName[0]], function (err, res) {

                console.log("Employee deleted from database");
            })
        }).catch(err) 
        console.log(err);
    });




}
function updateEmployeeRole() {
    connection.query("select first_name , last_name from employee ", function (err, res) {

        var employeeNames = [];
        for (var i = 0; i < res.length; i++) {
            var firstAndLastName = (res[i].first_name + " " + res[i].last_name);
            employeeNames.push(firstAndLastName);
        }
        console.log(employeeNames);

        connection.query("select title from role", function (err, res) {
            console.log(res);
            var roles = [];
            for (var i = 0; i < res.length; i++) {
                var title = (res[i].title);
                roles.push(title);
            }
            console.log(roles);

            inquirer.prompt([
                {
                    type: "list",
                    message: "which employee role do you wanna update?",
                    choices: employeeNames,
                    name: "employeeName"
                },
                {
                    type: "list",
                    message: "what is the new role?",
                    choices: roles,
                    name: "newRole"
                }
            ]).then(function (answers) {
                connection.query("select id from role where ?", { title: answers.newRole }, function (err, res) {
                    var query1 = res[0].id;
                    var firstName = answers.employeeName.split(" ");

                    connection.query("update employee set ? where ?",
                        [{
                            role_id: query1
                        },
                        {
                            first_name: firstName[0]
                        }]
                    )
                    console.log('Successfully updated the role')
                })

            })
        });


    })

}


function updateEmployeeManager() {
    connection.query("select first_name , last_name from employee ", function (err, res) {

        var employeeNames = [];
        for (var i = 0; i < res.length; i++) {
            var firstAndLastName = (res[i].first_name + " " + res[i].last_name);
            employeeNames.push(firstAndLastName);
        }
        console.log(employeeNames);
        connection.query("select first_name , last_name from employee where role_id = 1 OR role_id = 4 OR role_id = 7 OR role_id = 9 ", function (err, res) {
            var managers = [];
            for (var i = 0; i < res.length; i++) {
                var firstAndLastName = (res[i].first_name + " " + res[i].last_name);
                managers.push(firstAndLastName);
            }
            console.log(managers);
            inquirer.prompt([
                {
                    type: "list",
                    message: "which employee's manager you want to update?",
                    choices: employeeNames,
                    name: "employeeName"
                },
                {
                    type: "list",
                    message: "select the manager",
                    choices: managers,
                    name: "manager"
                }


            ]).then(function (answers) {
                console.log(answers);
                var firstName = answers.manager.split(" ");
                console.log(firstName);
                console.log(firstName[0]);
                console.log(firstName[1]);
                connection.query("select role_id from employee where ?", { first_name: firstName[0]},
                    function (err, res) {
                        if (err) {
                            console.log('err-=> ', err)
                            throw err;
                        }

                        console.log('ress=-=-=>> ' ,  res);
                        var newRoleManagerId = res[0].role_id;
                        console.log(newRoleManagerId);

                        var names = answers.employeeName.split(" ");
                        console.log(names)
                        connection.query("update employee set ? where ?",
                            [{
                                manager_id: newRoleManagerId
                            },
                            {
                                first_name: names[0]
                            }]
                        );

                    }
                );
            }).catch(err)
            console.log(err);

        })
    });
}




