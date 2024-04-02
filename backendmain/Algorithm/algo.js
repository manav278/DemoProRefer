import users from "../Model/proreferuser.js";
import { getUserId } from "../Routes/Loginroutes.js";
const customSort = (a, b) => {
  if (a.Last_Referral_Date != b.Last_Referral_Date) {
    return a.Last_Referral_Date - b.Last_Referral_Date;
  } else if (a.Referrals_Reviewed_ThisMonth != b.Referrals_Reviewed_ThisMonth) {
    return a.Referrals_Reviewed_ThisMonth - b.Referrals_Reviewed_ThisMonth;
  }
  return a.Warning - b.Warning;
};
async function filterByLocation(requestedLocation, companyId) {
  try {
    let employees;
    let currentUser = getUserId();
    const employees1 = await users.find({
      Company_ID: companyId, //export from reqquestref routes.
      Referrals_Reviewed_ThisMonth: [0, 1, 2, 3, 4],
      COMPANY_LOCATION: requestedLocation,
      User_ID: { $ne: Number(currentUser) },
    });

    const employees2 = await users.find({
      Company_ID: companyId, //export from reqquestref routes.
      Referrals_Reviewed_ThisMonth: [0, 1, 2, 3, 4],
      User_ID: { $ne: Number(currentUser) },
    });
    if (employees2.length === 0 && employees1.length === 0) {
      return -1;
    }

    if (employees1.length != 0) {
      employees = employees1;
    } else {
      employees = employees2;
    }

    employees.sort(customSort);

    // console.log("Employees", employees);
    const employeeIds = employees[0].User_ID;
    return employeeIds;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}

export default filterByLocation;
