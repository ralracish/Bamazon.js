var mysql = require("mysql");
const inquirer = require("inquirer");
const strpad = require("strpad");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root123",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    display();
});

function display() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item id: " + res[i].item_id + " | Product: " + res[i].product_name +
                " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
            console.log("------------------------------------------------------------------------------------------------------");
        }
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
                    // console.log(data[0])


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
                                    console.log("Your total is: ", totalFixed)
                                }
                            }
                        )
                    }
                })
        });
}
