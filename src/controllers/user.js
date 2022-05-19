/**
 * @file controllers/user.js
 */

const { user } = require("../models/user");

module.exports = {
  async postNewUser(req, res) {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "No username specified." });
    }

    // Make sure a user with this name doesn't already exist. If it does, then return that user.
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
      });
    }

    // Create a new user.
    const newUser = await user.create({ username });

    // Return the new user's name and ID.
    return res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
    });
  },

  async getUsers(_, res) {
    // Get all users.
    const users = await user
      .find({})
      .select({ _id: true, username: true })
      .exec();

    // Return the users in an array.
    return res.status(200).json(users);
  },

  async postUserExercise(req, res) {
    // Get the ID of the user to post to.
    const { _id } = req.params;

    // Get the exercise description, duration and optional date from the request body.
    const { description, duration, date } = req.body;

    // Validate the description and duration.
    if (!description) {
      return res.status(400).json({ error: "Description cannot be empty." });
    }

    if (!duration) {
      return res
        .status(400)
        .json({ error: "A duration (in minutes) must be provided." });
    }

    if (duration < 0) {
      return res
        .status(400)
        .json({ error: "The duration cannot be less than zero." });
    }

    // Attempt to parse the given date. If no date was provided, or the provided date is
    // invalid, then use the current date instead.
    let parsedDate = new Date(date);
    if (parsedDate.toString() === "Invalid Date") {
      console.warn(
        "POST /users/:id/exercises: No date or invalid date provided. Using current date. . ."
      );
      parsedDate = new Date();
    }

    // Find and update the user in the database.
    const userToUpdate = await user.findById(_id);
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found." });
    }

    userToUpdate.addExercise(description, duration, parsedDate);
    await userToUpdate.save();

    // Return the user's details, and the details of their new exercise.
    return res.status(200).json({
      username: userToUpdate.username,
      _id: _id,
      description: description,
      duration: duration,
      date: parsedDate.toDateString(),
    });
  },

  async getUserLog(req, res) {
    // A regular expression to validate dates in the format YYYY-MM-DD.
    const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

    // Get a range of dates (format YYYY-MM-DD) and a limit of how many
    // logs to retrieve from the query parameters.
    const { from, to, limit } = req.query;

    // If no 'from' or 'to' dates were specified, or invalid dates were specified, then use
    // the UNIX epoch date and today's date, instead, respectively.
    const isFromDateValid = from && dateRegex.test(from) === true;
    const isToDateValid = to && dateRegex.test(to) === true;
    const fromDate = new Date(isFromDateValid ? from : 0);
    const toDate = new Date(isToDateValid ? to : Date.now());

    // Attempt to parse the limit.
    let parsedLimit = parseInt(limit || -1);
    if (Number.isNaN(parsedLimit) === true || parsedLimit === 0) {
      parsedLimit = -1;
    }

    // Get the user ID from the request parameters.
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ error: "No user ID provided." });
    }

    // Find the user with this ID.
    const targetUser = await user
      .findById(_id)
      .select({ username: true, exercises: true })
      .exec();

    // Get the array of exercises which fit the above query parameters.
    const limitedExercises = targetUser.getExercises(
      fromDate,
      toDate,
      parsedLimit
    );

    // Return the user's details and exercise log, as well as the number of exercises recorded.
    return res.status(200).json({
      _id: targetUser._id,
      username: targetUser.username,
      log: limitedExercises,
      count: limitedExercises.length,
    });
  },
};
