import historyModel from "../Model/referralhistory.js";
import currReqModel from "../Model/currentrequest.js";
import proreferusers from "../Model/proreferuser.js";
import algo2 from "../Algorithm/algo2.js";
import getDate from "../Algorithm/date.js";
import {
  firstSuccessfulToEmployee,
  rejectedToApplicant,
} from "../Algorithm/nodemailer.js";

const Notreplied = async (Referral_ID) => {
  let caseForEmail, applicantEmail, employeeEmail;
  await new Promise(async (resolve) => {
    let currReqTuple = await currReqModel.findOneAndUpdate(
      { Referral_ID: Referral_ID },
      { $inc: { No_Reply_Count: 1 } },
      { new: true }
    );
    let NRC = currReqTuple.No_Reply_Count;
    let DC = currReqTuple.Denial_Count;
    // Check if tuple already exists in referral history or not
    if (NRC !== 1 || DC !== 0) {
      // ----------------------------------------------Case1
      if (NRC + DC >= 3) {
        let historyZero = currReqTuple.History[0];
        //   ------------------------------
        //Push Hist[0] from currentrequest to referralhistory.
        historyZero.Result = "Not Replied";
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
              "Error updating data in historySchema at Notreplied.js: ",
              error
            );
          });
        // -----------------------------
        //Employee_LRD Update,Decrement Referrals_Reviewed_ThisMonth: 1,Total_Referrals_Reviewed: 1,
        let empID = currReqTuple.History[0].Employee_ID;
        let empLRD = currReqTuple.Employee_LRD;
        await proreferusers
          .findOneAndUpdate(
            { User_ID: Number(empID) },
            {
              $set: { Last_Referral_Date: empLRD },
              $dec: {
                Referrals_Reviewed_ThisMonth: 1,
                Total_Referrals_Reviewed: 1,
              },
            },
            { new: true }
          )
          .catch((error) => {
            console.log(
              "Error updating data in userSchema at Notreplied.js: ",
              error
            );
          });
        // -----------------------------
        //Delete currentrequest data.
        let applicant = await proreferusers
          .findOne({ User_ID: currReqTuple.Applicant_ID })
          .catch((error) => {
            console.log(
              "Error finding data from ProReferUsers at reject1: ",
              error
            );
          });
        applicantEmail = applicant.Personal_Email;
        caseForEmail = "NR3";
        await currReqModel
          .findOneAndDelete({ Referral_ID: Referral_ID })
          .catch((error) => {
            console.log(
              "Error deleting tuple from currentRequests in reject1: ",
              error
            );
          });
          resolve();
      } else {
        let historyZero = currReqTuple.History[0];
        historyZero.Result = "Not Replied";
        //   ------------------------------------
        //Push Hist[0] from currentrequest to referralhistory.
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
              "Error updating data in historySchema at noreply route: ",
              error
            );
          });
        //-----------------------------
        //Employee_LRD Update,Decrement Referrals_Reviewed_ThisMonth: 1,Total_Referrals_Reviewed: 1,
        let empID = currReqTuple.History[0].Employee_ID;
        let empLRD = currReqTuple.Employee_LRD;
        await proreferusers
          .findOneAndUpdate(
            { User_ID: Number(empID) },
            {
              $set: { Last_Referral_Date: empLRD },
              $dec: {
                Referrals_Reviewed_ThisMonth: 1,
                Total_Referrals_Reviewed: 1,
              },
            },
            { new: true }
          )
          .catch((error) => {
            console.log(
              "Error updating data in userSchema at Notreplied.js: ",
              error
            );
          });
        //-----------------------------
        await currReqModel
          .findOneAndUpdate(
            { Referral_ID: Referral_ID },
            { $set: { History: [] } },
            { new: true }
          )
          .catch((error) => {
            console.log("Error updating history array in noreply: ", error);
          });

        await historyModel
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
                caseForEmail = "NR2BREAK";
                await currReqModel
                  .findOneAndDelete({ Referral_ID: Referral_ID })
                  .catch((error) => {
                    console.log(
                      "Error deleting tuple from currentRequests in NotReplied: ",
                      error
                    );
                  });
                await historyModel
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
                  resolve();
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
                caseForEmail = "NR2CONTINUE";

                let newHistoryItem = {
                  Employee_ID: newEmployeeID,
                  Employee_Request_Date: dateToday-1,
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
                resolve();
              }
            } else {
              console.log("No document found for employeeIDs in NotReplied");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } else {
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
                  Result: "Not Replied",
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
          let empLRD = currReqTuple.Employee_LRD;
          await proreferusers
            .findOneAndUpdate(
              { User_ID: Number(empID) },
              {
                $set: { Last_Referral_Date: empLRD },
                $dec: {
                  Referrals_Reviewed_ThisMonth: 1,
                  Total_Referrals_Reviewed: 1,
                },
              },
              { new: true }
            )
            .catch((error) => {
              console.log(
                "Error updating data in userSchema at Notreplied.js: ",
                error
              );
            });

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
                  "Error finding data from ProReferUsers at NR: ",
                  error
                );
              });
            applicantEmail = applicant.Personal_Email;
            caseForEmail = "NR1BREAK";
            await currReqModel
              .findOneAndDelete({ Referral_ID: Referral_ID })
              .catch((error) => {
                console.log(
                  "Error deleting tuple from currentRequests in NR: ",
                  error
                );
              });
            await historyModel
              .findOneAndUpdate(
                { Referral_ID: Referral_ID },
                {
                  $set: { result: "Not Referred" },
                },
                { new: true }
              )
              .catch((error) => {
                console.log(
                  "Error setting history result to not referred in NR: ",
                  error
                );
              });
              resolve();
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
            caseForEmail = "NR1CONTINUE";

            let newHistoryItem = {
              Employee_ID: newEmployeeID,
              Employee_Request_Date: dateToday-1,
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
            resolve();
          }
        })
        .catch((error) => {
          console.error("Error saving tuple in NR:", error);
        });
    }
  });
  try {
    if (
      caseForEmail === "NR3" ||
      caseForEmail === "NR2BREAK" ||
      caseForEmail === "NR1BREAK"
    ) {
      rejectedToApplicant(applicantEmail);
    } else if (
      caseForEmail === "NR2CONTINUE" ||
      caseForEmail === "NR1CONTINUE"
    ) {
      firstSuccessfulToEmployee(employeeEmail);
    } else {
    }
  } catch (error) {
    console.log("Error in NR: ", error);
  }
};
export default Notreplied;
