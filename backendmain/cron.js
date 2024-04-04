import Notreplied from "./Algorithm/Notreplied.js";
import getDate from "./Algorithm/date.js";
import currReqModel from "./Model/currentrequest.js";
import proreferusers from "./Model/proreferuser.js";
import schedule from "node-schedule";

// second minute hour day month day_of_week
const job = schedule.scheduleJob("59 */3 * * * *", async () => {
  let currRequests = await currReqModel.find({});
  if (currRequests != null) {
    currRequests.forEach((curr) => {
      Notreplied(curr.Referral_ID);
    });
  }
});

const jobDaily = schedule.scheduleJob("1 1 0 * * *", async () => {
  // let dateToCheck = getDate() - 2;
  // let currRequests = await currReqModel.find({
  //   Latest_Req_Date: { $lte: dateToCheck },
  // });
  // if (currRequests != null) {
  //   currRequests.forEach((curr) => {
  //     Notreplied(curr.Referral_ID);
  //   });
  // }
});

const jobMonthly = schedule.scheduleJob("0 0 0 1 * *", async () => {
  // await proreferusers.updateMany(
  //   { Company_ID: { $ne: null } },
  //   {
  //     $set: {
  //       Referrals_Reviewed_ThisMonth: 0,
  //       Referrals_Requested_ThisMonth: 0,
  //     },
  //   }
  // );
});

const jobDemo = schedule.scheduleJob("0 18 13 * * *", async () => {
  // await proreferusers.updateMany(
  //   { Company_ID: { $ne: null } },
  //   {
  //     $set: {
  //       Referrals_Reviewed_ThisMonth: 0,
  //       Referrals_Requested_ThisMonth: 0,
  //     },
  //   }
  // );
  // console.log("Done");
});

export default job;
export { jobDaily, jobMonthly };
