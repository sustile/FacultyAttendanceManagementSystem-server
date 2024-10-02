const mongoose = require("mongoose");

var schema = new mongoose.Schema(
  {
    location: {
      type: [String, String],
      required: true,
    },
    radius: {
      type: Number,
      required: true,
      default: 30,
    },
    name: {
      type: String,
      required: true,
    },
    creation: {
      type: Date,
      required: [true, "An Account Must Have a Creation Date"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = schema;
