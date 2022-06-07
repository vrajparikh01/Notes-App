const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const { findOne } = require("../models/User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "vraj185";

// ROUTE 1: Create a user using : POST "/api/auth/createuser"  No login required
router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be at least 5 characters").isLength({ min: 5 }),],
    async (req, res) => {
        let success = false;
        // if there are errors, return error with a bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        try {
            // check whether user with this email exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({success, error: "Sorry, user with this email already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            securePass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePass,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Some Internal error occured");
        }
    })

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()],
    async (req, res) => {
        let success = false;
        // if there are errors, return error with a bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).send("Please login with correct credentials");
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({success, error: "Please login with correct credentials"});
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Some Internal error occured");
        }

    })

// ROUTE 3: Get user details of logged details using POST "/api/auth/getuser"
// Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        // select all fields except password
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal error occured");
    }
})
module.exports = router;