const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoute');
const roleRoutes = require('./routes/roleRoutes');




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
app.use(`/api/v1/users`, userRoutes);
app.use(`/api/v1/`, permissionRoutes);
app.use(`/api/v1/roles`, roleRoutes);

module.exports = app;