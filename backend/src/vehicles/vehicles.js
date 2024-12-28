const express = require("express");
const router = express.Router();

const pool = require("../pool");
const checkAuth = require("../auth/auth.js");

router.get("/", async (req, res) => {
    const {
        search,
        minPrice,
        maxPrice,
        sellerAdress,
        model,
        mark,
        type,
        top_level_category,
        registration,
        fuel_type,
        color,
        condition,
    } = req.body;
    let query =
        "SELECT product.product_id, product.name, users.email, users.username, product.image_url, product.description, product.price, statuses.status_name, product.additional_properties, vehicle_marks.mark_name, vehicle_models.model_name, vehicle_types.type_name, vehicles.first_registration_date, vehicles.mileage, fuel_types.fuel_type_name, vehicles.color, conditions.condition_name FROM product";
    query += getFullJoinTable();
    let params = [];
    let conditions = [];

    if (search) {
        conditions.push(
            `(product.name ILIKE $${
                params.length + 1
            } OR product.description ILIKE $${params.length + 1})`
        );
        params.push(`%${search}%`);
    }

    if (minPrice && maxPrice && minPrice < maxPrice) {
        conditions.push(
            `p.price BETWEEN $${params.length + 1} AND $${params.length + 2}`
        );
        params.push(minPrice, maxPrice);
    }
    if (sellerAdress) {
        conditions.push(`address.city=$${params.length + 1}`);
        params.push(sellerAdress);
    }
    if (model) {
        conditions.push(
            `vehicle_models.model_name ILIKE $${params.length + 1}`
        );
        params.push(model);
    }
    if (mark) {
        conditions.push(
            `vehicle_marks.mark_name=$${
                params.length + 1
            } AND vehicles.mark_id=vehicle_marks.mark_id`
        );
        params.push(mark);
    }
    if (type) {
        conditions.push(
            `vehicle_types.type_name ILIKE $${
                params.length + 1
            } AND vehicles.type_id=vehicle_types.type_id`
        );
        params.push(type);
    }
    if (top_level_category) {
        conditions.push(
            `vehicle_types.top_level_category ILIKE $${
                params.length + 1
            } AND vehicles.type_id=vehicle_types.type_id`
        );
        params.push(top_level_category);
    }
    if (registration) {
        conditions.push(
            `vehicles.first_registration_date>$${params.length + 1}`
        );
        params.push(registration);
    }
    if (fuel_type) {
        conditions.push(
            `fuel_types.fuel_type_name=$${
                params.length + 1
            } AND vehicles.fuel_type_id=fuel_types.fuel_type_id`
        );
        params.push(fuel_type);
    }
    if (color) {
        conditions.push(`vehicles.color=$${params.length + 1}`);
        params.push(color);
    }
    if (condition) {
        conditions.push(
            `conditions.condition_name ILIKE $${
                params.length + 1
            } AND conditions.condition_id=vehicles.condition_id`
        );
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
router.get("/:product_id", async (req, res) => {
    if (isNaN(req.params.product_id)) {
        res.status(400).send("Incorrect Input");
    } else {
        let query =
            "SELECT product.product_id, product.name, users.email, users.username, product.image_url, product.description, product.price, statuses.status_name, product.additional_properties, vehicle_marks.mark_name, vehicle_models.model_name, vehicle_types.type_name, vehicles.first_registration_date, vehicles.mileage, fuel_types.fuel_type_name, vehicles.color, conditions.condition_name FROM product";
        query += getFullJoinTable();
        query += " WHERE product.product_id=$1";
        const productId = req.params.product_id;
        await pool.query(query, [productId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error retrieving product");
            } else {
                res.status(200).json(result.rows[0]);
            }
        });
    }
});

// Get vehicle listings from a single user
router.get("/users/user-listings", async (req, res) => {
    try {
        const userExists = await pool.query(
            `
            SELECT user_id FROM users WHERE user_id = $1
            `,
            [req.session.user_id]
        );

        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        let query =
            "SELECT product.product_id, product.name, users.email, users.username, product.image_url, product.description, product.price, statuses.status_name, product.additional_properties, vehicle_marks.mark_name, vehicle_models.model_name, vehicle_types.type_name, vehicles.first_registration_date, vehicles.mileage, fuel_types.fuel_type_name, vehicles.color, conditions.condition_name FROM product";
        query += getFullJoinTable();
        query += " WHERE users.user_id = $1 ORDER BY product.created_at DESC;";

        const allListings = await pool.query(query, [req.session.user_id]);

        if (allListings.rows.length === 0) {
            return res.status(404).json({ message: "No listings found" });
        }

        res.status(200).json(allListings.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get all vehicle types
router.get("/types/types", async (req, res) => {
    try {
        const vehicle_types = await pool.query(
            `
            SELECT  * FROM vehicle_types;
        `
        );

        if (vehicle_types.rows.length === 0) {
            return res.status(404).json({ message: "No vehicle types found" });
        }

        res.status(200).json(vehicle_types.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});
// Get all vehicle marks
router.get("/marks/marks", async (req, res) => {
    try {
        const vehicle_marks = await pool.query(
            `
            SELECT  * FROM vehicle_marks;
        `
        );

        if (vehicle_marks.rows.length === 0) {
            return res.status(404).json({ message: "No vehicle marks found" });
        }

        res.status(200).json(vehicle_marks.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});
// Get all vehicle fuel Types
router.get("/fuel_types/fuel_types", async (req, res) => {
    try {
        const vehicle_fuel_types = await pool.query(
            `
            SELECT  * FROM fuel_types;
        `
        );

        if (vehicle_fuel_types.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "No vehicle fuel types found" });
        }

        res.status(200).json(vehicle_fuel_types.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get all vehicle conditions
router.get("/conditions/conditions", async (req, res) => {
    try {
        const vehicle_conditions = await pool.query(
            `
            SELECT  * FROM conditions;
        `
        );

        if (vehicle_conditions.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "No vehicle conditions found" });
        }

        res.status(200).json(vehicle_conditions.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});
//delete listing.
//TODO CHECK FOR VALIDATION
router.delete("/:product_id", async (req, res) => {
    const transaction = await pool.connect();
    if (isNaN(req.params.product_id)) {
        res.status(400).send("Incorrect Input");
    } else {
        await transaction.query("BEGIN");
        try {
            const productId = req.params.product_id;
            let query = "DELETE FROM product_has_category where product_id=$1;";

            let result = await transaction.query(query, [productId]);

            query = "DELETE FROM vehicles where product_id=$1;";
            result = await transaction.query(query, [productId]);

            query = "DELETE FROM product where product_id=$1";
            result = await transaction.query(query, [productId]);
            await transaction.query("COMMIT");
            res.status(200).send("Successfully deleted product");
        } catch (error) {
            await transaction.query("ROLLBACK");
            res.status(500).send(`Server Error ${error}`);
        } finally {
            transaction.release();
        }
    }
});

//Update Product
//TODO check for validation
router.put("/:product_id", async (req, res) => {
    const productId = parseInt(req.params.product_id, 10);
    if (isNaN(productId)) {
        return res.status(400).send("Invalid product ID");
    }

    const {
        mark,
        model,
        type,
        first_registration,
        mileage,
        fuel_type,
        color,
        condition,
        image_url,
        name,
        description,
        price,
        status,
        additional_properties,
    } = req.body;

    const transaction = await pool.connect();
    await transaction.query("BEGIN");

    try {
        const vehicleUpdates = [];
        const vehicleParams = [];

        // Update vehicle
        if (mark) {
            const markId = await getIDFromName(
                "mark_id",
                "vehicle_marks",
                "mark_name",
                mark
            );
            vehicleUpdates.push(`mark_id = $${vehicleParams.length + 1}`);
            vehicleParams.push(markId);
        }
        if (model) {
            const modelId = await getIDFromName(
                "model_id",
                "vehicle_models",
                "model_name",
                model
            );
            vehicleUpdates.push(`model_id = $${vehicleParams.length + 1}`);
            vehicleParams.push(modelId);
        }
        if (type) {
            const typeId = await getIDFromName(
                "type_id",
                "vehicle_types",
                "type_name",
                type
            );
            vehicleUpdates.push(`type_id = $${vehicleParams.length + 1}`);
            vehicleParams.push(typeId);
        }
        if (fuel_type) {
            const fuelTypeId = await getIDFromName(
                "fuel_type_id",
                "fuel_types",
                "fuel_type_name",
                fuel_type
            );
            vehicleUpdates.push(`fuel_type_id = $${vehicleParams.length + 1}`);
            vehicleParams.push(fuelTypeId);
        }
        if (condition) {
            const conditionId = await getIDFromName(
                "condition_id",
                "conditions",
                "condition_name",
                condition
            );
            vehicleUpdates.push(`condition_id = $${vehicleParams.length + 1}`);
            vehicleParams.push(conditionId);
        }
        if (first_registration) {
            vehicleUpdates.push(
                `first_registration_date = $${vehicleParams.length + 1}`
            );
            vehicleParams.push(first_registration);
        }
        if (mileage) {
            vehicleUpdates.push(`mileage = $${vehicleParams.length + 1}`);
            vehicleParams.push(mileage);
        }
        if (color) {
            vehicleUpdates.push(`color = $${vehicleParams.length + 1}`);
            vehicleParams.push(color);
        }

        if (vehicleUpdates.length > 0) {
            const vehicleQuery = `
                UPDATE vehicles 
                SET ${vehicleUpdates.join(", ")} 
                WHERE product_id = $${vehicleParams.length + 1}
            `;
            vehicleParams.push(productId);
            await transaction.query(vehicleQuery, vehicleParams);
        }

        // Update product
        const productUpdates = [];
        const productParams = [];

        if (status) {
            const statusId = await getIDFromName(
                "status_id",
                "statuses",
                "status_name",
                status
            );
            productUpdates.push(`status_id = $${productParams.length + 1}`);
            productParams.push(statusId);
        }
        if (image_url) {
            productUpdates.push(`image_url = $${productParams.length + 1}`);
            productParams.push(image_url);
        }
        if (name) {
            productUpdates.push(`name = $${productParams.length + 1}`);
            productParams.push(name);
        }
        if (description) {
            productUpdates.push(`description = $${productParams.length + 1}`);
            productParams.push(description);
        }
        if (price) {
            productUpdates.push(`price = $${productParams.length + 1}`);
            productParams.push(price);
        }
        if (additional_properties) {
            productUpdates.push(
                `additional_properties = $${productParams.length + 1}`
            );
            productParams.push(additional_properties);
        }

        if (productUpdates.length > 0) {
            const productQuery = `
                UPDATE product 
                SET ${productUpdates.join(", ")} 
                WHERE product_id = $${productParams.length + 1}
            `;
            productParams.push(productId);
            await transaction.query(productQuery, productParams);
        }

        await transaction.query("COMMIT");
        res.status(200).send("Successfully updated vehicle and product");
    } catch (error) {
        await transaction.query("ROLLBACK");
        console.error("Error updating vehicle:", error);
        res.status(500).send(`Error updating vehicle. ${error.message}`);
    } finally {
        transaction.release();
    }
});

//Add new car
router.post("/", async (req, res) => {
    let {
        mark_name,
        model_name,
        type_name,
        first_registration,
        mileage,
        fuel_type,
        color,
        condition,
        image_url,
        name,
        description,
        price,
        status,
        additional_properties,
    } = req.body;
    if (
        !mark_name ||
        !model_name ||
        !type_name ||
        !first_registration ||
        !mileage ||
        !fuel_type ||
        !color ||
        !condition ||
        !image_url ||
        !name ||
        !description ||
        !price ||
        !status ||
        !additional_properties
    ) {
        res.status(400).send("Insufficient Information");
    } else {
        const transaction = await pool.connect();
        await transaction.query("BEGIN");
        try {
            //Adding for product
            status = await getIDFromName(
                "status_id",
                "statuses",
                "status_name",
                status
            );

            const productValues = [
                req.session.user_id,
                image_url,
                name,
                description,
                price,
                status,
                additional_properties,
            ];

            const productInsertQuery = `
      INSERT INTO product (user_id, image_url, name, description, price, status_id, additional_properties)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING product_id;
    `;

            const productResult = await transaction.query(
                productInsertQuery,
                productValues
            );
            if (productResult.rows.length === 0) {
                throw new Error("Error inserting product");
            }
            const productId = productResult.rows[0].product_id;

            //Adding for vehicle
            mark = await getIDFromName(
                "mark_id",
                "vehicle_marks",
                "mark_name",
                mark_name
            );

            type = await getIDFromName(
                "type_id",
                "vehicle_types",
                "type_name",
                type_name
            );
            fuel_type = await getIDFromName(
                "fuel_type_id",
                "fuel_types",
                "fuel_type_name",
                fuel_type
            );
            condition = await getIDFromName(
                "condition_id",
                "conditions",
                "condition_name",
                condition
            );
            if (
                isNaN(mark) ||
                isNaN(type) ||
                isNaN(fuel_type) ||
                isNaN(condition)
            ) {
                throw new Error("Incorrect Input");
            }
            let model = -1;
            //Checking if model already exists, otherwise adding it
            let modelquery =
                "Select model_id from vehicle_models where model_name=$1";

            let modelresult = await transaction.query(modelquery, [model_name]);
            if (modelresult.rows.length === 0) {
                //Model doesnt exist yet so insert into models

                const modelInsertQuery = `INSERT INTO vehicle_models (mark_id, model_name) VALUES ($1, $2) RETURNING model_id;`;
                modelInsertValues = [mark, model_name];
                modelResult = await transaction.query(
                    modelInsertQuery,
                    modelInsertValues
                );
                model = modelResult.rows[0].model_id;
            } else {
                //Model already exists so get its id
                model = getIDFromName(
                    "model_id",
                    "vehicle_models",
                    "model_name",
                    model_name
                );
            }
            const vehicleValues = [
                productId,
                mark,
                model,
                type,
                first_registration,
                mileage,
                fuel_type,
                color,
                condition,
            ];

            const vehicleInsertQuery = `
      INSERT INTO vehicles (product_id, mark_id, model_id, type_id, first_registration_date, mileage, fuel_type_id, color, condition_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING product_id;`;

            const result = await transaction.query(
                vehicleInsertQuery,
                vehicleValues
            );
            if (result.rows.length === 0) {
                throw new Error("Error inserting product");
            }
            await transaction.query("COMMIT");

            res.status(200).json("Successfully inserted product");
        } catch (error) {
            await transaction.query("ROLLBACK");
            res.status(500).send(`Error ${error}`);
        } finally {
            transaction.release();
        }
    }
});
//get all messages between users
router.get("/messages/message", async (req, res) => {
    const { from_user, to_user, product } = req.body;

    if (!from_user || !to_user || !product) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    from_user_id = await getIDFromName("user_id", "users", "email", from_user);
    to_user_id = await getIDFromName("user_id", "users", "email", to_user);
    productId = await getIDFromName("product_id", "product", "name", product);
    if (isNaN(from_user_id) || isNaN(to_user_id) || isNaN(productId)) {
        res.status(500).send("Incorrect input");
    } else {
        try {
            const query = `SELECT fu.email AS from_user_email, tu.email AS to_user_email, p.name AS product_name, m.message AS message, m.created_at as sent_at
        FROM messages m JOIN users fu ON m.from_user_id = fu.user_id JOIN users tu ON m.to_user_id = tu.user_id JOIN product p ON m.product_id = p.product_id
        WHERE ((m.from_user_id = $1 AND m.to_user_id = $2) OR (m.from_user_id=$2 AND m.to_user_id=$1)) AND m.product_id = $3 ORDER BY m.created_at ASC`;
            const result = await pool.query(query, [
                from_user_id,
                to_user_id,
                productId,
            ]);
            if (result.rows.length === 0) {
                res.status(404).json({ message: "No messages found" });
            } else {
                res.status(200).json(result.rows);
            }
        } catch (error) {
            console.error("Error retrieving messages:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

//Add a new message into the system
router.post("/messages/message", async (req, res) => {
    const { from_user, to_user, product, message } = req.body;

    if (!from_user || !to_user || !product || !message) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    from_user_id = await getIDFromName("user_id", "users", "email", from_user);
    to_user_id = await getIDFromName("user_id", "users", "email", to_user);
    productId = await getIDFromName("product_id", "product", "name", product);
    if (isNaN(from_user_id) || isNaN(to_user_id) || isNaN(productId)) {
        res.status(500).send("Incorrect input");
    } else {
        try {
            // Query to insert a new message
            const query = `
    INSERT INTO messages (from_user_id, to_user_id, product_id, message)
    VALUES ($1, $2, $3,$4) RETURNING message_id;`;
            const result = await pool.query(query, [
                from_user_id,
                to_user_id,
                productId,
                message,
            ]);
            if (result.rows.length === 0) {
                res.status(404).json({ message: "No messages found" });
            } else {
                res.status(200).json("succesfully inserted message");
            }
        } catch (error) {
            console.error("Error inserting messages:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

module.exports = router;

function getFullJoinTable() {
    let query =
        " INNER JOIN vehicles on vehicles.product_id=product.product_id INNER JOIN users on product.user_id=users.user_id INNER JOIN vehicle_marks on vehicles.mark_id=vehicle_marks.mark_id";
    query +=
        " INNER JOIN vehicle_types on vehicle_types.type_id=vehicles.type_id INNER JOIN vehicle_models on vehicle_models.model_id=vehicles.model_id";
    query +=
        " INNER JOIN fuel_types on vehicles.fuel_type_id=fuel_types.fuel_type_id INNER JOIN conditions on vehicles.condition_id=conditions.condition_id INNER JOIN statuses on product.status_id=statuses.status_id";
    return query;
}

//ALWAYS USE AWAIT WHEN USING THIS FUNCTION!!!!!
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
            return `${name} not found in ${tableName}`;
        }

        return result.rows[0][idRowName];
    } catch (error) {
        console.error(error.message);
        return `Error in getIDFromName: ${error.message}`;
    }
}
