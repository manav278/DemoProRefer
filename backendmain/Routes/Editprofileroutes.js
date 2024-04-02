import express from "express";
import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import { getUserId } from "./Loginroutes.js";
import proreferuser from "../Model/proreferuser.js";
import authdata from "../Model/authdata.js";
import * as env from "dotenv";
env.config();
const router = express.Router();
let globalEncryptedOTP, globalSalt;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPByEmail = async (email) => {
  const otp = generateOTP();

  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const encryptedOTP = CryptoJS.AES.encrypt(
    otp.toString(),
    salt.toString()
  ).toString();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for verification",
    text: `Your OTP is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { encryptedOTP, salt };
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

const verifyOTP = (encryptedOTP, enteredOTP) => {
  const decryptedOTP = CryptoJS.AES.decrypt(
    encryptedOTP,
    globalSalt.toString()
  ).toString(CryptoJS.enc.Utf8);
  return enteredOTP === decryptedOTP;
};

router.post("/getEditProfileDetails", async (req, res) => {
  try {
    let ID = getUserId();
    let userProfile = await proreferuser.find({ User_ID: ID });
    res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error("Error fetching user data from MongoDB : ", error);
    res.json({ message: "Internal server error from backend" });
  }
});

router.post("/updateApplicant", async (req, res) => {
  try {
    const { mobileNumber, personalEmail, location, isPersonalEmailChanged } =
      req.body;
    let ID = getUserId();
    let oldEmail;
    if (isPersonalEmailChanged) {
      let oldUser = await proreferuser.findOne({ User_ID: ID });
      oldEmail = oldUser.Personal_Email;
    }
    await proreferuser.findOneAndUpdate(
      { User_ID: ID },
      {
        Mobile_Number: mobileNumber,
        Personal_Email: personalEmail,
        COMPANY_LOCATION: location,
      }
    );
    if (isPersonalEmailChanged)
      await authdata.findOneAndUpdate(
        { Personal_Email: oldEmail },
        { Personal_Email: personalEmail }
      );
    res.json({ message: "Update successful" });
  } catch (error) {
    console.log("Error fetching data from MongoDB: ", error);
    res.json({ message: "Internal server error from backend" });
  }
});

router.post("/requestOtp", async (req, res) => {
  try {
    const { personalEmail, isPersonalEmailChanged } = req.body;
    if (isPersonalEmailChanged) {
      const u1 = await proreferuser.findOne({ Personal_Email: personalEmail });
      if (u1) {
        res.status(200).json({
          message:
            "Personal Email Already Exists. So Applicant Credentials will not be Updated",
        });
      } else {
        let { encryptedOTP, salt } = await sendOTPByEmail(personalEmail);
        globalEncryptedOTP = encryptedOTP;
        globalSalt = salt;
        res.status(200).json({ message: "Otp sent" });
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(200).json({ message: "Error trying to send OTP" });
  }
});

router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp } = req.body;
    const isCorrect = verifyOTP(globalEncryptedOTP, otp);
    if (isCorrect) res.json({ message: "Otp verified" });
    else res.json({ message: "Otp incorrect" });
  } catch (error) {
    console.log("Error: ", error);
    res.json({ message: "Error trying to verify OTP" });
  }
});

export default router;
