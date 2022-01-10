const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');
const { findOne } = require("../models/User");

const JWT_SECRET = "shubham$sa$";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("password", "password must be at least 3 digits").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      var authtoken = jwt.sign(data, JWT_SECRET);
      res.json(authtoken);
    } catch (error) {
      console.log(error.message);
            res.status(500).send("Internal server error");
            res.status(500).send("");
    }
  }
);


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "password cannot be blank").exists(),
    ],
    async (req, res) => {
        //if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })};
        const {email,password} = req.body;
        try{
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({
                    error:"Please try again with correct credentils"
                })
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({
                    error:"Please try again with correct credentils"
                })
            }
            const data = {
                user: {
                  id: user.id,
                },
              };
              var authtoken = jwt.sign(data, JWT_SECRET);
              res.json({authtoken});
        }catch(error){
            console.log(error.message);
            res.status(500).send("Internal server error");
        }
    })


// ROUTE 3: get logged in User details using: POST "/api/auth/getuser". No login required
router.post(
    "/getuser",fetchuser,async (req, res) => {
        try{
            let userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
        }catch(error){
            console.log(error.message);
            res.status(500).send("Internal server error");
        }
    })
module.exports = router;
