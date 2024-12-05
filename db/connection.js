const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);

        console.log(`Connected to MongoDb ${connectionInstance.connection.host}`.bgYellow.black);

    } catch (error) {
        console.log("Erro in Db connection".bgRed.black, error);
        process.exit(1);
    }


}

module.exports = connectDB;