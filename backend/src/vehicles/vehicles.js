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
mark and all models below it)
· Vehicle type (the set of types should depend on the top-level category)
· Vehicle price (by specifying a price interval) check
· Seller address (by specifying a city) check
· Date of first registration and mileage (as intervals), type of fuel, color, and condition
*/
router.get("/", async(req, res) => {
    const { search, minPrice, maxPrice, sellerAdress, model, mark, type, registration,mileageinterval, fuel_type, color, condition, } = req.body;

let query = "SELECT product.name, product.price, product.image_url, vehicles.mileage, vehicles.first_registration_date FROM product";
query+=" join vehicles on vehicles.product_id=product.product_id join users on product.user_id=users.user_id join vehicle_marks on vehicles.mark_id=vehicle_marks.mark_id";
query+=" join vehicle_types on vehicle_types.type_id=vehicles.type_id join vehicle_models on vehicle_models.model_id=vehicles.model_id";
query+=" join fuel_types on vehicles.fuel_type_id=fuel_types.fuel_type_id";
let params = [];
let conditions = [];

// Search by name, description, or tags
if (search) {
    conditions.push(`(product.name ILIKE $${params.length + 1} OR product.description ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
}

// Interval search by price
if (minPrice && maxPrice) {
    conditions.push(`p.price BETWEEN $${params.length + 1} AND $${params.length + 2}`);
    params.push(minPrice, maxPrice);
}
if(sellerAdress){
    conditions.push(`WHERE address.city=$${params.length + 1}`);
    params.push(sellerAdress);
}
if(model){
    conditions.push(`vehicle_models.model_name ILIKE $${params.length+1}`);
    params.push(model);
}




if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
}
console.log(query);
try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
}
});

module.exports = router;
