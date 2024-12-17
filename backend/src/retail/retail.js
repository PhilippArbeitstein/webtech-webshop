const express = require("express");
const router = express.Router();

const pool = require("../pool");
const checkAuth = require("../auth/auth.js");
/*
a) Browse the product categories, following the hierarchy, and see the listings belonging to the
specific category (as a list view displaying title, price, and a smaller-size picture for each
product)

Search for specific products using the following search criteria (displaying the same list view
as a result):
· Product title and description (a substring)
· Product category (a category at any level of hierarchy may be specified; the result should
include all listings belonging to this category and all categories below it)
· Product price (by specifying a price interval)
· Seller address (by specifying a city)
· Product condition
· The way of delivery
· Additional properties depending on a product category (like the wheel size for bikes)
*/
router.get("/", async (req, res) => {
    const { search, category, minPrice, maxPrice, sellerAdress, condition, delivery_method, additional_properties } = req.body;

    let query = "SELECT product.name, product.price, product.image_url FROM product";
    query += getFullJoinTable();
    let params = [];
    let conditions = [];

    if (search) {
        conditions.push(`(product.name ILIKE $${params.length + 1} OR product.description ILIKE $${params.length + 1})`);
        params.push(`%${search}%`);
    }

    if (minPrice && maxPrice) {
        conditions.push(`product.price BETWEEN $${params.length + 1} AND $${params.length + 2}`);
        params.push(minPrice, maxPrice);
    }
    if (sellerAdress) {
        conditions.push(`address.city=$${params.length + 1}`);
        params.push(sellerAdress);
    }
    if (condition) {
        conditions.push(`conditions.condition_name ILIKE $${params.length + 1} AND conditions.condition_id=retail.condition_id`);
        params.push(condition);
    }
    if (delivery_method) {
        conditions.push(`delivery_methods.delivery_method_name ILIKE $${params.length + 1} AND delivery_methods.delivery_method_id=retail.delivery_method_id`)
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
router.get("/:product_id", async (req, res) => {

    let query = "SELECT product.name, product.price, product.image_url, product.additional_properties,";
    query += " conditions.condition_name, delivery_methods.delivery_method_name, users.username from product";

    query += getFullJoinTable();
    query += " WHERE product.product_id=$1";
    const productId = req.params.product_id;
    pool.query(query, [productId],
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
router.get("/user/:user_id", async (req, res) => {
    if (!req.session.user_id) {
        res.status(400).send("Not logged in");
    }
    let query = "SELECT product.name, product.price, product.image_url, conditions.condition_name, delivery_methods.delivery_method_name FROM product";
    query += getFullJoinTable();
    query += " WHERE product.user_id=$1";
    const userId = req.params.user_id;
    pool.query(query, [userId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving products");
            } else {
                res.status(200).json(result.rows);
            }
        }
    );
});

//delete listing. 
router.delete("/:product_id", async (req, res) => {
    const productId = req.params.product_id;
    try {

        const ownershipValidation = await validateProductOwnership(
            productId,
            req.session.user_id
        );

        if (!ownershipValidation.success) {
            return res
                .status(403)
                .json({ message: ownershipValidation.message });
        }
        const transaction = await pool.connect();
        await transaction.query("BEGIN");

        await transaction.query("DELETE FROM product_has_category WHERE product_id=$1;", [productId]);
        await transaction.query("DELETE FROM retail WHERE product_id=$1;", [productId]);
        await transaction.query("DELETE FROM product WHERE product_id=$1;", [productId]);

        await transaction.query("COMMIT");
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error deleting product");
    } finally {
        transaction.release();
    }
});


//Update Product
router.put("/:product_id", async (req, res) => {
    const productId = req.params.product_id;
    let { image_url, name, description, price, status, additional_properties, delivery_method, condition } = req.body;

    try {
        const ownershipValidation = await validateProductOwnership(
            productId,
            req.session.user_id
        );

        if (!ownershipValidation.success) {
            return res
                .status(403)
                .json({ message: ownershipValidation.message });
        }

        const transaction = await pool.connect();
        await transaction.query("BEGIN");

        let setRetail = [];
        if (condition) {
            condition = await getIDFromName("condition_id", "conditions", "condition_name", condition);
            setRetail.push(`condition_id='${condition}'`);
        }
        if (delivery_method) {
            delivery_method = await getIDFromName("delivery_method_id", "delivery_methods", "delivery_method_name", delivery_method);
            setRetail.push(`delivery_method_id='${delivery_method}'`);
        }

        if (setRetail.length > 0) {
            const retailQuery = "UPDATE retail SET " + setRetail.join(", ") + " WHERE product_id=$1";
            await transaction.query(retailQuery, [productId]);
        }

        let setProduct = [];
        if (status) {
            status = await getIDFromName("status_id", "statuses", "status_name", status);
            setProduct.push(`status_id='${status}'`);
        }
        if (image_url) setProduct.push(`image_url='${image_url}'`);
        if (name) setProduct.push(`name='${name}'`);
        if (description) setProduct.push(`description='${description}'`);
        if (price) setProduct.push(`price='${price}'`);
        if (additional_properties) setProduct.push(`additional_properties='${additional_properties}'`);
        setProduct.push(`updated_at=NOW()`);
        if (setProduct.length > 0) {
            const productQuery = "UPDATE product SET " + setProduct.join(", ") + " WHERE product_id=$1";
            await transaction.query(productQuery, [productId]);
        }

        await transaction.query("COMMIT");
        res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
        await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error updating product");
    } finally {
        transaction.release();
    }
});


//Add new retail product
router.post("/", async (req, res) => {
    let { image_url, name, description, price, status, additional_properties, delivery_method, condition, user } = req.body;
    if (!req.session.user_id) {
        res.status(400).send("Not logged in");
    }
    if (!image_url || !name || !description || !price || !status || !additional_properties || !delivery_method || !condition || !user) {
        return res.status(400).send("Insufficient Information");
    }

    try {
        const transaction = await pool.connect();
        await transaction.query("BEGIN");

        status = await getIDFromName("status_id", "statuses", "status_name", status);
        user = await getIDFromName("user_id", "users", "username", user);

        const productInsertQuery = `
            INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING product_id;
        `;
        const productResult = await transaction.query(productInsertQuery, [user, image_url, name, description, price, status, additional_properties]);
        if (!productResult.rows[0]?.product_id) {
            throw new Error('Failed to insert product.');
        }
        const productId = productResult.rows[0].product_id;

        condition = await getIDFromName("condition_id", "conditions", "condition_name", condition);
        delivery_method = await getIDFromName("delivery_method_id", "delivery_methods", "delivery_method_name", delivery_method);

        const retailInsertQuery = `
            INSERT INTO retail (product_id, delivery_method_id, condition_id)
            VALUES ($1, $2, $3) RETURNING product_id;
        `;
        const retailResult = await transaction.query(retailInsertQuery, [productId, delivery_method, condition]);

        if (!retailResult.rows[0]?.product_id) {
            throw new Error('Failed to insert product into retail.');
        }
        await transaction.query("COMMIT");
        res.status(201).json({ message: "Product added successfully", productId });
    } catch (err) {
        await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error inserting product");
    } finally {
        transaction.release();
    }
});


router.get('/messages/message', async (req, res) => {
    const { from_user, to_user, productId } = req.body;
    if (!from_user || !to_user || !productId) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        // Query to get messages between two users for a specific product
        const query = `
        SELECT from_user_id, to_user_id, message, sent_at
        FROM messages
        WHERE from_user_id = $1 AND to_user_id = $2 AND product_id = $3
        ORDER BY sent_at;`;

        const result = await pool.query(query, [from_user, to_user, productId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;


function getFullJoinTable() {
    let query = " join retail on retail.product_id=product.product_id join users on product.user_id=users.user_id join delivery_methods on retail.delivery_method_id=delivery_methods.delivery_method_id";
    query += " join conditions on retail.condition_id=conditions.condition_id JOIN address on address.address_id=users.address_id";
    return query;
}

async function getIDFromName(idRowName, tableName, nameRow, name) {
    try {
        const query = `
            SELECT ${idRowName}
            FROM ${tableName}
            WHERE ${nameRow} ILIKE $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [name]);

        if (result.rows.length === 0) {
            throw new Error(`${name} not found in ${tableName}`);
        }

        return result.rows[0][idRowName];
    } catch (error) {
        console.error(error.message);
        throw new Error(`Error in getIDFromName: ${error.message}`);
    }
}

// Helper method to validate product ownership with user_id stored in request token
async function validateProductOwnership(transaction, product_id, user_id) {
    // Check if user_id is provided and valid
    if (!user_id) {
        return {
            success: false,
            message: 'Permission denied: User ID is missing or invalid'
        };
    }
    await pool.query(query, [from_user, to_user, productId]);
    // Query to check ownership
    const productOwnerQuery = `SELECT user_id FROM product WHERE product_id = $1`;
    const productOwnerResult = await pool.query(productOwnerQuery, [product_id]);
    if (productOwnerResult.rows.length === 0) {
        return {
            success: false,
            message: 'Permission denied: Product not found'
        };
    }

    const productOwnerId = productOwnerResult.rows[0].user_id;

    if (productOwnerId !== user_id) {
        return {
            success: false,
            message: 'Permission denied: You do not own this product'
        };
    }

    return { success: true };
}