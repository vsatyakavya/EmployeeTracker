DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);



CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    departmant_id INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
     manager_id INT NULL,
     PRIMARY KEY(id)
);

INSERT INTO department(name) values("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO role(title,salary,departmant_id) values("Manager",2000,1),
("Sales Lead",1000,1),("Salesperson",500,1);

INSERT INTO role(title,salary,departmant_id) values("Manager",5000,2),
("Lead Engineer",4000,2),("Software Engineer",3000,2);

INSERT INTO role(title,salary,departmant_id) values("Manager",5000,3),
("Accountant",2000,3);

INSERT INTO role(title,salary,departmant_id) values("Manager",5000,4),
("Legal Team Lead",4000,4),("Lawyer",6000,4);


INSERT INTO employee(first_name,last_name,role_id) values("Ashley","Rodriguez",1),
("John","Doe",4),("Sarah","Lourd",7),("Kevin","Tupik",9);




