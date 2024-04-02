  import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  Referral_ID: {
    unique: true,
    type: Number,
    required: true,
  },
  History: [
    {
      Employee_ID: Number,
      Employee_Request_Date: Number,
      Result: String,
      //Result - Pending, Referred, Not Referred.
    },
  ], // Max Array Size - 3
  Applicant_ID: {
    type: Number,
    required: true,
  },
  Company_ID: {
    type: Number,
    required: true,
  },
  date: Number, //Request_date of the currentrequest.
  Position: String,
  result: String, //This is the final result of the whole request
  Company_Name: String,
});

const historyModel = mongoose.model("ref-histories", historySchema);

export default historyModel;
