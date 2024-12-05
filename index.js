const colors = require('colors')
const dotenv = require('dotenv')


//ENV variables Configuration
dotenv.config();


//Imports from other folder
const connectDB = require('./db/connection');
const app = require('./app');



//Connection Call
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server is running at port : ${process.env.PORT}`.bgGreen.white);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ".bgRed.white, err);
    })

// console.log('Hellow world');