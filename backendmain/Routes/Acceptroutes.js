import historyModel from "../Model/referralhistory.js";
import currReqModel from "../Model/currentrequest.js";
import proreferusers from "../Model/proreferuser.js";
import companyModel from "../Model/companydata.js";
import getDate from "../Algorithm/date.js";
import { acceptedToApplicant } from "../Algorithm/nodemailer.js";
import { initCounter, getNextSequenceValue } from "../Model/historyCounter.js";
import express from "express";

let applicantEmail;
const router = express.Router();

//---------------------------------------
router.post("/init", async (req, res) => {
  try {
    initCounter("current");
    res.json({ message: "init complete" });
  } catch (error) {
    res.json({ message: "Error while init in Counter" });
  }
});

//Sequencing------------------------------
router.post("/addition", async (req, res) => {
  try {
    const count = await getNextSequenceValue("current");
    res.json({ message: count });
  } catch (error) {
    res.json({ message: "Error while incrementing in Counter" });
  }
});

//---------------------------------------------

router.get("/accept1/:Referral_ID", async (req, res) => {
  try {
    const Referral_ID = req.params.Referral_ID;
    const dateToday = await getDate();
    let curr = await currReqModel.findOne({ Referral_ID: Referral_ID });
    const company = await companyModel.findOne({
      Company_ID: curr.Company_ID,
    });
    const companyName = company.Company_Name;
    let count = curr.No_Reply_Count + curr.Denial_Count;
    // --------------------------------------------
    if (count == 0) {
      // *********************************************
      curr.History[0].Result = "Referred";
      const newHist = new historyModel({
        Referral_ID: curr.Referral_ID,
        History: curr.History,
        Applicant_ID: curr.Applicant_ID,
        Company_ID: curr.Company_ID,
        date: curr.Request_Date,
        Position: curr.Position,
        result: "Referred",
        Company_Name: companyName,
      });
      // *********************************************
      newHist
        .save()
        .then(async () => {
          const applicant = await proreferusers.findOne({
            User_ID: curr.Applicant_ID,
          });
          applicantEmail = applicant.Personal_Email;

          await currReqModel.findOneAndDelete({
            Referral_ID: Referral_ID,
          });
          res.status(200).json({ message: "Added" });
        })
        .catch((err) => {
          console.error("Error saving user in DataBase :", err);
          res.json(-1);
        });
      // *********************************************
    }
    // --------------------------------------------
    else if (count != 0) {
      // *********************************************
      curr.History[0].Result = "Referred";
      let hist = await historyModel.findOne({ Referral_ID: Referral_ID });
      if (!hist) {
        throw new Error(
          "History document not found in History Model for Referral_ID: " +
            Referral_ID
        );
      }
      // *********************************************
      hist.History.push(curr.History[0]);
      hist.result = "Referred";
      hist
        .save()
        .then(async (updatedHist) => {
          const applicant = await proreferusers.findOne({
            User_ID: curr.Applicant_ID,
          });
          applicantEmail = applicant.Personal_Email;
          console.log("Updated History Document:", updatedHist);
        })
        .catch((err) => {
          console.error("Error Saving Updated History Document:", err);
        });
      await currReqModel.findOneAndDelete({
        Referral_ID: Referral_ID,
      });
      res.status(200).json({ message: "Added" });
      // *********************************************
    }
  } catch (error) {
    console.log("Error in accept1", error);
    res.json(-1);
  }
});

router.get("/accept2", (req, res) => {
  try {
    acceptedToApplicant(applicantEmail);
    res.json(0);
  } catch (error) {
    console.log("Error in accept2: ", error);
    res.json(-1);
  }
});

export default router;
