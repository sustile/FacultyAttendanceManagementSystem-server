const express = require("express");
const router = express.Router();
const { verify, verifyDisable } = require("./../middlewares/middleware");
const path = require("path");

const accountController = require("../controllers/accountController");
const geoTagController = require("../controllers/geoTagController");
const recordController = require("../controllers/recordController");

// MULTER
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./../../Products/Images"));
  },

  filename: (req, file, cb) => {
    if (req.path === "/api/changeSecondaryData") {
      console.log(
        "yes",
        req.user.id + "_COVER" + path.extname(file.originalname),
      );
      cb(null, req.user.id + "_COVER" + path.extname(file.originalname));
    } else {
      cb(
        null,
        req.body.productId +
          "-" +
          req.files.length +
          path.extname(file.originalname),
      );
    }
  },
});

const uploadImage = multer({ storage: storage });
// const uploadImage2 = multer({ storage: storageB });
// MULTER
router.route("/api/signup").post(accountController.createAccount);
router.route("/api/login").post(accountController.loginAccount);
router.route("/api/getBasicData").post(accountController.getBasicData);
router.route("/api/createTag").post(geoTagController.createTag);
router.route("/api/getAllTag").get(geoTagController.getAllTag);
router.route("/api/markAttendance").post(recordController.markAttendance);
router.route("/api/checkAttendanceStatus").post(recordController.checkAttendanceStatus);
router.route("/api/getLatestAttendance").post(recordController.getLatestAttendance);
router.route("/api/getRecords").post(recordController.getRecords);
router.route("/api/getTest").post(recordController.getTest);
router.route("/api/updateLocationStatus").post(recordController.updateLocationStatus);

module.exports = router;
