import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import profile from "../assets/profileicon.jpg";
import CustomNavbar from "./Navbar";
import MainNav from "../MainNav";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { Navigate } from "react-router-dom";
export default function Home() {
  const [userData, setUserData] = useState({});
  const [date, setDate] = useState("Loading...");
  const formatDate = async (dateNumber) => {
    let dateString = dateNumber.toString(); // Convert number to string
    let year = dateString.substring(0, 4); // Extract year
    let month = dateString.substring(4, 6); // Extract month
    let day = dateString.substring(6, 8); // Extract day

    let formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3003/api/dashboard");
      setUserData(response.data);
      let date1 = await formatDate(response.data.Last_Referral_Date);
      setDate(date1);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div>
      <MainNav />
      {/* ----------------------------------------- */}
      <div className="container-fluid dash">
        {/* ----------------------------------------- */}

        <div class="container px-4 text-center">
          <div class="row gx-2">
            <div class="col-12">
              <div class="p-4 text-white">
                <h2>Referral Revolution: Shaping Tomorrow's Workforce Today</h2>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------- */}
        <div
          class="container-fluid px-4 text-center"
          style={{ height: "auto" }}
        >
          <div class="row gx-4" style={{ marginBottom: "4%" }}>
            {/* *********************************** */}
            {/* col-lg-4 col-md-5 col-sm-6 */}
            <div class="col-md-4 col-12">
              <div
                class="p-3 dashinner2 text-light"
                style={{
                  backgroundColor: "#232931",
                  paddingBottom: "3%",
                  height: "auto",
                  marginBottom: "3%",
                  borderRadius: "8px",
                }}
              >
                <Link to="/form">
                  <button
                    style={{
                      width: "75%",
                      marginTop: "2%",
                    }}
                    type="button"
                    className="play-btn py-2"
                  >
                    Edit Profile
                  </button>
                </Link>
                <div className="my-3">
                  <img
                    src={profile}
                    alt="Feedback"
                    width="27.6%"
                    height="22.6%"
                  ></img>
                  {/* 552:452 */}
                  <h4 className="mt-3 mb-4">
                    {userData.First_Name}{" "}{userData.Last_Name}
                  </h4>
                </div>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    fontSize: "115%",
                  }}
                >
                  <table className="table1">
                    <tr>
                      <td>
                        <p>Location</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.COMPANY_LOCATION}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Total Referrals Requested</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.Total_Referrals_Requested}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Total Referrals Received</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.Referrals_Reviewed_ThisMonth}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Monthly Requests Received</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.Referrals_Reviewed_ThisMonth} / 5</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Monthly Requests Sent</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.Referrals_Requested_ThisMonth} / 3</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Last Referral Date</p>
                      </td>
                      <td>
                        <p>{date}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Warning</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{userData.Warning}</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            {/* *********************************** */}
            {/* col-lg-8 col-md-7 col-sm-6 */}
            <div class="col-md-8 col-12">
              <div
                class="p-3 dashinner2"
                style={{
                  height: "auto",
                  // border: "5px solid #6C757D",
                  borderRadius: "8px",
                  backgroundColor: "#232931",
                }}
              >
                <CustomNavbar />
              </div>
            </div>

            {/* *********************************** */}
          </div>
        </div>
        {/* ----------------------------------------- */}
      </div>
      <Footer></Footer>
      {/* ----------------------------------------- */}
    </div>
  );
}
