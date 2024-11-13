const recordModel = require("../models/recordModel");
const mongoose = require("mongoose");
const jwt = require("./../utils/jwtToken");
const appError = require("./../utils/appError");
const bcrypt = require("bcryptjs/dist/bcrypt");
const haversine = require("haversine-distance");
var moment = require("moment-timezone");
const { TZDate } = require("@date-fns/tz");
const { set, compareAsc } = require("date-fns");
const { account } = require("./accountController");
const { geoTag } = require("./geoTagController");

const turf = require("@turf/turf");

const record = mongoose.model("Record", recordModel);
const JWT_EXPIRE_COOKIE = 10;
exports.record = record;
const path = require("path");
const fs = require("fs");
const jsonwt = require("jsonwebtoken");

let turfCoords = [
  [12.84077, 80.153226],
  [12.841316, 80.1535],
  [12.841776, 80.153457],
  [12.842104, 80.152963],
  [12.842772, 80.152645],
  [12.84334, 80.1527],
  [12.843563, 80.151115],
  [12.84531, 80.15128],
  [12.845171, 80.152723],
  [12.844756, 80.153351],
  [12.844376, 80.155175],
  [12.843956, 80.1561],
  [12.843581, 80.156508],
  [12.843335, 80.15731],
  [12.843581, 80.157535],
  [12.843232, 80.158282],
  [12.841418, 80.157338],
  [12.841539, 80.157012],
  [12.840619, 80.156499],
  [12.841182, 80.154542],
  [12.840109, 80.154808],
  [12.839694, 80.155743],
  [12.839158, 80.155431],
  [12.839502, 80.154689],
  [12.838966, 80.154538],
  [12.839109, 80.154171],
  [12.83972, 80.154335],
  [12.8398, 80.153642],
  [12.840181, 80.1532],
  [12.840654, 80.153354],
  [12.84077, 80.153226],
];

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

    let date = set(new TZDate(new Date(), "Asia/Kolkata"), {
      hours: 8,
      minutes: 0,
      seconds: 0,
    });
    let date2 = set(new TZDate(new Date(), "Asia/Kolkata"), {
      hours: 19,
      minutes: 30,
      seconds: 0,
    });
    let chkDate = new TZDate(new Date(), "Asia/Kolkata");

    if (compareAsc(chkDate, date) < 0 || compareAsc(date2, chkDate) < 0) {
      throw new Error("Attendance closed for the day");
      return;
    }

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

      const polygon = turf.polygon([turfCoords]);

      const point = turf.point([
        body.location.latitude,
        body.location.longitude,
      ]);

      const isInside = turf.booleanPointInPolygon(point, polygon);

      if (!isInside) {
        throw new Error("You are not inside this Geofence");
      }

      let final = {
        facultyId: body.facultyId,
        deviceData: {},
        location: { ...body.location },
        creation: new Date(new TZDate(new Date(), "Asia/Kolkata")),
      };

      let newAttendance = await record.create(final);

      if (newAttendance._id) {
        res.status(200).json({
          status: "ok",
        });
      } else {
        throw new Error("Something went wrong. Can't mark your attendance.");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateLocationStatus = async (req, res) => {
  try {
    const body = req.body;

    let date = set(new TZDate(new Date(), "Asia/Kolkata"), {
      hours: 8,
      minutes: 0,
      seconds: 0,
    });
    let date2 = set(new TZDate(new Date(), "Asia/Kolkata"), {
      hours: 19,
      minutes: 30,
      seconds: 0,
    });
    let chkDate = new TZDate(new Date(), "Asia/Kolkata");

    if (
      (compareAsc(chkDate, date) < 0 || compareAsc(date2, chkDate) < 0) &&
      body.type === "inside"
    ) {
      throw new Error("Attendance closed for the day");
      return;
    }

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

      if (body.type === "inside") {
        const polygon = turf.polygon([turfCoords]);

        const point = turf.point([
          body.location.latitude,
          body.location.longitude,
        ]);

        const isInside = turf.booleanPointInPolygon(point, polygon);

        if (!isInside) {
          throw new Error("You are not inside this Geofence");
        }
      }

      let date = set(new TZDate(new Date(), "Asia/Kolkata"), {
        hours: 8,
        minutes: 0,
        seconds: 0,
      });
      let date2 = set(new TZDate(new Date(), "Asia/Kolkata"), {
        hours: 19,
        minutes: 30,
        seconds: 0,
      });

      let fromDate = new Date(date);
      let toDate = new Date(date2);
      let rec = await record.find({
        creation: {
          $gte: fromDate.toISOString(),
          $lte: toDate.toISOString(),
        },
        facultyId: user.facultyId,
      });

      if (rec.length === 0) {
        throw new Error("Latest Attendance Doesn't Exist");
      }
      rec = rec[0];

      if (rec.updates.length === 0 && body.type != "inside") {
        //just update it
        let final = {
          facultyId: body.facultyId,
          deviceData: {},
          location: { ...body.location },
          type: body.type,
          creation: new Date(new TZDate(new Date(), "Asia/Kolkata")),
        };

        let y = rec.updates;
        y.push(final);

        try {
          let newAttendance = await record.updateOne(
            { _id: rec._id },
            { updates: y }
          );
          res.status(200).json({
            status: "fail",
          });
        } catch (e) {
          res.status(200).json({
            status: "fail",
          });
        }
      } else {
        let x = rec.updates[rec.updates.length - 1];
        //check if previous type is same new input
        if (x.type === body.type) {
          //skip it device probably switched off
          res.status(200).json({
            status: "ok",
          });
        } else {
          //update it
          let final = {
            facultyId: body.facultyId,
            deviceData: {},
            location: { ...body.location },
            type: body.type,
            creation: new Date(new TZDate(new Date(), "Asia/Kolkata")),
          };

          let y = rec.updates;
          y.push(final);

          try {
            let newAttendance = await record.update(
              { _id: rec._id },
              { updates: y }
            );
            res.status(200).json({
              status: "fail",
            });
          } catch (e) {
            res.status(200).json({
              status: "fail",
            });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLatestAttendance = async (req, res) => {
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

      let rec = await record
        .find({ facultyId: user.facultyId })
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "ok",
        latestRecord:
          rec.length === 0
            ? null
            : new Date(new TZDate(rec[0].createdAt, "Asia/Kolkata")),
      });
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

      let date = set(new TZDate(new Date(), "Asia/Kolkata"), {
        hours: 8,
        minutes: 0,
        seconds: 0,
      });
      let date2 = set(new TZDate(new Date(), "Asia/Kolkata"), {
        hours: 19,
        minutes: 30,
        seconds: 0,
      });

      let fromDate = new Date(date);
      let toDate = new Date(date2);

      console.log(fromDate.toISOString(), toDate.toISOString());

      let x = await record.find({
        creation: {
          $gte: fromDate.toISOString(),
          $lte: toDate.toISOString(),
        },
        facultyId: user.facultyId,
      });

      res.status(200).json({
        status: "ok",
        attendanceStatus: x.length === 0,
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

      let fromDate = new Date(new Date().toLocaleString()).setHours(8, 0, 0);
      let toDate = new Date(new Date().toLocaleString()).setHours(19, 30, 0);

      let x = await record
        .find({ facultyId: user.facultyId })
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "ok",
        records: x,
      });
    }
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTest = async (req, res) => {
  try {
    const body = req.body;

    console.log([
      body.position.coords.longitude,
      body.position.coords.latitude,
      body.position.coords.accuracy,
    ]);

    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};
