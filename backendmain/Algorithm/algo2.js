import users from "../Model/proreferuser.js";
const customSort = (a, b) => {
  if (a.Last_Referral_Date != b.Last_Referral_Date) {
    return a.Last_Referral_Date - b.Last_Referral_Date;
  } else if (a.Referrals_Reviewed_ThisMonth != b.Referrals_Reviewed_ThisMonth) {
    return a.Referrals_Reviewed_ThisMonth - b.Referrals_Reviewed_ThisMonth;
  }
  return a.Warning - b.Warning;
};

const isPrevEmployee = async(employees, previousEmployeesArray) => {
    for(let i=0; i<employees.length; i++)
    {
        if(!previousEmployeesArray.includes(employees[i].User_ID))
        {
            return employees[i].User_ID;
        }
    }
    return -1;
}

async function filterByLocation(requestedLocation, companyId, employeeArray) {
  try {
    let employees;
    const employees1 = await users.find({
      Company_ID: companyId, //export from reqquestref routes.
      Referrals_Reviewed_ThisMonth: [0, 1, 2, 3, 4],
      COMPANY_LOCATION: requestedLocation,
    });
    const employees2 = await users.find({
      Company_ID: companyId, //export from reqquestref routes.
      Referrals_Reviewed_ThisMonth: [0, 1, 2, 3, 4],
    });
    if (employees2.length===0 && employees1.length===0) {
      return -1;
    }
    // console.log("Employees1: ", employees1);
    // console.log("Employees2: ", employees2);

    if(employees1.length!=0)
    {
      employees = employees1;
    }
    else
    {
      employees = employees2;
    }

    employees.sort(customSort);

    // console.log("Employees", employees);
    const employeeIds = await isPrevEmployee(employees, employeeArray);
    if(employeeIds===-1)
        return -1;
    else
        return employeeIds;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}

// let res = await filterByLocation("India", 1, [64, 80]);
// console.log(res);

export default filterByLocation;
