const recordModel = require("../models/recordModel");
const mongoose = require("mongoose");
const jwt = require("./../utils/jwtToken");
const appError = require("./../utils/appError");
const bcrypt = require("bcryptjs/dist/bcrypt");
const haversine = require("haversine-distance");

const record = mongoose.model("Record", recordModel);
const JWT_EXPIRE_COOKIE = 10;
exports.record = record;
const path = require("path");
const fs = require("fs");
const jsonwt = require("jsonwebtoken");
const { account } = require("./accountController");
const { geoTag } = require("./geoTagController");

const passwordChanged = (account, jwt) => {
  if (account.passwordChangedAt) {
    const time = parseInt(account.passwordChangedAt.getTime() / 1000, 10);

    return jwt < time;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

async function getUser(token) {
  try {
    if (token) {
      const decoded = jsonwt.verify(token, process.env.JSW_SECRET_KEY);

      let freshUser = await account.find({ _id: decoded.id });

      freshUser = freshUser[0];

      if (!freshUser) {
        throw new Error("User Belonging to the Token Doesn't Exist");
      }

      if (passwordChanged(freshUser, decoded.ait)) {
        throw new Error("The Password has been changed");
      }
      return freshUser;
    } else {
      // next();
      throw new Error("No Token was given");
    }
  } catch (err) {
    return new Error(err.message);
  }
}

exports.markAttendance = async (req, res) => {
  try {
    const body = req.body;


    console.log(body)

    if (!body.token) {
      //no data given
      throw new Error("No data given");
    } else {
      user = await getUser(body.token);
      if (user.name === "Error") {
        if (user.message === "jwt malformed") {
          user.message = "Token Invalid";
        }
        throw new Error(user.message);
      }

      //user found successfully

      //check geotag existence and crosscheck location once again
      let checkTag = await geoTag.findOne({
        _id: body.geoTag._id,
        name: body.geoTag.name,
        location: body.geoTag.location,
        radius: body.geoTag.radius,
      });

      if (!checkTag) {
        throw new Error("Geo Tag doesn't exist");
      }

      let distance = haversine(
        {
          latitude: Number(checkTag.location[0]),
          longitude: Number(checkTag.location[1]),
        },
        {
          latitude: body.location.latitude,
          longitude: body.location.longitude,
        },
      );

      if (distance > checkTag.radius) {
        throw new Error("Outside this geotag Range");
      }

      let final = {
        facultyId: body.facultyId,
        deviceData: {},
        location: { ...body.location, distance },
        geoTag: body.geoTag._id,
        // creation: new Date(new Date.toLocaleString() + " UTC"),
        creation : new Date(new Date().toLocaleString() + " UTC")
      };

      let newAttendance = await record.create(final);

      if (newAttendance._id) {
        res.status(200).json({
          status: "ok",
        });
      } else {
        throw new Error("Something went wrong. Can't mark your attendance.");
      }

      // let fromDate = new Date().setHours(8, 0, 0);
      // let toDate = new Date().setHours(19, 30, 0);
      //
      // let x = await record.find({
      //   creation: {
      //     $gte: fromDate,
      //     $lte: toDate,
      //   },
      // });
    }
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.checkAttendanceStatus = async (req, res) => {
  try {
    const body = req.body;

    if (!body.token) {
      //no data given
      throw new Error("No data given");
    } else {
      user = await getUser(body.token);
      if (user.name === "Error") {
        if (user.message === "jwt malformed") {
          user.message = "Token Invalid";
        }
        throw new Error(user.message);
      }

      //user found successfully

      // let fromDate = new Date().setHours(8, 0, 0);
      let fromDate = new Date(new Date().toLocaleString()).setHours(8, 0, 0);
      // let toDate = new Date().setHours(19, 30, 0);
      let toDate = new Date(new Date().toLocaleString()).setHours(19, 30, 0);

      // console.log(fromDate.toLocaleString(), toDate.toLocaleString());

      let x = await record.find({
        creation: {
          $gte: fromDate,
          $lte: toDate,
        },
        facultyId: user.facultyId,
      });

      res.status(200).json({
        status: "ok",
        attendanceStatus : x.length ===0
      });

    }
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const body = req.body;

    if (!body.token) {
      //no data given
      throw new Error("No data given");
    } else {
      user = await getUser(body.token);
      if (user.name === "Error") {
        if (user.message === "jwt malformed") {
          user.message = "Token Invalid";
        }
        throw new Error(user.message);
      }

      //user found successfully

      // let fromDate = new Date().setHours(8, 0, 0);
      let fromDate = new Date(new Date().toLocaleString()).setHours(8, 0, 0);
      // let toDate = new Date().setHours(19, 30, 0);
      let toDate = new Date(new Date().toLocaleString()).setHours(19, 30, 0);

      // console.log(fromDate.toLocaleString(), toDate.toLocaleString());

      let x = await record.find({ facultyId: user.facultyId}).sort({createdAt: -1});

  let final = []

      for(let el of x){
        let data = await geoTag.findOne({_id : el.geoTag});
        final.push({_id : el._id, facultyId: el.facultyId, location: el.location, creation : el.creation, createdAt : el.createdAt, geoTag : data})
      }

      res.status(200).json({
        status: "ok",
        records : final
      });

    }
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};
