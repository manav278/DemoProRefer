import express from "express";
import { getUserId } from "./Loginroutes.js";
import referralhistory from "../Model/referralhistory.js";
import currentrequest from "../Model/currentrequest.js";
const router = express.Router();
router.get("/historysent", async (req, res) => {
  try {
    let id = getUserId();
    let user = await referralhistory
      .find({ Applicant_ID: id })
      .sort({ Referral_ID: -1 })
      .exec();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching past Requests in Sentroutes:", error);
    res.status(200).json({ message: "Server Error" });
  }
});
router.get("/currentsent", async (req, res) => {
  try {
    let id = getUserId();
    let user = await currentrequest
      .find({ Applicant_ID: id })
      .sort({ Referral_ID: -1 })
      .exec();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current Requests in Sentroutes:", error);
    res.status(200).json({ message: "Server Error" });
  }
});

export default router;
