import historyModel from "../Model/referralhistory.js";
import currReqModel from "../Model/currentrequest.js";
import proreferusers from "../Model/proreferuser.js";
import algo2 from "../Algorithm/algo2.js";
import getDate from "../Algorithm/date.js";
import {
  firstSuccessfulToEmployee,
  rejectedToApplicant,
} from "../Algorithm/nodemailer.js";
import express from "express";

const router = express.Router();
let caseForEmail, applicantEmail, employeeEmail;

router.get("/reject1/:Referral_ID", async (req, res) => {
  const Referral_ID = Number(req.params.Referral_ID);
  let currReqTuple = await currReqModel.findOneAndUpdate(
    { Referral_ID: Referral_ID },
    { $inc: { Denial_Count: 1 } },
    { new: true }
  );
  let NRC = currReqTuple.No_Reply_Count;
  let DC = currReqTuple.Denial_Count;

  // Check if tuple already exists in referral history or not
  if (NRC !== 0 || DC !== 1) {
    //This is not the first request, previously tuple should have been created in referral history

    //Now check if NRC+DC>=3
    if (NRC + DC >= 3) {
      let historyZero = currReqTuple.History[0];
      historyZero.Result = "Not Referred";
      let historyTuple = await historyModel
        .findOneAndUpdate(
          { Referral_ID: Referral_ID },
          {
            $push: { History: historyZero },
            $set: { result: "Not Referred" },
          },
          { new: true }
        )
        .catch((error) => {
          console.log(
            "Error updating data in historySchema at reject1 route: ",
            error
          );
        });

      let applicant = await proreferusers
        .findOne({ User_ID: currReqTuple.Applicant_ID })
        .catch((error) => {
          console.log(
            "Error finding data from ProReferUsers at reject1: ",
            error
          );
        });
      applicantEmail = applicant.Personal_Email;
      caseForEmail = "REJECT3";
      currReqModel
        .findOneAndDelete({ Referral_ID: Referral_ID })
        .catch((error) => {
          console.log(
            "Error deleting tuple from currentRequests in reject1: ",
            error
          );
        });
      res.json(0);
    } else {
      // NRC+DC<3 => Case 2

      let historyZero = currReqTuple.History[0];
      historyZero.Result = "Not Referred";
      let historyTuple = await historyModel
        .findOneAndUpdate(
          { Referral_ID: Referral_ID },
          {
            $push: { History: historyZero },
          },
          { new: true }
        )
        .catch((error) => {
          console.log(
            "Error updating data in historySchema at reject1 route: ",
            error
          );
        });

      currReqModel
        .findOneAndUpdate(
          { Referral_ID: Referral_ID },
          { $set: { History: [] } },
          { new: true }
        )
        .catch((error) => {
          console.log("Error updating history array in reject1: ", error);
        });

      historyModel
        .aggregate([
          { $match: { Referral_ID: Referral_ID } }, // Match the document with the specified Referral_ID
          { $unwind: "$History" }, // Unwind the History array
          {
            $group: {
              _id: "$Referral_ID",
              Employee_IDs: { $addToSet: "$History.Employee_ID" },
            },
          }, // Group by Referral_ID and add Employee_IDs to a set
          { $project: { _id: 0, Employee_IDs: 1 } }, // Project to show only the Employee_IDs array
        ])
        .then(async (result) => {
          if (result.length > 0) {
            const employeeIDs = result[0].Employee_IDs;
            employeeIDs.push(currReqTuple.Applicant_ID);
            let newEmployeeID = await algo2(
              currReqTuple.Location,
              currReqTuple.Company_ID,
              employeeIDs
            );
            if (newEmployeeID === -1) {
              let applicant = await proreferusers
                .findOne({ User_ID: currReqTuple.Applicant_ID })
                .catch((error) => {
                  console.log(
                    "Error finding data from ProReferUsers at reject1: ",
                    error
                  );
                });
              applicantEmail = applicant.Personal_Email;
              caseForEmail = "REJECT2BREAK";
              currReqModel
                .findOneAndDelete({ Referral_ID: Referral_ID })
                .catch((error) => {
                  console.log(
                    "Error deleting tuple from currentRequests in reject1: ",
                    error
                  );
                });
              historyModel
                .findOneAndUpdate(
                  { Referral_ID: Referral_ID },
                  {
                    $set: { result: "Not Referred" },
                  },
                  { new: true }
                )
                .catch((error) => {
                  console.log(
                    "Error setting history result to not referred in reject1: ",
                    error
                  );
                });

              res.json(0);
            } else {
              // New Employee found
              let dateToday = await getDate();
              let user = await proreferusers.findOneAndUpdate(
                { User_ID: newEmployeeID },
                {
                  $inc: {
                    Referrals_Reviewed_ThisMonth: 1,
                    Total_Referrals_Reviewed: 1,
                  },
                  // $set: { Last_Referral_Date: dateToday },
                },
                { new: true }
              );
              employeeEmail = user.Work_Email;
              let employeeLRD = user.Last_Referral_Date;
              caseForEmail = "REJECT2CONTINUE";

              let newHistoryItem = {
                Employee_ID: newEmployeeID,
                Employee_Request_Date: dateToday,
                Result: "Pending",
              };
              let newCurrReqTuple = await currReqModel.findOneAndUpdate(
                { Referral_ID: Referral_ID },
                {
                  $set: {
                    History: [newHistoryItem],
                    Employee_LRD: employeeLRD,
                  },
                }
              );
              await proreferusers.findOneAndUpdate(
                { User_ID: newEmployeeID },
                {
                  $set: { Last_Referral_Date: dateToday },
                },
                { new: true }
              );
              res.json(0);
            }
          } else {
            console.log("No document found for employeeIDs in reject1");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  } else {
    // Referral_ID, currReqTuple, NRC, DC
    let dateToday = await getDate();
    let newTuple = new historyModel({
      Referral_ID: Referral_ID,
      History:
        currReqTuple.History.length > 0
          ? [
              {
                Employee_ID: currReqTuple.History[0].Employee_ID,
                Employee_Request_Date:
                  currReqTuple.History[0].Employee_Request_Date,
                Result: "Not Referred",
              },
            ]
          : [],
      Applicant_ID: currReqTuple.Applicant_ID,
      Company_ID: currReqTuple.Company_ID,
      date: currReqTuple.Request_Date,
      Position: currReqTuple.Position,
      result: "Pending",
      Company_Name: currReqTuple.Company_Name,
    });

    // Save the new document to the database
    newTuple
      .save()
      .then(async (savedTuple) => {
        let empID = currReqTuple.History[0].Employee_ID;
        let empArray = [empID];
        empArray.push(currReqTuple.Applicant_ID);
        let newEmployeeID = await algo2(
          currReqTuple.Location,
          currReqTuple.Company_ID,
          empArray
        );
        if (newEmployeeID === -1) {
          let applicant = proreferusers
            .findOne({ User_ID: currReqTuple.Applicant_ID })
            .catch((error) => {
              console.log(
                "Error finding data from ProReferUsers at reject1: ",
                error
              );
            });
          applicantEmail = applicant.Personal_Email;
          caseForEmail = "REJECT1BREAK";
          currReqModel
            .findOneAndDelete({ Referral_ID: Referral_ID })
            .catch((error) => {
              console.log(
                "Error deleting tuple from currentRequests in reject1: ",
                error
              );
            });
          historyModel
            .findOneAndUpdate(
              { Referral_ID: Referral_ID },
              {
                $set: { result: "Not Referred" },
              },
              { new: true }
            )
            .catch((error) => {
              console.log(
                "Error setting history result to not referred in reject1: ",
                error
              );
            });

          res.json(0);
        } else {
          // New Employee found
          let dateToday = await getDate();
          let user = await proreferusers.findOneAndUpdate(
            { User_ID: newEmployeeID },
            {
              $inc: {
                Referrals_Reviewed_ThisMonth: 1,
                Total_Referrals_Reviewed: 1,
              },
              // $set: { Last_Referral_Date: dateToday },
            },
            { new: true }
          );
          employeeEmail = user.Work_Email;
          let employeeLRD = user.Last_Referral_Date;
          caseForEmail = "REJECT1CONTINUE";

          let newHistoryItem = {
            Employee_ID: newEmployeeID,
            Employee_Request_Date: dateToday,
            Result: "Pending",
          };
          let newCurrReqTuple = await currReqModel.findOneAndUpdate(
            { Referral_ID: Referral_ID },
            {
              $set: { History: [newHistoryItem], Employee_LRD: employeeLRD },
            }
          );
          await proreferusers.findOneAndUpdate(
            { User_ID: newEmployeeID },
            {
              $set: { Last_Referral_Date: dateToday },
            },
            { new: true }
          );
          res.json(0);
        }
      })
      .catch((error) => {
        console.error("Error saving tuple in reject1:", error);
        res.json(-1);
      });
  }
});

router.get("/reject2", async (req, res) => {
  try {
    if (
      caseForEmail === "REJECT3" ||
      caseForEmail === "REJECT2BREAK" ||
      caseForEmail === "REJECT1BREAK"
    ) {
      rejectedToApplicant(applicantEmail);
    } else if (
      caseForEmail === "REJECT2CONTINUE" ||
      caseForEmail === "REJECT1CONTINUE"
    ) {
      firstSuccessfulToEmployee(employeeEmail);
    }
    res.json(0);
  } catch (error) {
    console.log("Error in reject2: ", error);
    res.json(-1);
  }
});

export default router;
