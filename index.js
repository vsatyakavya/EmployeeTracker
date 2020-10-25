
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

var array = ["View All Employees", "Add Department", "Add Role", "Add Employee", "view Departments", "view Roles", "Remove Employee","update Employee Role", "Update Employee Manager"]
function start(){
inquirer
    .prompt({

        type: "list",
        message: "What would you like to do?",
        choices: array,
        name: "action",
    })
    .then(function (answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action === "View All Employees") {
            viewAllEmployees();
        }

        else if (answer.action === "Add Department") {
            AddDepartment();

        }
        else if (answer.action === "Add Role") {
            AddRole();

        }
        else if (answer.action === "Add Employee") {
            AddEmployee();

        }
        else if (answer.action === "view Departments") {
            viewDepartment();

        }
        else if (answer.action === "view Roles") {
            viewRoles();

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






}
function viewAllEmployees() {
    connection.query(" select e.id, e.first_name, e.last_name , role.title, role.salary,  m.first_name AS manager_name from(employee e  INNER JOIN role ON e.role_id = role.id and role.title != 'Manager') left Join  employee m on e.manager_id = m.role_id ", function (err, res) {
        console.table(res);
    });
    connection.end();

};



function AddDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new Department Name?",
            name: "DName"
        },
    ]).then(function (answers) {
        connection.query("INSERT INTO department SET?",
            {
                name: answers.DName
            }
        )
    })
}


function AddRole() {
    connection.query("select name from department", function (err, res) {
        if (err) {
            throw (err)
        }
        var departmentNames = [];
        for (var i = 0; i < res.length; i++) {
            var name = res[i].name;
            departmentNames.push(name);
        }


        inquirer.prompt([
            {
                type: "input",
                message: "What is the new Role?",
                name: "newRole"
            }, {
                type: "input",
                message: "How much is the salary?",
                name: "salary"
            },
            {
                type: "list",
                message: "which department?",
                choices: departmentNames,
                name: "department"
            }
        ]).then(function (answers) {
            connection.query("select id from department where ?", { name: answers.department }, function (err, res) {
                if (err) {
                    throw err
                }
                var deptid = res[0].id;

                connection.query("INSERT into role set?",
                    {
                        title: answers.newRole,
                        salary: answers.salary,
                        departmant_id: deptid
                    })
            })
            //    connection.query("INSERT INTO role SET?",
            //    {
            //        name : answers.DName
            //    }
            //    )
        })
    })
}


function AddEmployee() {
    // connection.query("select name from department", function (err, res) {
    //     if (err) {
    //         throw (err)
    //     }
    //     var departmentNames = [];
    //     for (var i = 0; i < res.length; i++) {
    //         var name = res[i].name;
    //         departmentNames.push(name);
    //     }
    connection.query("select title from role", function (err, res) {
        console.log(res);
        var title = [];
        for (var i = 0; i < res.length; i++) {
            var eachtitle = res[i].title;
            title.push(eachtitle);
        }


        connection.query("select first_name , last_name from employee where role_id = 1 OR role_id = 4 OR role_id = 7 OR role_id = 9", function (err, res) {
            if (err) {
                throw err
            }
            var managerNames = [];
            for (var i = 0; i < res.length; i++) {
                var firstAndLastName = (res[i].first_name + " " + res[i].last_name);
                managerNames.push(firstAndLastName);
            }
            console.log(managerNames);

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
                    choices: title,
                    name: "title1"
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managerNames,
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
        })


    })
    //  })

}

function viewDepartment() {
    connection.query("select * from department", function (err, res) {
        console.table(res);
    })
}

function viewRoles(){
    connection.query("select title from role",function(err,res){
        if(err) throw err;
        console.table(res);
    })
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
                connection.query("select role_id from employee where ?", { first_name: firstName[0] },
                    function (err, res) {
                        if (err) {

                            throw err;
                        }


                        var newRoleManagerId = res[0].role_id;
                        var names = answers.employeeName.split(" ");

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

// select employee.id, employee.first_name, employee.last_name , role.title,role.salary,  m.first_name AS manager_name from (employee  INNER JOIN role ON employee.role_id = role.id) left Join  employee m on employee.manager_id = m.role_id; 



