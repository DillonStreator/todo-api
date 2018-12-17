const express = require('express'),
        router = express.Router();
const db = require('../../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signin', async (req, res, next) => {
        try {
                if (!req.body.email || !req.body.password) return res.status(400).json({ data: {}, message: "You must provide both email and password" });

                let findResult = await db.Query("SELECT * FROM todos.user WHERE email = $1", [req.body.email]);
                if (!findResult.rows.length) return res.status(400).json({ data: {}, message: "Incorrect email or password" });

                let foundUser = findResult.rows[0];

                const correctPassword = await bcrypt.compare(req.body.password, foundUser.password);
                if (!correctPassword) return res.status(400).json({ data: {}, message: "Incorrect email or password" });

                const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60*60),
                        data: foundUser
                }, process.env.SECRET);

                res.status(200).json({ data: { token }, message: "Successfully signed in" });

        }
        catch (error) {
                next(error);
        }
});

router.post('/signup', async (req, res, next) => {
        try {
                if (!req.body.email || !req.body.password) return res.status(400).json({ data: {}, message: "You must provide both email and password" });

                let findResult = await db.Query("SELECT * FROM todos.user WHERE email = $1", [req.body.email]);
                if (findResult.rows.length) return res.status(400).json({ data: {}, message: "That email address is already in use." });

                const hash = await bcrypt.hash(req.body.password, 12);

                let createResult = await db.Query("INSERT INTO todos.user (email, password) VALUES ($1, $2) RETURNING *", [req.body.email, hash]);

                let user = createResult.rows[0];

                const token = jwt.sign(user, process.env.SECRET);

                res.status(201).json({ data: { token }, message: "Successfully registered!" });

        }
        catch (error) {
                next(error);
        }
});

router.post('/signout', async (req, res) => {

});

module.exports = router;