import express from "express";
import users from "../Model/proreferuser.js";
import files from "../Model/File.js";
import { getUserId } from "./Loginroutes.js";
import request from "../Algorithm/request.js";

const router = express.Router();
let global_position;
let global_selectedCompany;
let global_country;
let global_url;

router.get("/resumeUploaded", async(req, res) => {
  let uid = await getUserId();
  let isPresent = await files.findOne({User_ID: Number(uid)});
  if(isPresent){
    res.json(0);
  }
  else
  {
    res.json(-1);
  }
});

router.get("/process-request", async (req, res) => {
  // request("FSD", 2, "India", "URL");
  request(global_position, global_selectedCompany, global_country, global_url);
});

router.post("/requestref", async (req, res) => {
  const { position, selectedCompany, country, url } = req.body;
  if (
    position != null &&
    selectedCompany != null &&
    country != null &&
    url != null
  ) {
    try {
      global_position = position;
      global_selectedCompany = selectedCompany;
      global_country = country;
      global_url = url;
      const user = await users.findOne({ User_ID: getUserId() });
      const a = user.Referrals_Requested_ThisMonth;
      const b = user.Total_Referrals_Requested;
      if (a >= 3) {
        res
          .status(200)
          .json({ message: "Referrals Requested This Month Limit Exceeded" });
      } else {
        try {
          const y = await getUserId();
          // console.log("Line 40 routes");
          const updateUser = await users.findOneAndUpdate(
            { User_ID: y },
            {
              Referrals_Requested_ThisMonth: a + 1,
              Total_Referrals_Requested: b + 1,
            },
            { new: true }
          );
        } catch (error) {
          console.log(
            "Error while updating ReferralsRequestedThisMonth/ TotalReferralsRequested: ",
            error
          );
          res.status(200).json({ message: "Error processing request" });
        }

        res.status(200).json({ message: "Request received successfully" });
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(200).json({ message: "Server Error" });
    }
  } else {
    res.status(200).json({
      message: "Please fill the values properly.Some values are Null",
    });
  }
});

export default router;
