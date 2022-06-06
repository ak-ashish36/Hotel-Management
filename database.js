const mongoose = require('mongoose');


const connectToMongo = async () => {
    const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/HotelManagement";
    try {
        await mongoose.connect(URI)
        console.log("Connected to Mongo Successfully");
    }
    catch (e) {
        console.log("Mongo Not Connected");
    }
}
module.exports = connectToMongo;