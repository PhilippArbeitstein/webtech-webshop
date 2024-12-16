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
            ORDER BY p.created_at DESC;
        `
        );

        if (allListings.rows.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        res.status(200).json(allListings.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

// Get real-estate listings from a single user
router.get('/user-listings', async (req, res) => {
    const { user_id } = req.body;
    try {
        const userExists = await pool.query(
            `
            SELECT user_id FROM users WHERE user_id = $1
            `,
            [user_id]
        );

        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

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
            WHERE u.user_id = $1
            ORDER BY p.created_at DESC;
            `,
            [user_id]
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
    const transaction = await pool.connect();
    const {
        user_id,
        image_url,
        name,
        description,
        price,
        status_id,
        additional_properties,
        city,
        address,
        province,
        type_id,
        address_details,
        advance_payment,
        rent_start,
        rent_end
    } = req.body;
    try {
        await transaction.query('BEGIN');

        const productResult = await transaction.query(
            `
            INSERT INTO product (user_id, status_id, image_url, name, description, price,
            created_at, updated_at, additional_properties) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)
            RETURNING product_id
            `,
            [
                user_id,
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
router.delete('/delete/:product_id', async (req, res) => {
    const transaction = await pool.connect();
    const { product_id } = req.params;

    try {
        await transaction.query('BEGIN');

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

    if (status_id !== undefined) {
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

    if (type_id !== undefined) {
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
        status_id,
        additional_properties,
        city,
        address,
        province,
        type_id,
        address_details,
        advance_payment,
        rent_start,
        rent_end
    } = req.body;

    try {
        await transaction.query('BEGIN');

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

// TODO: GET status by status name
//router.get();

// TODO: GET real estate type by type name
//router.get();

module.exports = router;
