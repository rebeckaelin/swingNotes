const db = require("./Functions/dbFunctions.js");
const {Router} = require("express");
const {v4: uuidv4} = require("uuid");
const {hashPassword, comparePassword} = require("./bcrypt.js");
const jwt = require("jsonwebtoken");
const user = Router();

user.post("/user/signup", async (req, res) => {
  const {username, password} = req.body;

  try {
    if (username == "" && password == "") {
      res
        .status(400)
        .json({message: "Both username and password must be filled in!"});
      return;
    }

    const checkUser = await db.checkUser(username);
    if (checkUser) {
      res.status(409).json({message: "Username already in use!"});
      return;
    }
    const encryptedPassword = await hashPassword(password);

    const user = {
      username: username,
      password: encryptedPassword,
      userID: uuidv4(),
    };

    console.log(user);

    await db.addUser(user);
    res.status(200).json({message: "User has been successfully created!"});
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

user.post("/user/login", async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await db.checkUser(username);
    if (user == null) {
      res.status(404).json({message: "User not found"});
      return;
    }
    const correctPassword = await comparePassword(password, user.password);
    if (correctPassword) {
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set");
        res.status(500).json({message: "Internal server error"});
        return;
      }
      const token = jwt.sign({id: user.userID}, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      let result = {
        token: token,
      };
      res.json(result);
    } else {
      res.status(401).json({message: "Incorrect username or password"});
    }
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
});

module.exports = user;
