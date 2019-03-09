const mysql = require("mysql");
const inquirer = require("inquirer");
const Table=require("easy-table")


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the user
    display();
});

function display() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("connected")
        //Products displayed using easy-table npm
        var t = new Table

        res.forEach(function(product) {
            t.cell('Product Id', product.item_id)
            t.cell('Description', product.product_name)
            t.cell('Department Name, USD', product.department_name)
            t.cell('Price', product.price.toFixed(2))
            t.cell('Stock Quantity', product.stock_quantity)
            t.newRow()

        })
        console.log(t.toString())
        purchase()
    });
}

//function to handle customer purchases
function purchase() {
    //prompt for item number and quantity of purchase
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item number of the item you would like to buy?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            //compare purchased quantity with stock_quantity
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item },
                function (err, data) {
            
                    if (data[0].stock_quantity < answer.quantity) {
                        console.log("Insufficient quantity!");
                    }
                    //Subtract purchase quantity from stock_quantity
                    else {
                        let newQuantity = data[0].stock_quantity - answer.quantity;
                        let total = data[0].price * answer.quantity
                        let totalFixed=total.toFixed(2)
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: answer.item
                                }
                            ], function (err, data) {
                                if (err) {
                                    throw err
                                } else {
                                    console.log("Your total is: $", totalFixed)
                                    console.log("Stock quantity has been updated.")
                                }
                            }
                        )
                    }
                })
        });
}