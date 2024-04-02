import React from "react";
import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Empcredentials() {
  const [globalWorkEmail, setGlobalWorkEmail] = useState("");
  const [isWorkEmailChanged, setIsWorkEmailChanged] = useState(false);
  // ------------------------------------------------
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyname, setCompanyName] = useState(null);
  const apiCall = async () => {
    try {
      await axios.get("https://prorefer-backend.onrender.com/api/getCompany").then((res) => {
        // console.log(res.data);
        setCompanyList(res.data);
        setLoading(false);
        if (res.data.message === "Server Error") {
          toast.error("Server Error", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
    } catch (e) {
      console.log("Error occured: ", e);
    }
  };
  useEffect(() => {
    apiCall();
  }, []);
  const handleSelect = (event) => {
    console.log(event.target.value);
    setSelectedCompany(event.target.value);
  };
  // ---------------------------------------------------------
  const [workEmail, setWorkEmail] = useState("");
  const [position, setPosition] = useState("");
  const handleWorkEmailChange = (event) => {
    setWorkEmail(event.target.value);
  };
  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };
  const getDetails = async () => {
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/getEditProfileEmployeeDetails")
        .then((res) => {
          res.data.Work_Email && setWorkEmail(res.data.Work_Email);
          res.data.Position && setPosition(res.data.Position);
          res.data.Company_ID && setSelectedCompany(res.data.Company_ID);
          res.data.Work_Email && setGlobalWorkEmail(res.data.Work_Email);
        });
    } catch (e) {
      console.log("Error occured: ", e);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  // ---------------------------------------------------------
  const handleEmployeeSubmit = async (e) => {
    try {
      e.preventDefault();
      if (otpVerified === false) {
        // alert("Verify OTP first, as your email is changed");
        toast.warn("Verify OTP first, as your email is changed", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      if (
        (((selectedCompany === "" && companyname !== null) ||
          (selectedCompany !== "" && companyname === null)) &&
          position &&
          workEmail) ||
        (selectedCompany === "" &&
          companyname === null &&
          position === null &&
          workEmail === null)
      ) {
        await axios
          .post("https://prorefer-backend.onrender.com/api/updateEmployee", {
            workEmail,
            position,
            selectedCompany,
            companyname,
          })
          .then((res) => {
            if (res.data.message === "Update successful") {
              toast.success("Employee details successfully updated", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => {
                  window.location.reload();
                  return;
                },
              });
            } else if (
              res.data.message === "Internal server error from backend"
            ) {
              toast.error("Error updating details", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          });
      } else {
        toast.warn("Correct format : (I) Either all field empty or filled ", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Error updating details", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    }
  };
  // ---------------------------------------------------------
  const [otp, setOtp] = useState("");
  const [getotpButtonClicked, setGetOtpButtonClicked] = useState(false);
  const [otpVerified, setOtpVerified] = useState(true);
  const handleGetOTP = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/requestEmployeeOtp", {
          workEmail,
          isWorkEmailChanged,
        })
        .then((res) => {
          if (res.data.message === "Otp sent") {
            toast.success("Otp successfully sent", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => {
                setGetOtpButtonClicked(true);
              },
            });
          } else if (
            res.data.message ===
            "Work Email Already Exists. So Work Credentials will not be Updated"
          ) {
            toast.warn(
              "Work Email Already Exists. So Work Credentials will not be Updated",
              {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
          }
        });
    } catch (error) {
      console.log("Error requesting OTP: ", error);
    }
  };

  // ---------------------------------------------------------

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/verifyEmployeeOtp", { otp })
        .then((res) => {
          if (res.data.message === "Otp verified") {
            toast.success("OTP verified successfully", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => {
                setGetOtpButtonClicked(false);
                // setIsPersonalEmailChanged(false);
                setOtpVerified(true);
              },
            });
          } else {
            toast.error("OTP incorrect! Try again", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };
  // ---------------------------------------------------------
  useEffect(() => {
    if (globalWorkEmail !== workEmail) {
      setIsWorkEmailChanged(true);
      setOtpVerified(false);
    } else setIsWorkEmailChanged(false);
  }, [workEmail, globalWorkEmail]);

  return (
    <div>
      <div className="col-10 text-center" style={{ marginBottom: "3%" }}>
        <h4 className="roboto-thin">Employee Credentials</h4>
      </div>

      {/* ----------------------------- */}

      <div
        className="col-10 p-4 bg-color-feedbackform text-dark"
        style={{ borderRadius: "8px" }}
      >
        <form data-bs-theme="dark">
          <div className="my-2">
            <label
              for="workEmail"
              class="form-label"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Work Email
            </label>
            <input
              type="email"
              class="form-control text-light feedback-placeholder"
              id="workEmail"
              value={workEmail}
              onChange={handleWorkEmailChange}
              placeholder="Enter Work Email"
            />
          </div>
          <div className="my-2">
            <label
              for="workPosition"
              class="form-label"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Work Position
            </label>
            <input
              type="text"
              class="form-control text-light feedback-placeholder"
              id="workPosition"
              value={position}
              onChange={handlePositionChange}
              placeholder="Enter Work Position"
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div>
                <label
                  class="form-label col-12"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={handleSelect}
                  className="feedback-placeholder"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: "lighter",
                    borderRadius: "5px",
                    padding: "3px",
                  }}
                >
                  <option value="">Other</option>
                  {companyList
                    ? companyList.map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.company}
                        </option>
                      ))
                    : "None"}
                </select>
              </div>
            </div>
          )}
          {selectedCompany === null || selectedCompany === "" ? (
            <div className="mb-3">
              <label
                for="companyname"
                style={{ marginTop: "2%", color: "rgba(255, 255, 255, 0.8)" }}
                className="form-label font-family-label"
              >
                Company Name
              </label>
              <input
                className="form-control text-light bg-dark createcampaign-placeholder"
                type="text"
                placeholder="Company Name"
                id="companyname"
                name="companyname"
                value={companyname}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                }}
              ></input>
            </div>
          ) : null}
          {isWorkEmailChanged && !getotpButtonClicked && (
            <div className="my-4">
              <button
                className="col-12 btn-feedback-form play-btn"
                style={{
                  borderRadius: "5px",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  paddingTop: "2%",
                  paddingBottom: "2%",
                }}
                onClick={handleGetOTP}
              >
                Get OTP
              </button>
            </div>
          )}
          {/* --------------------------------------------------------------------- */}
          {isWorkEmailChanged && getotpButtonClicked && (
            <div className="my-4">
              <div className="row">
                <input
                  className="col-5"
                  type="text"
                  class="form-control text-light feedback-placeholder mx-3"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  style={{ width: "50%" }}
                />
                <button
                  className="col-5 btn-feedback-form play-btn"
                  style={{
                    borderRadius: "5px",
                    paddingLeft: "3%",
                    paddingRight: "3%",
                    paddingTop: "2%",
                    paddingBottom: "2%",
                  }}
                  onClick={handleSubmitOtp}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}
          <div className="my-4">
            <button
              className="col-12 btn-feedback-form play-btn"
              style={{
                borderRadius: "5px",
                paddingLeft: "3%",
                paddingRight: "3%",
                paddingTop: "2%",
                paddingBottom: "2%",
              }}
              onClick={handleEmployeeSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
