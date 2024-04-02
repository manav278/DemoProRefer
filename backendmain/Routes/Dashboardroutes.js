import express from "express";
const router = express.Router();
import { getUserId } from "./Loginroutes.js";
import proreferuser from "../Model/proreferuser.js";

router.get("/dashboard", async (req, res) => {
  try {
    let ID = getUserId();
    // console.log(ID);
    let userProfile = await proreferuser.find({ User_ID: ID });
    // console.log(userProfile[0]);
    res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error("Error fetching user data from MongoDB : ", error);
    res.status(500).json({ error: "Internal server error from backend" });
  }
});

export default router;
