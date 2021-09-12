const User = require('../models/User');
const bcrypt = require('bcrypt');

const addUser = async (newUser) => {
    try {
        const status = await checkExistingUser(newUser);

        if (status) {
            return {
                status: 500,
                error: "Email Exists, please try again"
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser.password, salt);
        newUser.password = hashedPassword;
        const user = await newUser.save();
        return {
            status: 201,
            data: user
        };

    } catch (err) {
        return {
            status: 500,
            error: err
        }
    }
}

const checkExistingUser = async (user) => {
    const userExist = await User.findOne({ email: user.email });
    if (userExist) {
        return userExist.email === user.email ? true : false;
    }
    return false;
}

const authenticateUser = async (user) => {
    const existingUser = await User.findOne({ username: user.username });

    if (!existingUser) return {
        status: 401,
        error: 'User does not exist'
    };
    const validPass = await bcrypt.compare(user.password, existingUser.password);
    if (!validPass) {
        return {
            status: 401,
            error: 'Username or password incorrect'
        }
    }
    return {
        status: 200,
        data: existingUser
    }
}

module.exports = {
    addUser,
    authenticateUser
}