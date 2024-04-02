import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "./MainNav";
import Footer from "./Footer";
import axios from "axios";
import MyContext from "../MyContext";
import Empcredentials from "./Empcredentials";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfileForm = () => {
  // ------------------------------------------------------------

  const { handleLogout } = useContext(MyContext);
  const navigate = useNavigate();
  const [globalPersonalEmail, setGlobalPersonalEmail] = useState("");
  const [isPersonalEmailChanged, setIsPersonalEmailChanged] = useState(false);
  const [getotpButtonClicked, setGetOtpButtonClicked] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [location, setLocation] = useState("");

  const handleDismiss = () => {
    setShowAlert(false);
  };

  const getDetails = async () => {
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/getEditProfileDetails")
        .then((res) => {
          res.data.Mobile_Number && setMobileNumber(res.data.Mobile_Number);
          res.data.Personal_Email && setPersonalEmail(res.data.Personal_Email);
          res.data.Personal_Email &&
            setGlobalPersonalEmail(res.data.Personal_Email);
          res.data.COMPANY_LOCATION && setLocation(res.data.COMPANY_LOCATION);
        });
    } catch (e) {
      console.log("Error occured: ", e);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);

  const handleMobileChange = (event) => {
    setMobileNumber(event.target.value);
  };

  useEffect(() => {
    if (globalPersonalEmail !== personalEmail) {
      setIsPersonalEmailChanged(true);
      setOtpVerified(false);
    } else setIsPersonalEmailChanged(false);
  }, [personalEmail, globalPersonalEmail]);

  const handlePersonalEmailChange = async (event) => {
    setPersonalEmail(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleGetOTP = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/requestOtp", {
          personalEmail,
          isPersonalEmailChanged,
        })
        .then((res) => {
          if (res.data.message === "Otp sent") {
            toast.success(
              "OTP sent successfully to your changed Email address",
              {
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
              }
            );
          } else if (
            res.data.message ===
            "Personal Email Already Exists. So Applicant Credentials will not be Updated"
          ) {
            toast.warn(
              "Personal Email Already Exists. So Applicant Credentials will not be Updated",
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

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/verifyOtp", { otp })
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

  const handleApplicantSubmit = async (e) => {
    try {
      e.preventDefault();
      if (otpVerified === false) {
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
      if (mobileNumber && personalEmail && location) {
        await axios
          .post("https://prorefer-backend.onrender.com/api/updateApplicant", {
            mobileNumber,
            personalEmail,
            location,
            isPersonalEmailChanged,
          })
          .then((res) => {
            if (res.data.message === "Update successful") {
              if (isPersonalEmailChanged) {
                toast.success(
                  "Applicant details successfully updated, please login again",
                  {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    onClose: () => {
                      setIsPersonalEmailChanged(false);
                      setOtpVerified(true);
                      handleLogout();
                      navigate("/login");
                    },
                  }
                );
              } else {
                toast.success("Applicant details successfully updated", {
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
        toast.warn("Fields cannot be empty", {
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

  // ----------------------------------------------------------------

  return (
    <div>
      <MainNav />
      {showAlert && (
        <div
          class="alert alert-danger alert-dismissible fade show my-1"
          role="alert"
          style={{ borderRadius: "0" }}
        >
          <div>
            <p style={{ fontSize: "105%" }}>
              Please provide your employee credentials only if you are currently
              employed at a company. If you do provide them, you'll receive
              referral requests tailored to your profile.
            </p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={handleDismiss}
            ></button>
          </div>
        </div>
      )}
      <div
        style={{
          textAlign: "center",
          color: "#0275d8",
          marginTop: "3%",
          marginBottom: "3%",
        }}
      >
        <h2>Edit Profile</h2>
      </div>
      <div
        className="container text-light px-4"
        style={{ marginTop: "3%", marginBottom: "3%" }}
      >
        <div className="row gx-5s">
          <div
            className="col-md-6 col-12 align-items-center my-md-1 my-4 mx-md-0 mx-3"
            style={{ marginLeft: "7%" }}
          >
            <div className="col-10 text-center" style={{ marginBottom: "3%" }}>
              <h4 className="roboto-thin">Applicant Credentials</h4>
            </div>

            {/* ----------------------------- */}
            <div
              className="col-10 p-4 bg-color-feedbackform text-dark"
              style={{ borderRadius: "8px" }}
            >
              <form data-bs-theme="dark">
                <div className="my-2">
                  <label
                    for="phone"
                    class="form-label"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    class="form-control text-light feedback-placeholder"
                    id="phone"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="Enter Mobile Number"
                  />
                </div>
                <div className="my-2">
                  <label
                    for="personalEmail"
                    class="form-label"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Personal Email
                  </label>
                  <input
                    type="email"
                    class="form-control text-light feedback-placeholder"
                    id="personalEmail"
                    value={personalEmail}
                    onChange={handlePersonalEmailChange}
                    placeholder="Enter Personal Email"
                  />
                </div>
                <div className="my-2">
                  <label
                    for="location"
                    class="form-label"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    class="form-control text-light feedback-placeholder"
                    id="location"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder="Enter Location"
                  />
                </div>
                {isPersonalEmailChanged && !getotpButtonClicked && (
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
                {isPersonalEmailChanged && getotpButtonClicked && (
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
                    className="btn-feedback-form play-btn col-12"
                    style={{
                      borderRadius: "5px",
                      paddingLeft: "3%",
                      paddingRight: "3%",
                      paddingTop: "2%",
                      paddingBottom: "2%",
                    }}
                    onClick={handleApplicantSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* <div className="col-2"></div> */}
          <div className="col-md-6 col-12 my-md-1 my-4 mx-md-0 mx-3">
            <Empcredentials></Empcredentials>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <ToastContainer />
    </div>
  );
};

export default EditProfileForm;
