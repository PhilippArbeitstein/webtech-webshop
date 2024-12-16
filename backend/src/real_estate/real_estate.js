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

// Create new real-estate listing
router.post('/new', async (req, res) => {
    const transaction = await pool.connect();
    try {
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

// TODO: GET status by status name
//router.get();

// TODO: GET real estate type by type name
//router.get();

module.exports = router;
