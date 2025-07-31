const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');
const bcryptjs = require("bcryptjs")
const jwt=require('jsonwebtoken')

require('dotenv').config();

// register user
router.post('/register', async (req, res, next) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection("users")
        const email =  req.body.email
        const existingEmail = await collection.findOne({ email:email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const newUser = await collection.insertOne({
            email:email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };        
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken,email });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
