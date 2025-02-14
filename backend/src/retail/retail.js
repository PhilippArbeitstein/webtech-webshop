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

    let query = `
    SELECT 
        product.product_id, 
        product.name, 
        users.email, 
        users.username, 
        users.user_id, 
        product.image_url,
        product.description,
        product.price, 
        statuses.status_name,
        product.created_at,
        product.updated_at,
        product.additional_properties,
        conditions.condition_name,
        delivery_methods.delivery_method_name,
        COALESCE(
            MAX(CASE WHEN categories.category_id != 3 THEN categories.name END), 
            'Retail'
        ) AS category
    FROM 
        product`;
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
        conditions.push(`delivery_methods.delivery_method_name ILIKE $${params.length + 1} AND delivery_methods.delivery_method_id=retail.delivery_method_id`);
        params.push(delivery_method)
    }
    if (category) {
        conditions.push(`categories.name ILIKE $${params.length + 1}`);
        params.push(category)
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += `
    GROUP BY 
        product.product_id, 
        product.name, 
        users.email, 
        users.username, 
        users.user_id, 
        product.image_url,
        product.description,
        product.price, 
        statuses.status_name,
        product.created_at,
        product.updated_at,
        product.additional_properties,
        conditions.condition_name,
        delivery_methods.delivery_method_name
    `;


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
    const productId = req.params.product_id;
    let query = `
    SELECT 
        product.product_id, 
        product.name, 
        users.email, 
        users.username, 
        users.user_id, 
        product.image_url,
        product.description,
        product.price, 
        statuses.status_name,
        product.created_at,
        product.updated_at,
        product.additional_properties,
        conditions.condition_name,
        delivery_methods.delivery_method_name,
          COALESCE(
        MAX(CASE WHEN categories.category_id != 3 THEN categories.name END), 
        'Retail'
    ) AS category
    FROM 
        product`;
    query += getFullJoinTable();
    query += " WHERE product.product_id=$1";
    query += ` GROUP BY 
        product.product_id, 
        product.name, 
        users.email, 
        users.username, 
        users.user_id,
        product.image_url,
        product.description,
        product.price, 
        statuses.status_name,
        product.created_at,
        product.updated_at,
        product.additional_properties,
        conditions.condition_name,
        delivery_methods.delivery_method_name
    `;
    pool.query(query, [productId],
        (err, result) => {
            if (err) {
                console.log(err);
                console.log("error here: 157")
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json(result.rows);
            }
        }
    );
});


// Get retail listings from a single user
router.get('/users/user-listings', async (req, res) => {

    try {
        const userExists = await pool.query(
            `
            SELECT user_id FROM users WHERE user_id = $1
            `,
            [req.session.user_id]
        );

        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let query = `
        SELECT 
            product.product_id, 
            product.name, 
            users.email, 
            users.username, 
            users.user_id, 
            product.image_url,
            product.description,
            product.price, 
            statuses.status_name,
            product.created_at,
            product.updated_at,
            product.additional_properties,
            conditions.condition_name,
            delivery_methods.delivery_method_name,
              COALESCE(
            MAX(CASE WHEN categories.category_id != 3 THEN categories.name END), 
            'Retail'
        ) AS category
        FROM 
            product`;

        query += getFullJoinTable();
        query += ` WHERE users.user_id = $1 `;
        query += `GROUP BY 
            product.product_id, 
            product.name, 
            users.email, 
            users.username, 
            users.user_id,
            product.image_url,
            product.description,
            product.price, 
            statuses.status_name,
            product.created_at,
            product.updated_at,
            product.additional_properties,
            conditions.condition_name,
            delivery_methods.delivery_method_name
        `;
        query += ` ORDER BY product.created_at DESC; `

        pool.query(query, [req.session.user_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error retrieving product");
                } else {
                    if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'No listings found' });
                    }
                    res.status(200).json(result.rows);
                }
            }
        );
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

