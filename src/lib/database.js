/**
 * @file lib/database.js
 */

const mongoose = require("mongoose");

module.exports = async () => {
  console.log("Connecting to database. . .");
  await mongoose.connect(process.env.DATABASE_URL);
};
