// Requiring packages needed for app
var mysql = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');

// Setting up MySQL 
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",

    database: "bamazon"
});
// Connectig to MySQL Database
connection.connect(function (err) {
    if (err) throw err;
    // After successful connection run welcome function and begin app
    welcome();
});
// Function shows all the options available to the customer for purchase then runs buy function
function welcome() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nWelcome to HoneyDukes!\n" + 
        "\nTake a look at our items below and let us know what you'd like!\n");
        console.table(res);
        buy();
    });
}
// Function allows customer to pick a product and buy a product with inventory available
function buy() {

    inquirer.prompt([
        {
            type: "input",
            name: "whatBuy",
            message: "What is the id of the item you'd like to buy?",
        },
        {
            type: "input",
            name: "howManyBuy",
            message: "How many would you like to buy",
        }
    ]).then(function (answer) {

        console.log("\nLet me check if we have that available...\n");

        var product = answer.whatBuy;
        var quantity = answer.howManyBuy;

        
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query,{ item_id: product }, function (err, res) {
            if (err) throw err;

            if (quantity > res[0].stock_quantity){
                console.log('Insufficient quanity available. You will need to place a smaller order.');
                welcome();
                
            } else {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: res[0].stock_quantity - quantity
                      },
                      {
                        item_id: product
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Purchase placed successfully!\n"+
                      "\nYou're total is: " + quantity * res[0].price + " Galleons\n");
                      connection.end();
                    }
                  );
            }
        });
    });
}

