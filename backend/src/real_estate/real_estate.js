const express = require('express');
const router = express.Router();

const pool = require('../pool');
const checkAuth = require('../auth/auth.js');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Real Estate Routes Work'
    });
});

// Get all real-estate listings
router.get('/listings', async (req, res) => {
    const {
        category_id,
        type_id,
        min_price,
        max_price,
        rent_start,
        rent_end,
        province,
        city,
        available_now,
        additional_properties
    } = req.body;

    try {
        // Base query
        let query = `
            SELECT re.product_id, u.email, u.username, p.image_url, p.name, p.description, p.price, 
                   s.status_name, p.created_at, p.updated_at, p.additional_properties, t.type_name, 
                   a.city, a.address, a.province, re.address_details, re.advance_payment, re.rent_start, re.rent_end
            FROM real_estate re 
            INNER JOIN product p ON re.product_id = p.product_id 
            INNER JOIN address a ON re.address_id = a.address_id
            INNER JOIN real_estate_types t ON re.type_id = t.type_id
            INNER JOIN users u ON p.user_id = u.user_id
            INNER JOIN statuses s ON p.status_id = s.status_id
            LEFT JOIN product_has_category pc ON p.product_id = pc.product_id
            WHERE 1=1
        `;

        // Parameters for query
        const params = [];

        // Add category filter
        if (category_id) {
            query += ` AND pc.category_id = $${params.length + 1}`;
            params.push(category_id);
        }

        // Add real estate type filter
        if (type_id) {
            query += ` AND re.type_id = $${params.length + 1}`;
            params.push(type_id);
        }

        // Add price range filter
        if (min_price) {
            query += ` AND p.price >= $${params.length + 1}`;
            params.push(min_price);
        }
        if (max_price) {
            query += ` AND p.price <= $${params.length + 1}`;
            params.push(max_price);
        }

        // Add renting period filter
        if (rent_start) {
            query += ` AND re.rent_start >= $${params.length + 1}`;
            params.push(rent_start);
        }
        if (rent_end) {
            query += ` AND re.rent_end <= $${params.length + 1}`;
            params.push(rent_end);
        }

        // Add address filters
        if (province) {
            query += ` AND a.province = $${params.length + 1}`;
            params.push(province);
        }
        if (city) {
            query += ` AND a.city = $${params.length + 1}`;
            params.push(city);
        }

        // Add availability filter
        if (available_now) {
            query += ` AND s.status_name = 'Available' AND re.rent_start <= NOW() AND re.rent_end > NOW()`;
        }

        // Add additional properties filter
        if (additional_properties) {
            const additionalProps = JSON.parse(additional_properties);
            for (const [key, value] of Object.entries(additionalProps)) {
                query += ` AND p.additional_properties->>$${
                    params.length + 1
                } = $${params.length + 2}`;
                params.push(key, value);
            }
        }

        query += ` ORDER BY p.created_at DESC;`;

        const filteredListings = await pool.query(query, params);

        if (filteredListings.rows.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        res.status(200).json(filteredListings.rows);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send(`Server Error: ${error.message}`);
    }
});

router.get('/listings/:product_id', async (req, res) => {
    const { product_id } = req.params;
    try {
        const allListings = await pool.query(
            `
            SELECT  re.product_id, u.email, u.username, p.image_url, p.name, p.description, p.price, 
            s.status_name, p.created_at, p.updated_at, p.additional_properties, t.type_name, 
            a.city, a.address, a.province, re.address_details, re.advance_payment, re.rent_start, re.rent_end
            FROM real_estate re INNER JOIN product p ON re.product_id = p.product_id 
            INNER JOIN address a ON re.address_id = a.address_id
            INNER JOIN real_estate_types t ON re.type_id = t.type_id
            INNER JOIN users u ON p.user_id = u.user_id
            INNER JOIN statuses s ON p.status_id = s.status_id
            WHERE re.product_id = $1
        `,
            [product_id]
        );

        if (allListings.rows.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        res.status(200).json(allListings.rows[0]);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Helper method to validate product ownership with user_id stored in request token
async function validateProductOwnership(transaction, product_id, user_id) {
    // Check if user_id is provided and valid
    if (!user_id) {
        return {
            success: false,
            message: 'Permission denied: User ID is missing or invalid'
        };
    }

    // Query to check ownership
    const productOwnerResult = await transaction.query(
        `
        SELECT user_id FROM product WHERE product_id = $1
        `,
        [product_id]
    );

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

// Get real-estate listings from a single user
router.get('/user-listings', async (req, res) => {
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

        const allListings = await pool.query(
            `
            SELECT re.product_id, u.email, u.username, p.image_url, p.name, p.description, p.price, 
            s.status_name, p.created_at, p.updated_at, p.additional_properties, t.type_name, 
            a.city, a.address, a.province, re.address_details, re.advance_payment, re.rent_start, re.rent_end
            FROM real_estate re INNER JOIN product p ON re.product_id = p.product_id 
            INNER JOIN address a ON re.address_id = a.address_id
            INNER JOIN real_estate_types t ON re.type_id = t.type_id
            INNER JOIN users u ON p.user_id = u.user_id
            INNER JOIN statuses s ON p.status_id = s.status_id
            WHERE u.user_id = $1
            ORDER BY p.created_at DESC;
            `,
            [req.session.user_id]
        );

        if (allListings.rows.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        res.status(200).json(allListings.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Create new real-estate listing
router.post('/new', async (req, res) => {
    const {
        image_url,
        name,
        description,
        price,
        status_name,
        additional_properties,
        city,
        address,
        province,
        type_name,
        address_details,
        advance_payment,
        rent_start,
        rent_end
    } = req.body;
    let transaction;
    try {
        transaction = await pool.connect();

        await transaction.query('BEGIN');

        let status_id = null;
        if (status_name !== undefined) {
            status_id = await getStatusIdByName(transaction, status_name);
        }

        let type_id = null;
        if (type_name !== undefined) {
            type_id = await getTypeIdByName(transaction, type_name);
        }

        const productResult = await transaction.query(
            `
            INSERT INTO product (user_id, status_id, image_url, name, description, price,
            created_at, updated_at, additional_properties) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)
            RETURNING product_id
            `,
            [
                req.session.user_id,
                status_id,
                image_url,
                name,
                description,
                price,
                additional_properties
            ]
        );
        if (!productResult.rows[0]?.product_id) {
            throw new Error('Failed to insert product.');
        }
        const product_id = productResult.rows[0].product_id;

        const addressResult = await transaction.query(
            `
            INSERT INTO address (city, address, province) 
            VALUES ($1, $2, $3)
            RETURNING address_id
            `,
            [city, address, province]
        );

        if (!addressResult.rows[0]?.address_id) {
            throw new Error('Failed to insert product (address).');
        }
        const address_id = addressResult.rows[0].address_id;

        const realEstateResult = await transaction.query(
            `
            INSERT INTO real_estate (product_id, address_id, type_id, address_details, advance_payment, rent_start, rent_end) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING product_id
            `,
            [
                product_id,
                address_id,
                type_id,
                address_details,
                advance_payment,
                rent_start,
                rent_end
            ]
        );

        if (!realEstateResult.rows[0]?.product_id) {
            throw new Error('Failed to insert real estate entry.');
        }

        const productCategoryResult = await transaction.query(
            `
            INSERT INTO product_has_category (product_id, category_id)
            VALUES ($1, $2)
            RETURNING product_id
            `,
            [product_id, 2]
        );

        if (!productCategoryResult.rows[0]?.product_id) {
            throw new Error('Failed to insert into product_has_category.');
        }

        await transaction.query('COMMIT');
        res.status(200).json({
            message: 'Real estate listing created successfully',
            product_id: product_id
        });
    } catch (error) {
        await transaction.query('ROLLBACK');
        res.status(500).send(`Server Error: ${error}`);
    } finally {
        transaction.release();
    }
});

// Delete a real estate listing
// TODO: Validate that the product_id belongs to the user sending the request
router.delete('/:product_id', async (req, res) => {
    const { product_id } = req.params;
    let transaction;
    try {
        transaction = await pool.connect();

        await transaction.query('BEGIN');

        const ownershipValidation = await validateProductOwnership(
            transaction,
            product_id,
            req.session.user_id
        );

        if (!ownershipValidation.success) {
            await transaction.query('ROLLBACK');
            return res
                .status(403)
                .json({ message: ownershipValidation.message });
        }

        const messagesResult = await transaction.query(
            `
            DELETE FROM messages
            WHERE product_id = $1
            RETURNING message_id
            `,
            [product_id]
        );

        const productCategoryResult = await transaction.query(
            `
            DELETE FROM product_has_category 
            WHERE product_id = $1
            RETURNING product_id
            `,
            [product_id]
        );

        if (!productCategoryResult.rows.length) {
            throw new Error(
                'Failed to delete product from product_has_category. Entry does not exist.'
            );
        }

        // Delete from the `real_estate` table
        const realEstateResult = await transaction.query(
            `
            DELETE FROM real_estate 
            WHERE product_id = $1
            RETURNING product_id
            `,
            [product_id]
        );

        if (!realEstateResult.rows[0]?.product_id) {
            throw new Error(
                'Failed to delete real estate entry or entry does not exist.'
            );
        }

        // Delete from the `address` table (if address is not reused)
        const addressResult = await transaction.query(
            `
            DELETE FROM address 
            WHERE address_id IN (
                SELECT address_id FROM real_estate WHERE product_id = $1
            )
            RETURNING address_id
            `,
            [product_id]
        );

        // Delete from the `product` table
        const productResult = await transaction.query(
            `
            DELETE FROM product 
            WHERE product_id = $1
            RETURNING product_id
            `,
            [product_id]
        );

        if (!productResult.rows[0]?.product_id) {
            throw new Error(
                'Failed to delete product entry or entry does not exist.'
            );
        }

        await transaction.query('COMMIT');

        res.status(200).json({
            message: 'Real estate listing deleted successfully',
            product_id: product_id
        });
    } catch (error) {
        await transaction.query('ROLLBACK');
        console.error('Transaction Error:', error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    } finally {
        transaction.release();
    }
});

// Helper method to get the status_id based on the status_name
async function getStatusIdByName(transaction, status_name) {
    const result = await transaction.query(
        `
        SELECT status_id FROM statuses
        WHERE status_name = $1
        LIMIT 1
        `,
        [status_name]
    );

    if (result.rows.length === 0) {
        throw new Error(`Invalid status name: ${status_name}`);
    }
    return result.rows[0].status_id;
}

// Helper method to get the type_id based on the type_name
async function getTypeIdByName(transaction, type_name) {
    const query = `
        SELECT type_id FROM real_estate_types
        WHERE type_name = $1
        LIMIT 1
    `;
    const result = await transaction.query(query, [type_name]);

    if (result.rows.length === 0) {
        throw new Error(`Invalid type name: '${type_name}'`);
    }

    return result.rows[0].type_id;
}

// Helper function to update the products table dynamically based on what the user provides
async function updateProduct(transaction, product_id, updates) {
    const {
        status_id,
        image_url,
        name,
        description,
        price,
        additional_properties
    } = updates;
    const fields = [];
    const values = [];
    let index = 1;

    if (status_id !== undefined && status_id !== null) {
        fields.push(`status_id = $${index}`);
        values.push(status_id);
        index++;
    }
    if (image_url !== undefined) {
        fields.push(`image_url = $${index}`);
        values.push(image_url);
        index++;
    }
    if (name !== undefined) {
        fields.push(`name = $${index}`);
        values.push(name);
        index++;
    }
    if (description !== undefined) {
        fields.push(`description = $${index}`);
        values.push(description);
        index++;
    }
    if (price !== undefined) {
        fields.push(`price = $${index}`);
        values.push(price);
        index++;
    }
    if (additional_properties !== undefined) {
        fields.push(`additional_properties = $${index}`);
        values.push(additional_properties);
        index++;
    }

    if (fields.length > 0) {
        values.push(product_id);
        const query = `
            UPDATE product
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE product_id = $${index}
            RETURNING product_id
        `;
        const result = await transaction.query(query, values);
        if (!result.rows[0]?.product_id) {
            throw new Error(
                'Failed to update product or product does not exist.'
            );
        }
    }
}

// Helper function to update the address table dynamically based on what the user provides
async function updateAddress(transaction, address_id, updates) {
    const { city, address, province } = updates;
    const fields = [];
    const values = [];
    let index = 1;

    if (city !== undefined) {
        fields.push(`city = $${index}`);
        values.push(city);
        index++;
    }
    if (address !== undefined) {
        fields.push(`address = $${index}`);
        values.push(address);
        index++;
    }
    if (province !== undefined) {
        fields.push(`province = $${index}`);
        values.push(province);
        index++;
    }

    if (fields.length > 0) {
        values.push(address_id);
        const query = `
            UPDATE address
            SET ${fields.join(', ')}
            WHERE address_id = $${index}
            RETURNING address_id
        `;
        const result = await transaction.query(query, values);
        if (!result.rows[0]?.address_id) {
            throw new Error('Failed to update address.');
        }
    }
}

// Helper function to update the real_estate table dynamically based on what the user provides
async function updateRealEstate(transaction, product_id, updates) {
    const { type_id, address_details, advance_payment, rent_start, rent_end } =
        updates;
    const fields = [];
    const values = [];
    let index = 1;

    if (type_id !== undefined && type_id !== null) {
        fields.push(`type_id = $${index}`);
        values.push(type_id);
        index++;
    }
    if (address_details !== undefined) {
        fields.push(`address_details = $${index}`);
        values.push(address_details);
        index++;
    }
    if (advance_payment !== undefined) {
        fields.push(`advance_payment = $${index}`);
        values.push(advance_payment);
        index++;
    }
    if (rent_start !== undefined) {
        fields.push(`rent_start = $${index}`);
        values.push(rent_start);
        index++;
    }
    if (rent_end !== undefined) {
        fields.push(`rent_end = $${index}`);
        values.push(rent_end);
        index++;
    }

    if (fields.length > 0) {
        values.push(product_id);
        const query = `
            UPDATE real_estate
            SET ${fields.join(', ')}
            WHERE product_id = $${index}
            RETURNING product_id
        `;
        const result = await transaction.query(query, values);
        if (!result.rows[0]?.product_id) {
            throw new Error('Failed to update real estate entry.');
        }
    }
}

// Main Route to update the Product
router.put('/update/:product_id', async (req, res) => {
    const transaction = await pool.connect();
    const { product_id } = req.params;

    const {
        image_url,
        name,
        description,
        price,
        status_name,
        additional_properties,
        city,
        address,
        province,
        type_name,
        address_details,
        advance_payment,
        rent_start,
        rent_end
    } = req.body;

    try {
        await transaction.query('BEGIN');

        const ownershipValidation = await validateProductOwnership(
            transaction,
            product_id,
            req.session.user_id
        );

        if (!ownershipValidation.success) {
            await transaction.query('ROLLBACK');
            return res
                .status(403)
                .json({ message: ownershipValidation.message });
        }

        let status_id = null;
        if (status_name !== undefined) {
            status_id = await getStatusIdByName(transaction, status_name);
        }

        let type_id = null;
        if (type_name !== undefined) {
            type_id = await getTypeIdByName(transaction, type_name);
        }

        await updateProduct(transaction, product_id, {
            status_id,
            image_url,
            name,
            description,
            price,
            additional_properties
        });

        const addressResult = await transaction.query(
            `
            SELECT address_id FROM real_estate
            WHERE product_id = $1
            `,
            [product_id]
        );

        if (addressResult.rows.length > 0) {
            const address_id = addressResult.rows[0].address_id;

            await updateAddress(transaction, address_id, {
                city,
                address,
                province
            });
        }

        await updateRealEstate(transaction, product_id, {
            type_id,
            address_details,
            advance_payment,
            rent_start,
            rent_end
        });

        await transaction.query('COMMIT');
        res.status(200).json({
            message: 'Real estate listing updated successfully',
            product_id: product_id
        });
    } catch (error) {
        await transaction.query('ROLLBACK');
        console.error('Transaction Error:', error);
        res.status(500).send(`Server Error: ${error.message}`);
    } finally {
        transaction.release();
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Real Estate Routes Work'
    });
});

// Ge all types
router.get('/types', async (req, res) => {
    try {
        const real_estate_types = await pool.query(
            `
            SELECT  * FROM real_estate_types;
        `
        );

        if (real_estate_types.rows.length === 0) {
            return res
                .status(404)
                .json({ message: 'No realestate types found' });
        }

        res.status(200).json(real_estate_types.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});
module.exports = router;
