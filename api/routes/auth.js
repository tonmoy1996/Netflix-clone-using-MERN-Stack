const router = require('express').Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");

const { addUser, authenticateUser } = require('../service/authService')
//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    const result = await addUser(newUser);

    if (result.status === 201) {

        res.status(result.status).json(result.data)
    } else {
        res.status(result.status).json(result.error)
    }

});

//LOGIN

router.post("/login", async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    const result = await authenticateUser(user);

    if (result.status === 200) {
        const { password, ...payload } = result.data._doc;

        const accesToken =
            jwt.sign({ _id: payload._id, isAdmin: payload.isAdmin },
                process.env.SECRET_KEY, { expiresIn: "5d" });
        res.status(result.status).json({ ...payload, accesToken });
    } else {
        res.status(result.status).send(result.error);
    }
});

module.exports = router;