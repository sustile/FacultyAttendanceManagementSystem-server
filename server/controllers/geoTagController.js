const geoTagModel = require("../models/geoTagModel");
const mongoose = require("mongoose");
const jwt = require("./../utils/jwtToken");
const appError = require("./../utils/appError");
const bcrypt = require("bcryptjs/dist/bcrypt");

const geoTag = mongoose.model("GeoTag", geoTagModel);

const JWT_EXPIRE_COOKIE = 10;

exports.geoTag = geoTag;
const path = require("path");
const fs = require("fs");

exports.createTag = async (req, res) => {
  try {
    const body = Object.assign(req.body, {
      creation: Date.now(),
    });

    const newAcc = await geoTag.create(body);

    res.status(200).json({
      status: "ok",
      tag: newAcc,
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllTag = async (req, res) => {
  try {
    const newAcc = await geoTag.find({});

    res.status(200).json({
      status: "ok",
      tags: newAcc,
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};
