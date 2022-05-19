/**
 * @file index.js
 */

const connectToDatabase = require("./lib/database");
const runServer = require("./lib/server");

// Configure Environment Variables
require("dotenv").config();

(async () => {
  // Connect to Database
  await connectToDatabase();

  // Run Server Application
  await runServer();
})().catch(console.error);
