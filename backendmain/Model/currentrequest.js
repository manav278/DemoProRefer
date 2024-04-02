import mongoose from "mongoose";

const currentRequestsSchema = new mongoose.Schema({
  Referral_ID: {
    type: Number,
    require: true,
    unique: true,
  },
  Applicant_ID: {
    type: Number,
    require: true,
  },
  Company_ID: {
    type: Number,
    require: true,
  },
  Request_Date: Number,
  Latest_Req_Date: Number,
  // Result: String,
  Position: String,
  Location: String,
  Job_Portal_Url: String,
  Denial_Count: Number,
  No_Reply_Count: Number,
  Employee_LRD: Number, //Employee last referral date
  History: [
    {
      Employee_ID: Number,
      Employee_Request_Date: Number,
      Result: String,
      //Result - Pending, Referred, Not Referred.
    },
  ], // Max Array Size - 3
  Company_Name: String,
});

const currReqModel = mongoose.model("current-request", currentRequestsSchema);
export default currReqModel;
