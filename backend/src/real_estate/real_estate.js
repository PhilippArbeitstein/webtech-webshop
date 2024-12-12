const express = require('express');
const router = express.Router();

const pool = require('../pool');
const checkAuth = require('../auth/auth.js');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Real Estate Routes Work'
    });
});

// Get all Listings
router.get('/listings', async (req, res) => {
    try {
        const allListings = await pool.query(`
            SELECT  re.product_id, u.email, u.username, p.image_url, p.name, p.description, p.price, 
                    s.status_name, p.created_at, p.updated_at, p.additional_properties, t.type_name, 
                    a.city, a.address, a.province, re.address_details, re.advance_payment, re.rent_start, re.rent_end
            FROM real_estate re INNER JOIN product p ON re.product_id = p.product_id 
            INNER JOIN address a ON re.address_id = a.address_id
            INNER JOIN real_estate_types t ON re.type_id = t.type_id
            INNER JOIN users u ON p.user_id = u.user_id
            INNER JOIN statuses s ON p.status_id = s.status_id
            ORDER BY p.created_at DESC;
        `);

        if (allListings.rows.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }

        res.status(200).json(allListings.rows);
    } catch (error) {
        res.status(500).send(`Server Error: ${error}`);
    }
});

module.exports = router;
