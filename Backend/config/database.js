const mongoose = require("mongoose");

const database = async function (ConnectionString) {
  const data = await mongoose.connect(ConnectionString);
  console.log("Database connected");
};

module.exports = database;