//delete listing. 
router.delete("/:product_id", async (req, res) => {
    const productId = req.params.product_id;

    let transaction;
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
        transaction = await pool.connect();
        await transaction.query("BEGIN");

        const productCategoryResult = await transaction.query(
            `
            DELETE FROM product_has_category 
            WHERE product_id = $1
            RETURNING product_id
            `,
            [productId]
        );

        if (!productCategoryResult.rows.length) {
            throw new Error(
                'Failed to delete product from product_has_category. Entry does not exist.'
            );
        }

        const retailResult = await transaction.query("DELETE FROM retail WHERE product_id=$1 RETURNING product_id;", [productId]);

        if (!retailResult.rows[0]?.product_id) {
            throw new Error(
                'Failed to delete retail entry or entry does not exist.'
            );
        }

        const productResult = await transaction.query(
            `
            DELETE FROM product 
            WHERE product_id = $1
            RETURNING product_id
            `,
            [productId]
        );

        if (!productResult.rows[0]?.product_id) {
            throw new Error(
                'Failed to delete product entry or entry does not exist.'
            );
        }

        await transaction.query("COMMIT");
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        if (transaction) await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error deleting product");
    } finally {
        if (transaction) transaction.release();
    }
});


//Update Product
router.put("/update/:product_id", async (req, res) => {
    const productId = req.params.product_id;
    let { image_url, name, description, price, status, additional_properties, delivery_method, condition, category } = req.body;
    if (!req.session.user_id) {
        res.status(400).send("Not logged in");
    }
    if (!image_url || !name || !description || !price || !status || !additional_properties || !delivery_method || !condition || !req.session.user_id) {
        return res.status(400).send("Insufficient Information");
    }
    let transaction;
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

        transaction = await pool.connect();
        await transaction.query("BEGIN");

        let setRetail = [];
        let paramsRetail = [];
        let paramIndex = 1;

        if (condition) {
            condition = await getIDFromName(
                "condition_id",
                "conditions",
                "condition_name",
                condition
            );
            setRetail.push(`condition_id = $${paramIndex++}`);
            paramsRetail.push(condition);
        }

        if (delivery_method) {
            delivery_method = await getIDFromName(
                "delivery_method_id",
                "delivery_methods",
                "delivery_method_name",
                delivery_method
            );
            setRetail.push(`delivery_method_id = $${paramIndex++}`);
            paramsRetail.push(delivery_method);
        }

        if (setRetail.length > 0) {
            paramsRetail.push(productId);
            const retailQuery = `UPDATE retail SET ${setRetail.join(", ")} WHERE product_id = $${paramIndex}`;
            await transaction.query(retailQuery, paramsRetail);
        }

        if (category) {
            const categoryQuery =
                ` UPDATE product_has_category 
SET category_id = $1 WHERE product_id = $2 AND category_id != 3;

            `;
            await transaction.query(categoryQuery, [category, productId]);
        }

        let setProduct = [];
        let paramsProduct = [];
        paramIndex = 1;

        if (status) {
            status = await getIDFromName(
                "status_id",
                "statuses",
                "status_name",
                status
            );
            setProduct.push(`status_id = $${paramIndex++}`);
            paramsProduct.push(status);
        }
        if (image_url) {
            setProduct.push(`image_url = $${paramIndex++}`);
            paramsProduct.push(image_url);
        }
        if (name) {
            setProduct.push(`name = $${paramIndex++}`);
            paramsProduct.push(name);
        }
        if (description) {
            setProduct.push(`description = $${paramIndex++}`);
            paramsProduct.push(description);
        }
        if (price) {
            setProduct.push(`price = $${paramIndex++}`);
            paramsProduct.push(price);
        }
        if (additional_properties) {
            setProduct.push(`additional_properties = $${paramIndex++}`);
            paramsProduct.push(additional_properties);
        }



        if (setProduct.length > 0) {
            setProduct.push(`updated_at = NOW()`);
            paramsProduct.push(productId);
            const productQuery = `UPDATE product SET ${setProduct.join(", ")} WHERE product_id = $${paramIndex}`;
            await transaction.query(productQuery, paramsProduct);
        }


        await transaction.query("COMMIT");
        res.status(200).json({
            message: 'retail product updated successfully',
            product_id: productId
        });
    } catch (err) {
        if (transaction) await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error updating product");
    } finally {
        if (transaction) transaction.release();
    }
});


