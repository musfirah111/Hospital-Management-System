const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//Loads env variables.
dotenv.config();

//Connection to the database.
connectDB();

//Routes.

//Middleware.

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server is running on the port: ${PORT}`);
})