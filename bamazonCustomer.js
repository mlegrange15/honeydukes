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
    welcome();
});

function welcome() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\nWelcome to HoneyDukes!\n" + 
        "\nTake a look at our items below and let us know what you'd like!\n");
        
        console.table(res);
        buy();
    });
}

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

