
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
    // run the start function after the connection is made to prompt the user
    start();
});


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


function viewAllEmployees(){
    console.log("viewAllEmployees");
};

function viewAllEmployeesByDepartment(){
    console.log("viewAllEmployeesByDepartment");
};
function   viewAllEmployeesByManager(){
    console.log("viewAllEmployeesByManager");

}
function  AddEmployee(){
    console.log("AddEmployee");
 
}
function removeEmployee( )
{
    console.log("removeEmployee");
 
}
function updateEmployeeRole(){

    console.log("updateEmployeeRole");

}
function  updateEmployeeManager(){

    console.log("updateEmployeeManager");

}




