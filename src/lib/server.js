/**
 * @file lib/server.js
 */

const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");

const sourceDirectory = path.join(process.cwd(), "src");
const publicDirectory = path.join(sourceDirectory, "public");

module.exports = async () => {
  // Initialize Server Application
  const app = express();

  // Initialize Server Middleware
  app.use("/public", express.static(publicDirectory));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(compression());

  // Serve Home Page
  app.get("/", (_, res) =>
    res.status(200).sendFile(path.join(sourceDirectory, "pages", "index.html"))
  );

  // API Routes
  app.use("/api", require("../routes/user"));

  // Listen for Connections
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port #${port}. . .`);
  });
};
