const express = require("express");
const router = express.Router();

const pool = require("../pool");
const checkAuth = require("../auth/auth.js");
/*
a) Browse the marks and models within the specific top-level category, and see the listings
belonging to the specific category, mark, and model (as a list view displaying title, price,
mileage, year of first registration, and a smaller-size picture for each vehicle)


Search for specific vehicles using the following search criteria (displaying the same list view as
a result):
· Vehicle name and description (a substring) check
· Model or mark (if the mark is specified, the result should include all listings belonging to this
mark and all models below it) check
· Vehicle type (the set of types should depend on the top-level category) check
· Vehicle price (by specifying a price interval) check
· Seller address (by specifying a city) check
· Date of first registration and mileage (as intervals), type of fuel, color, and condition check
*/
router.get("/", async(req, res) => {
    const { search, minPrice, maxPrice, sellerAdress, model, mark, type, registration, fuel_type, color, condition } = req.body;

let query = "SELECT product.name, product.price, product.image_url, vehicles.mileage, vehicles.first_registration_date FROM product";
query+=getFullJoinTable();
let params = [];
let conditions = [];

if (search) {
    conditions.push(`(product.name ILIKE $${params.length + 1} OR product.description ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
}

if (minPrice && maxPrice) {
    conditions.push(`p.price BETWEEN $${params.length + 1} AND $${params.length + 2}`);
    params.push(minPrice, maxPrice);
}
if(sellerAdress){
    conditions.push(`address.city=$${params.length + 1}`);
    params.push(sellerAdress);
}
if(model){
    conditions.push(`vehicle_models.model_name ILIKE $${params.length+1}`);
    params.push(model);
}
if(mark){
    conditions.push(`vehicle_marks.mark_name=$${params.length+1} AND vehicles.mark_id=vehicle_marks.mark_id`);
    params.push(mark);
}
if(type){
    conditions.push(`vehicle_types.type_name ILIKE $${params.length+1} AND vehicles.type_id=vehicle_types.type_id`);
    params.push(type);
}
if(registration){
    conditions.push(`vehicles.first_registration_date>$${params.length+1}`);
    params.push(registration);
}
if(fuel_type){
    conditions.push(`fuel_types.fuel_type_name=$${params.length+1} AND vehicles.fuel_type_id=fuel_types.fuel_type_id`);
    params.push(fuel_type);
}
if(color){
    conditions.push(`vehicles.color=$${params.length+1}`);
    params.push(color);
}
if(condition){
    conditions.push(`conditions.condition_name ILIKE $${params.length+1} AND conditions.condition_id=vehicles.condition_id`);
    params.push(condition);
}

if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
}
try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
}
});

//Get specific Product
router.get("/:product_id", async(req, res) => {

let query = "SELECT product.name, product.price, product.image_url, vehicles.mileage, vehicles.first_registration_date, product.additional_properties,";
query+=" conditions.condition_name, fuel_types.fuel_type_name, vehicles.color, vehicle_marks.mark_name, vehicle_types.type_name from product";

query+=getFullJoinTable();
query+=" WHERE product.product_id=$1";
const productId = req.params.product_id;
pool.query(query,[productId],
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error retrieving product");
        } else {
            res.status(200).json(result.rows);
        }
    }
);
});
//Get all listings by User
router.get("/user/:user_id", async(req, res) => {

    let query = "SELECT product.name, product.price, product.image_url, vehicles.mileage, vehicles.first_registration_date FROM product";
    query+=getFullJoinTable();
    query+=" WHERE product.user_id=$1";
    const userId = req.params.user_id;
    pool.query(query,[userId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json(result.rows);
            }
        }
    );
});
//delete listing. 
//TODO CHECK FOR VALIDATION
router.delete("/:product_id", async(req, res) => {

    
    let query = "DELETE FROM product_has_category where product_id=$1;"
    // DELETE FROM vehicles where product_id=$2; DELETE FROM product where product_id=$3";
    
    const productId = req.params.product_id;
    pool.query(query,[productId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                //res.status(200).json(result.rows);
            }
        }
    );
    query = "DELETE FROM vehicles where product_id=$1;"
    pool.query(query,[productId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                //res.status(200).json(result.rows);
            }
        }
    );
    query = "DELETE FROM product where product_id=$1";
    pool.query(query,[productId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json(result.rows);
            }
        }
    );
});




module.exports = router;


function getFullJoinTable(){
    let query=" join vehicles on vehicles.product_id=product.product_id join users on product.user_id=users.user_id join vehicle_marks on vehicles.mark_id=vehicle_marks.mark_id";
    query+=" join vehicle_types on vehicle_types.type_id=vehicles.type_id join vehicle_models on vehicle_models.model_id=vehicles.model_id";
    query+=" join fuel_types on vehicles.fuel_type_id=fuel_types.fuel_type_id join conditions on vehicles.condition_id=conditions.condition_id";
    return query;
}