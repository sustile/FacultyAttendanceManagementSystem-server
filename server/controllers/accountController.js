const accountModel = require("../models/accountModel");
const mongoose = require("mongoose");
const jwt = require("./../utils/jwtToken");
const jsonwt = require("jsonwebtoken");
const appError = require("./../utils/appError");
const bcrypt = require("bcryptjs/dist/bcrypt");

const account = mongoose.model("User", accountModel);

const JWT_EXPIRE_COOKIE = 10;

exports.account = account;
const path = require("path");
const fs = require("fs");

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

exports.createAccount = async (req, res) => {
  try {
    const body = Object.assign(req.body, {
      creation: Date.now(),
      role: "user",
    });

    const newAcc = await account.create(body);

    const token = jwt.generate(newAcc.id);

    // res.cookie("jwt", token, {
    //   maxAge: JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000,
    //   // secure: true, //only when deploying or testing in website not in postman
    //   httpOnly: true,
    // });

    newAcc.password = undefined;

    res.status(200).json({
      status: "ok",
      user: {
        name: newAcc.name,
        email: newAcc.email,
        facultyId: newAcc.facultyId,
      },
      token,
    });
  } catch (err) {
    let message = "Something Went Wrong";
    if (err.message.includes("duplicate key")) {
      message = "Email already in use";
    }
    res.status(200).json({
      status: "fail",
      message,
    });
  }
};

exports.loginAccount = async (req, res, next) => {
  try {
    console.log("yes");
    const { regNo, password } = req.body;

    if (!regNo || !password) {
      throw new Error("Provide a Valid Register Number and Password");
    }

    const user = await account.findOne({ facultyId: regNo }).select("+password");
    if (!user) {
      throw new Error("Invalid Register Number or Password");
    }
    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      throw new Error("Invalid Register Number or Password");
    }

    user.password = undefined;

    const token = jwt.generate(user._id);

    res.status(200).send({
      status: "ok",
      user: {
        name: user.name,
        email: user.email,
        facultyId: user.facultyId,
      },
      token,
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getBasicData = async (req, res) => {
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

      res.status(200).json({
        status: "ok",
        user: {
          name: user.name,
          email: user.email,
          facultyId: user.facultyId,
        },
      });
    }
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};
