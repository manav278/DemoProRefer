import algo from "./algo.js";
import companyModel from "../Model/companydata.js";
import proreferusers from "../Model/proreferuser.js";
import currentrequest from "../Model/currentrequest.js";
import { getUserId } from "../Routes/Loginroutes.js";
import requestdate from "./date.js";
import { getNextSequenceValue } from "../Model/historyCounter.js";
import {
  firstSuccessfulToApplicant,
  firstSuccessfulToEmployee,
  firstFailToApplicant,
} from "./nodemailer.js";

const request = async (position, company, requestedLocation, url) => {
  try {
    const result = await algo(requestedLocation, company);
    const intResult = Number(result);
    if (intResult === -1) {
      try {
        const applicantId = await getUserId();
        console.log("The applicantid is : ", applicantId);
        const applicantToSend = await proreferusers.findOne({
          User_ID: applicantId,
        });
        proreferusers
          .findOneAndUpdate(
            { User_ID: applicantId },
            {
              $inc: {
                Referrals_Requested_ThisMonth: -1,
                Total_Referrals_Requested: -1,
              },
            },
            { new: true }
          )
          .then((updatedUser) => {
            if (!updatedUser) {
              console.error(`No user found with User_ID: ${applicantId}`);
              return;
            }
            console.log("Updated user:", updatedUser);
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
        let applicantEmail = applicantToSend.Personal_Email;
        firstFailToApplicant(applicantEmail);
      } catch (error) {
        console.log("Error while employee not found for 1st request: ", error);
      }
    } else {
      // --------------------------------------------

      const employee = await proreferusers.findOne({ User_ID: intResult });
      const employeeEmail = employee.Work_Email;
      const applicantId = await getUserId();
      const reqdate = await requestdate(); //date in number format
      const Emp_LRD = employee.Last_Referral_Date;
      // ---------------------------------------------
      const companyDetails = await companyModel.findOne({
        Company_ID: company,
      });
      const companyName = companyDetails.Company_Name;
      //   --------------------------------------------

      const count = await getNextSequenceValue("current");
      const newCurrentRequest = new currentrequest({
        Referral_ID: count,
        Applicant_ID: applicantId,
        Company_ID: company,
        Request_Date: reqdate,
        Latest_Req_Date: reqdate,
        Result: "Not Replied",
        Position: position,
        Location: requestedLocation,
        Job_Portal_Url: url,
        Denial_Count: 0,
        No_Reply_Count: 0,
        Employee_LRD: Emp_LRD,
        Company_Name: companyName,
        History: [
          {
            Employee_ID: employee.User_ID,
            Employee_Request_Date: reqdate,
            Result: "Pending",
          },
        ],
      });

      // Save the new user to the database
      newCurrentRequest
        .save()
        .then(() => {
          console.log("Current Request tuple saved successfully");
        })
        .catch((err) => {
          console.error("Error saving user:", err);
        });

      // ----------------------------------- Employee updated

      proreferusers
        .findOneAndUpdate(
          { User_ID: intResult },
          {
            $inc: {
              Referrals_Reviewed_ThisMonth: 1,
              Total_Referrals_Reviewed: 1,
            },
            $set: {
              Last_Referral_Date: reqdate,
            },
          },
          { new: true }
        )
        .then((updatedUser) => {
          if (!updatedUser) {
            console.error(`No user found with User_ID: ${intResult}`);
            return;
          }
          // console.log("Updated user:", updatedUser);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });

      //------------------------------------ Email
      const applicantToSend = await proreferusers.findOne({
        User_ID: applicantId,
      });
      let applicantEmail = applicantToSend.Personal_Email;
      firstSuccessfulToApplicant(applicantEmail);
      firstSuccessfulToEmployee(employeeEmail);
      // --------------------------------------------
    }
  } catch (error) {
    console.log("Error fetching data in request.js", error);
  }
};

export default request;
