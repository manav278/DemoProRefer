import express from "express";
import { getUserId } from "./Loginroutes.js";
import referralhistory from "../Model/referralhistory.js";
import currentrequest from "../Model/currentrequest.js";
const router = express.Router();
router.get("/pastreceive", async (req, res) => {
  try {
    let id = getUserId();
    let user = await referralhistory
      .find({ "History.Employee_ID": id })
      .sort({ Referral_ID: -1 })
      .exec();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching past Requests in Receivedroutes:", error);
    res.status(200).json({ message: "Server Error" });
  }
});

router.get("/currentreceive", async (req, res) => {
  try {
    let id = getUserId();
    let user = await currentrequest
      .find({ "History.Employee_ID": id })
      .sort({ Referral_ID: -1 })
      .exec();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current Requests in Receivedroutes:", error);
    res.status(200).json({ message: "Server Error" });
  }
});

router.get("/getreceiveemployeeid", async (req, res) => {
  try {
    let id = getUserId();
    res.status(200).json({ id: id });
  } catch (error) {
    console.error("Error fetching id", error);
    res.status(200).json({ message: "Server Error" });
  }
});
export default router;
