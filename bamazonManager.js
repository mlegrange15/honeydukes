var mysql = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    menuOptions();
});

function menuOptions() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    forSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

function forSale() {
    console.log("Selecting all products for sale...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        connection.end();
    });
}

function lowInventory() {
    console.log('\nProducts with current inventory levels less than 5 units...\n');
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 5) {
                console.log('Product: ' + res[i].product_name + ' Quantity: ' + res[i].stock_quantity + '\n---------------------------------------');
            }
        }
        //   console.table(res);
        connection.end();
    });
}

function addInventory() {


    inquirer.prompt([
        {
            type: "input",
            name: "whatAdd",
            message: "What is the id of the item you'd like to add inventory to?",
        },
        {
            type: "input",
            name: "howManyAdd",
            message: "How many units would you like to add to this items inventory?",
        }
    ]).then(function (answer) {

        console.log("Updating quantities...\n");

        var product = answer.whatAdd;
        var quantity = parseFloat(answer.howManyAdd);

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            var currentQuantity = parseFloat(res[(product - 1)].stock_quantity);

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: currentQuantity + quantity
                    },
                    {
                        item_id: product
                    }
                ],
                function (err, res) {
                    if (err) throw err;

                    console.log("Inventory updated successfully!\n" +
                        "\n The new inventory total for this item is: " + (currentQuantity + quantity) + "\n");
                    forSale();
                });
        });
    });
}