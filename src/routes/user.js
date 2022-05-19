/**
 * @file routes/user.js
 */

const { Router } = require("express");
const user = require("../controllers/user");
const router = Router();

// POST /api/users
//
// Creates a new user.
router.post("/users", user.postNewUser);

// GET /api/users
//
// Gets a list of all registered users.
router.get("/users", user.getUsers);

// POST /api/users/:id/exercies
//
// Posts a new exercise record for the given user.
router.post("/users/:_id/exercises", user.postUserExercise);

// GET /api/users/:id/logs
//
// Gets an exercise log for the given user.
router.get("/users/:_id/logs", user.getUserLog);

module.exports = router;
