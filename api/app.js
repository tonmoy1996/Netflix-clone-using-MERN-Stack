const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const dotenv = require('dotenv');
dotenv.config();

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//database connection
mongoose
    .connect(
        process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    )
    .then(() => console.log("Database Connected Successfully"))
    .catch(() => console.log("Database connection failed"))


//ROUTE
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);

app.listen(port, () => { console.log(`Backend Listen at ${port}`) });