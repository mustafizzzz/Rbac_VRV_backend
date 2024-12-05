const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');



//middleware for data parsing
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));
// console.log(`${process.env.CLIENT_URL} CLIENT URL`);
app.use(express.json())//to accept json data
app.use(morgan('dev'))

//routes here




module.exports = app;