// Get all retail conditions
router.get("/conditions/conditions", async (req, res) => {
    try {
        const query =
            `
            SELECT  * FROM conditions;
        `
        pool.query(query,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error retrieving conditions");
                } else {
                    if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'No conditions found' });
                    }
                    res.status(200).json(result.rows);
                }
            }
        );
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get all retail conditions
router.get("/delivery/methods", async (req, res) => {
    try {
        const query =
            `
            SELECT  * FROM delivery_methods;
        `
        pool.query(query,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error retrieving delivery methods");
                } else {
                    if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'No delivery methods found' });
                    }
                    res.status(200).json(result.rows);
                }
            }
        );
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get all retail statuses
router.get("/status/status", async (req, res) => {
    try {
        const query =
            `
            SELECT  * FROM statuses;
        `
        pool.query(query,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error retrieving statuses");
                } else {
                    if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'No statuses found' });
                    }
                    res.status(200).json(result.rows);
                }
            }
        );
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get all categories of retail products
router.get("/categories/categories", async (req, res) => {
    try {
        const parentId = 3; //retail as parent category
        const query =
            `
            WITH RECURSIVE category_hierarchy AS (
                SELECT 
                    category_id,
                    parent_category_id,
                    name,
                    additional_properties
                FROM 
                    categories
                WHERE 
                    category_id = $1 
                UNION ALL
                SELECT 
                    c.category_id,
                    c.parent_category_id,
                    c.name,
                    c.additional_properties
                FROM 
                    categories c
                INNER JOIN 
                    category_hierarchy ch
                ON 
                    c.parent_category_id = ch.category_id
            )
            SELECT * FROM category_hierarchy;
            `;

        pool.query(query, [parentId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving categories");
            } else {
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'No categories found for the given parent ID' });
                }
                res.status(200).json(result.rows);
            }
        });
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});


//Add new retail product
router.post("/new", async (req, res) => {
    let { image_url, name, description, price, status, additional_properties, delivery_method, condition, categories } = req.body;
    if (!req.session.user_id) {
        res.status(400).send("Not logged in");
    }
    if (!image_url || !name || !description || !price || !status || !additional_properties || !delivery_method || !condition || !req.session.user_id) {
        return res.status(400).send("Insufficient Information");
    }
    let transaction;
    try {
        transaction = await pool.connect();
        await transaction.query("BEGIN");

        status = await getIDFromName("status_id", "statuses", "status_name", status);

        const productInsertQuery = `
            INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING product_id;
        `;
        const productResult = await transaction.query(productInsertQuery, [req.session.user_id, image_url, name, description, price, status, additional_properties]);
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

        const productCategoryResult = await transaction.query(
            `
            INSERT INTO product_has_category (product_id, category_id)
            VALUES ($1, $2)
            RETURNING product_id
            `,
            [productId, 3]
        );

        if (categories) {
            const categoryInsertQuery =
                `
                INSERT INTO product_has_category (product_id, category_id)
                VALUES ($1, $2)
                RETURNING product_id
                `;
            const categoryResult = await (transaction.query(categoryInsertQuery, [productId, categories]))
            if (!categoryResult.rows[0]?.product_id) {
                throw new Error('Failed to insert product category.');
            }
        }

        if (!productCategoryResult.rows[0]?.product_id) {
            throw new Error('Failed to insert into product_has_category.');
        }
        await transaction.query("COMMIT");
        res.status(201).json({ message: "Product added successfully", productId });
    } catch (err) {
        if (transaction) await transaction.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error creating product");
    } finally {
        if (transaction) transaction.release();
    }
});

module.exports = router;


function getFullJoinTable() {
    let query = " join retail on retail.product_id=product.product_id join users on product.user_id=users.user_id join delivery_methods on retail.delivery_method_id=delivery_methods.delivery_method_id";
    query += " join conditions on retail.condition_id=conditions.condition_id JOIN address on address.address_id=users.address_id JOIN statuses on statuses.status_id=product.status_id";
    query += " join product_has_category on product_has_category.product_id=product.product_id join categories on categories.category_id=product_has_category.category_id"
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
async function validateProductOwnership(product_id, user_id) {
    // Check if user_id is provided and valid
    if (!user_id) {
        return {
            success: false,
            message: 'Permission denied: User ID is missing or invalid'
        };
    }

    let query = await pool.connect();
    // Query to check ownership
    const productOwnerQuery = `SELECT user_id FROM product WHERE product_id = $1`;
    const productOwnerResult = await query.query(productOwnerQuery, [product_id]);
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