import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  User_ID: {
    type: Number,
    require: true,
    unique: true,
  },
  First_Name: String,
  Last_Name: String,
  Mobile_Number: {
    type: String,
    require: true,
  },
  Personal_Email: {
    type: String,
    require: true,
    unique: true,
  },
  Work_Email: {
    type: String,
    // require: true,
    unique: true,
  },
  Referrals_Requested_ThisMonth: Number,
  Company_ID: Number,
  Position: String,
  COMPANY_LOCATION: String, //Company_Location->Own_Location
  Referrals_Reviewed_ThisMonth: Number, //{in one month}
  Last_Referral_Date: Number,
  Warning: Number, //[0-3]
  Total_Referrals_Reviewed: Number,
  Total_Referrals_Requested: Number,
});

const userModel = mongoose.model("prorefer-users", userSchema);

export default userModel;
