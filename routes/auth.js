const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {  signup, signin, signout, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast of 3 characters!"),
    check("email").isEmail().withMessage("Please Provide a valid E-Mail !"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("Password length should be minimum of 3 characters"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please Provide a valid E-Mail !"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password field is required"),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
