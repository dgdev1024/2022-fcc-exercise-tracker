/**
 * @file models/user.js
 */

const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

userSchema.methods.addExercise = function (description, duration, date) {
  this.exercises.push({ description, duration, date });
};

userSchema.methods.getExercises = function (fromDate, toDate, limit) {
  const result = this.exercises
    .filter(
      (exercise) =>
        exercise.date.getTime() >= fromDate.getTime() &&
        exercise.date.getTime() <= toDate.getTime()
    )
    .map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    }));

  return limit === -1 ? result : result.slice(0, limit);
};

module.exports = {
  exercise: model("Exercise", exerciseSchema),
  user: model("User", userSchema),
};
