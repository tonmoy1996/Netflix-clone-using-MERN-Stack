const jwt = require("jsonwebtoken");

function verify(req, res, next) {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
            if (err) {
                return res.status(403).send("Token is not valid"); //403 for forbidden
            }
            req.user = data;
            next();
        });

    } else {
        return res.status(401).send("you are not authenticated")
    }

}

module.exports = verify;