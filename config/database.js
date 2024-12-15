module.exports = {
    url: process.env.DB_CONNECTION_STRING || process.env.MONGO_URI || process.env.MONGODB_URI
};