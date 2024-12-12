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
//TODO Maybe improve cause right now im just sending 3 request lmao
router.delete("/:product_id", async(req, res) => {
    let query = "DELETE FROM product_has_category where product_id=$1;"
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

//Update Product
//TODO check for validation
router.put("/:product_id", async(req, res) => {
    const productId = req.params.product_id;
    let { mark,model,type,first_registration,mileage,fuel_type,color,condition,image_url,name,description,price,status,additional_properties } = req.body;
    let set=[];

    //Update Vehicle
    //transfer names to Ids and add them to the set
    if (mark) {
        const markResult = await pool.query('SELECT mark_id FROM vehicle_marks WHERE mark_name ILIKE $1', [mark]);
  
        if (markResult.rows.length === 0) {
          return res.status(400).json({ error: 'Mark not found' });
        }
  
        mark = markResult.rows[0].mark_id;
        set.push(`mark_id='${mark}'`);
        
      }
      if(model){
          const modelResult = await pool.query('SELECT model_id FROM vehicle_models WHERE model_name ILIKE $1', [model]);
  
        if (modelResult.rows.length === 0) {
          return res.status(400).json({ error: 'Mark not found' });
        }
  
        model = modelResult.rows[0].model_id;
        set.push(`model_id='${model}'`);
        
      }
      if(type){
          const typeResult = await pool.query('SELECT type_id FROM vehicle_types WHERE type_name ILIKE $1', [type]);
  
        if (typeResult.rows.length === 0) {
          return res.status(400).json({ error: 'Mark not found' });
        }
  
        type = typeResult.rows[0].type_id;
        set.push(`type_id='${type}'`);
      }
      if(fuel_type){
          const fuelResult = await pool.query('SELECT fuel_type_id FROM fuel_types WHERE model_name ILIKE $1', [fuel_type]);
  
        if (fuelResult.rows.length === 0) {
          return res.status(400).json({ error: 'Mark not found' });
        }
  
        fuel_type = fuelResult.rows[0].fuel_type_id;
        set.push(`fuel_type_id='${fuel_type}'`);
      }
      if(condition){
          const conditionResult = await pool.query('SELECT condition_id FROM conditions WHERE condition_name ILIKE $1', [condition]);
  
        if (conditionResult.rows.length === 0) {
          return res.status(400).json({ error: 'Mark not found' });
        }
  
        condition = conditionResult.rows[0].condition_id;
        set.push(`condition_id='${condition}'`);
      }
    if(first_registration){
        set.push(`first_registration='${first_registration}'`);
    }
    if(mileage){
        set.push(`mileage='${mileage}'`);
    }
    if(color){
        set.push(`color='${color}'`);
    }
    query = "Update vehicles set "+set.join(", ")+" where vehicles.product_id=$1";
    pool.query(query,[productId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json("Successfully updated vehicle");
            }
        }
    );
    //update product
    set=[];
    if(status){
        const statusResult = await pool.query('SELECT status_id FROM statuses WHERE status_name ILIKE $1', [status]);

      if (statusResult.rows.length === 0) {
        return res.status(400).json({ error: 'Mark not found' });
      }
      status = statusResult.rows[0].status_id;
      set.push(`status_id='${status}'`);
    }
    if(image_url){
        set.push(`image_url='${image_url}'`);
    }
    if(name){
        set.push(`name='${name}'`);
    }
    if(description){
        set.push(`description='${description}'`);
    }
    if(price){
        set.push(`price='${price}'`);
    }
    if(additional_properties){
        set.push(`additional_properties='${additional_properties}'`);
    }
    query = "Update product set "+set.join(", ")+" where product.product_id=$1";
    pool.query(query,[productId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json("Successfully updated product");
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