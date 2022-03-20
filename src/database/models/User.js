const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Animes: [
    {
      type: [Schema.Types.ObjectId],
      ref: "Anime",
    },
  ],
  image: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
