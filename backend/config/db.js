const mongoose = require("mongoose")
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:${conn.connection.host}`);

    } catch (error) {
        console.log(`Error:${error.message}`);
        process.exit()
    }
}

module.exports = connectDB