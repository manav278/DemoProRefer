import authdata from "../Model/authdata.js";
import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";
import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
const secretKey = "PROREFER_SECRET_KEY";
import proreferuser from "../Model/proreferuser.js";
const expiresIn = 20;
let currentUserId;

function getUserId() {
  return currentUserId;
}

// Login routes
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, ' ', password);
  let user, match;
  try {
    user = await authdata.findOne({ Personal_Email: email });
    // console.log(user);
    if (!user) {
      res.json(-2);
    } else {
      const hashedPassword = user.Password;
      match = await bcrypt.compare(password, hashedPassword);
      // console.log(match);
      if (match) {
        let Id = await proreferuser.find({ Personal_Email: email });
        currentUserId = Id[0].User_ID;
        const token = jwt.sign(
          { Personal_Email: user.Personal_Email },
          secretKey
        );
        res.status(200).json({ token });
      } else {
        res.status(200).json({ message: "Invalid email or password" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ message: "Error from fetching database" });
  }
});

// Verify routes
router.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Token is Null." });
  }

  jwt.verify(token, secretKey, async (err, user) => {
    if (err)
      return res.status(403).json({ message: "JWT not verified properly." });
    let email = jwtDecode(token).Personal_Email;
    // console.log(email);
    let x = await proreferuser.find({ Personal_Email: email });
    // console.log(x);
    currentUserId = x[0].User_ID;
    return res.status(200).json({ message: "JWT verified properly." });
  });
});

export default router;
export { getUserId };
