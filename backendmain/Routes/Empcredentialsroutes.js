import express from "express";
import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import { getUserId } from "./Loginroutes.js";
import proreferuser from "../Model/proreferuser.js";
import comp from "../Model/companydata.js";
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

router.post("/getEditProfileEmployeeDetails", async (req, res) => {
  try {
    let ID = getUserId();
    let userProfile = await proreferuser.find({ User_ID: ID });
    res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error("Error fetching user data from MongoDB : ", error);
    res.json({ message: "Internal server error from backend" });
  }
});

router.post("/updateEmployee", async (req, res) => {
  try {
    const { workEmail, position, selectedCompany, companyname } = req.body;
    if (companyname !== null && selectedCompany == "") {
      let ID = await getUserId();
      const companyLength = await comp.countDocuments();
      const newComp = new comp({
        Company_ID: companyLength + 1,
        Company_Name: companyname,
      });
      newComp
        .save()
        .then(async () => {
          await proreferuser.findOneAndUpdate(
            { User_ID: ID },
            {
              Company_ID: companyLength + 1,
              Position: position,
              Work_Email: workEmail,
            }
          );
          res.status(200).json({ message: "Update successful" });
        })
        .catch((err) => {
          res.status(200).json({ message: "Update unsuccessful" });
          console.error("Error saving company in companydata DataBase :", err);
        });
    } else if (companyname === null && selectedCompany !== "") {
      let ID = getUserId();
      await proreferuser.findOneAndUpdate(
        { User_ID: ID },
        {
          Work_Email: workEmail,
          Position: position,
          Company_ID: Number(selectedCompany),
        }
      );
      res.json({ message: "Update successful" });
    }
  } catch (error) {
    console.log("Error fetching data from MongoDB: ", error);
    res.status(200).json({ message: "Update unsuccessful" });
  }
});

router.post("/requestEmployeeOtp", async (req, res) => {
  try {
    const { workEmail, isWorkEmailChanged } = req.body;
    if (isWorkEmailChanged) {
      const u1 = await proreferuser.findOne({ Work_Email: workEmail });
      if (u1) {
        res.status(200).json({
          message:
            "Work Email Already Exists. So Work Credentials will not be Updated",
        });
      } else {
        let { encryptedOTP, salt } = await sendOTPByEmail(workEmail);
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

router.post("/verifyEmployeeOtp", async (req, res) => {
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
