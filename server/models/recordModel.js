const mongoose = require("mongoose");

var schema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      default: "",
      required: true,
    },
    location: {
      type: {},
      required: true,
    },
    overallAttendance : {},
    deviceData: {
      type: {},
      default: {},
    },
    updates : [],
    creation: {
      type: Date,
      required: [true, "A Record Must Have a Creation Date"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = schema;
