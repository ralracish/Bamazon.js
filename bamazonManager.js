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
    askManager()
});


//function to handle customer purchases
function askManager() {
    //prompt for item number and quantity of purchase
    inquirer
        .prompt([
           {
            type: 'list',
            name: 'inventory',
            message: 'What do you want to do?',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]},
            
        ])
        .then(function (manager) {
            if (manager.inventory==='View Products for Sale'){
                viewProducts();
            }
            else if (manager.inventory==='View Low Inventory'){
                lowInventory();
            }
            else if (manager.inventory==='Add to Inventory'){
                addInventory();
            }
            else if (manager.inventory==='Add New Product'){
                newProduct();
            }
        })
}

//Function to View Products
function viewProducts() {
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
    });
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= '10'", function (err, res) {
        if (err) throw err;
        console.log("connected")
        if (data[0].stock_quantity < 10){

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
        }
    });
}

function addInventory(){
    inquirer
    .prompt([
       {
        type: 'input',
        name: 'item',
        message: 'Which item would you like to add quantity to?',
        },
        {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to add?',
        }
        ])
        .then (function(add){
            connection.query("UPDATE products SET item_id WHERE stock_quantity", [function (err, res) {
                if (err) throw err;
                [{

                    stock_quantity: add.quantity
                }, {
                    item_id: add.item
                }], function(err, res) {
                });
            startPrompt();
          });
        }
            })
        }
}