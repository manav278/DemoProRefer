import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import login from "./assets/Login.jpg";
import MainNav from "./MainNav";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
const CompanyDetailsForm = ({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  updateFormData,
}) => {
  const navigate = useNavigate();
  const [filterCompanies, setFilterCompanies] = useState("");
  const [globalCompanies, setGlobalCompanies] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [getotpButtonClicked, setGetOtpButtonClicked] = useState(false);
  const [personalOtp, setPersonalOtp] = useState("");
  const [workOtp, setWorkOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleFilterCompany = (event) => {
    setFilterCompanies(event.target.value);
  };

  const handlePerOtpChange = (event) => {
    setPersonalOtp(event.target.value);
  };

  const handleWorkOtpChange = (event) => {
    setWorkOtp(event.target.value);
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      await axios
        .post("https://prorefer-backend.onrender.com/api/verifyOtpAtSignup", {
          personalOtp,
          workOtp,
        })
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

  const handleGetOTP = async (event) => {
    event.preventDefault();
    if (
      formData.firstname !== "" &&
      formData.lastname !== "" &&
      formData.personalemail !== "" &&
      formData.mobilenumber !== "" &&
      formData.password !== "" &&
      ((formData.workemail === "" &&
        formData.companyname === "" &&
        (formData.selectedcompany === null || formData.selectedcompany==="Other") &&
        formData.location === "" &&
        formData.position === "") ||
        (formData.workemail !== "" &&
          formData.companyname !== "" &&
          (formData.selectedcompany == null || formData.selectedcompany==="Other") &&
          formData.location !== "" &&
          formData.position !== "") ||
        (formData.workemail !== "" &&
          formData.companyname === "" &&
          (formData.selectedcompany !== null || formData.selectedcompany==="Other") &&
          formData.location !== "" &&
          formData.position !== ""))
    ) {
      try {
        let personalEmail = formData.personalemail;
        let workEmail = formData.workemail;
        let result = await axios.post(
          "https://prorefer-backend.onrender.com/api/checkEmailExistence",
          { personalEmail, workEmail }
        );
        if (result.data === "Personal email exists") {
          toast.warn(
            "The personal email already exists. You can proceed to log in.",
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
                navigate("/login");
              },
            }
          );
        } else if (result.data === "Work email exists") {
          toast.warn(
            "The work email already exists. You can proceed to log in.",
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
                navigate("/login");
              },
            }
          );
        } else if (result.data === "Both email exists") {
          toast.warn(
            "The personal and work emails already exists. You can proceed to log in.",
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
                navigate("/login");
              },
            }
          );
        } else {
          await axios
            .post(
              "https://prorefer-backend.onrender.com/api/requestOtpAtSignup",
              {
                personalEmail,
                workEmail,
              }
            )
            .then((res) => {
              if (res.data.message === "Otp sent") {
                setGetOtpButtonClicked(true);
                toast.success("OTP sent successfully to your Email addresses", {
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
        }
      } catch (error) {
        console.log("Error requesting OTP: ", error);
      }
    } else {
      toast.error(
        "One or more fields are empty in Personal Details Section or Company Details Section",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  const apiCall = async () => {
    try {
      await axios
        .get("https://prorefer-backend.onrender.com/api/getCompany")
        .then((res) => {
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
          setCompanyList(res.data);
          setGlobalCompanies(res.data);
          setLoading(false);
        });
    } catch (e) {
      console.log("Error occured: ", e);
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  useEffect(() => {
    if (filterCompanies && globalCompanies) {
      setCompanyList(
        globalCompanies.filter((Company) =>
          Company.company.toLowerCase().includes(filterCompanies.toLowerCase())
        )
      );
    } else {
      setCompanyList(globalCompanies);
    }
  }, [filterCompanies]);
  // -------------------------------------
  const handleSelect = (event) => {
    setSelectedCompany(event.target.value);
    if (event.target.value != "Other") {
      let cName = globalCompanies[Number(event.target.value) - 1].company;
      toast.info(`${cName} selected`, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.info(
        `Other option selected, you may enter company name in the below text field`,
        {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };
  // -------------------------------------
  useEffect(() => {
    updateFormData({ ...formData, selectedcompany: selectedCompany });
  }, [selectedCompany]);
  return (
    <div>
      <MainNav></MainNav>
      <div className="container my-5">
        <div className="row">
          <div
            className="col-md-6"
            style={{
              padding: "0%",
              backgroundColor: "white",
              display: "grid",
              placeContent: "center",
            }}
          >
            <img src={login} className="img-fluid" alt="Img"></img>
          </div>
          <div
            className="col-md-6 my-md-0 my-3 text-dark bg-login-container"
            style={{ padding: "8%" }}
          >
            <div className="row">
              <div className="col-12">
                <h1>Join us today!</h1>
                <div>
                  <p>Sign up now to become a member.</p>
                  <h3>Company Details</h3>
                  <div
                    class="alert alert-danger my-3"
                    role="alert"
                    style={{ fontSize: "small", padding: "8px" }}
                  >
                    Enter below credentials only if you are an existing employee
                    at a company
                  </div>
                </div>
              </div>
              <div className="col-12">
                <form>
                  <div className="mb-3">
                    <label
                      for="workemail"
                      style={{ marginTop: "0.5%" }}
                      className="form-label font-family-label"
                    >
                      Work Email
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="email"
                      placeholder="Work Email"
                      id="workemail"
                      name="workemail"
                      value={formData.workemail}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div style={{ marginTop: "2%" }}>
                    <label for="referral_position" className="form-label">
                      Company Name
                    </label>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="mb-3 row">
                        <div className="col-6">
                          <select
                            value={selectedCompany}
                            onChange={handleSelect}
                            className="bg-dark"
                            style={{
                              color: "#888",
                              fontWeight: "lighter",
                              borderRadius: "5px",
                              padding: "3px",
                              paddingRight: "15%",
                            }}
                            size="5"
                          >
                            {/* {selectedCompany && (
                              <option value={selectedCompany} disabled>
                                {
                                  companyList[Number(selectedCompany) - 1]
                                    .company
                                }
                              </option>
                            )} */}
                            <option value={null}>Other</option>
                            {companyList
                              ? companyList.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.company}
                                  </option>
                                ))
                              : "None"}
                          </select>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="row">
                            <div className="col-12">
                              <input
                                className="form-control text-light bg-dark createcampaign-placeholder"
                                type="text"
                                placeholder="Filter Companies"
                                id="filterCompanies"
                                name="filterCompanies"
                                value={filterCompanies}
                                onChange={handleFilterCompany}
                              />
                            </div>
                            <div
                              className="col-12 text-center"
                              style={{ marginTop: "3%" }}
                            >
                              {(selectedCompany!="Other" && selectedCompany) &&
                                globalCompanies[Number(selectedCompany)] && (
                                  <div>
                                    <p className="p-0 m-0">Selected Company</p>
                                    <p className="text-primary p-0">
                                      {
                                        globalCompanies[
                                          Number(selectedCompany) - 1
                                        ].company
                                      }
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedCompany === null || selectedCompany === "" || selectedCompany==="Other" ? (
                    <div className="mb-3">
                      <label
                        for="companyname"
                        style={{ marginTop: "2%" }}
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
                        value={formData.companyname}
                        onChange={handleChange}
                      ></input>
                    </div>
                  ) : null}
                  <div className="mb-3">
                    <label
                      for="position"
                      // style={{ marginTop: "0.5%" }}
                      className="form-label font-family-label"
                    >
                      Company Position
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="Company Position"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label
                      for="location"
                      style={{ marginTop: "0.5%" }}
                      className="form-label font-family-label"
                    >
                      Company Location
                      <span style={{ fontWeight: "lighter" }}>(Country)</span>
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="Country Name"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    ></input>
                  </div>
                  {!otpVerified && !getotpButtonClicked && (
                    <div>
                      <button
                        className="btn-createcampaign-form bg-success mx-2"
                        style={{
                          borderRadius: "5px",
                          paddingLeft: "2%",
                          paddingRight: "2%",
                          paddingTop: "1%",
                          paddingBottom: "1%",
                          marginBottom: "2%",
                          marginTop: "2%",
                        }}
                        type="button"
                        onClick={handleGetOTP}
                      >
                        Get OTP
                      </button>
                    </div>
                  )}
                  {getotpButtonClicked && (
                    <div className="my-4 container">
                      <div className="row">
                        <input
                          className="col-5 my-1"
                          type="text"
                          class="form-control text-light bg-dark feedback-placeholder"
                          id="otp"
                          value={personalOtp}
                          onChange={handlePerOtpChange}
                          placeholder="Personal Email OTP"
                          style={{ width: "50%" }}
                        />
                        {formData.workemail && (
                          <input
                            className="col-5 my-1"
                            type="text"
                            class="form-control text-light bg-dark feedback-placeholder"
                            id="otp"
                            value={workOtp}
                            onChange={handleWorkOtpChange}
                            placeholder="Work Email OTP"
                            style={{ width: "50%" }}
                          />
                        )}
                        <button
                          className="col-5 btn-primary text-light bg-success"
                          style={
                            formData.workemail
                              ? {
                                  marginTop: "12px",
                                  borderRadius: "5px",
                                  paddingLeft: "3%",
                                  paddingRight: "3%",
                                  paddingTop: "2%",
                                  paddingBottom: "2%",
                                }
                              : {
                                  borderRadius: "5px",
                                  paddingLeft: "3%",
                                  paddingRight: "3%",
                                  paddingTop: "2%",
                                  paddingBottom: "2%",
                                }
                          }
                          onClick={handleSubmitOtp}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <button
                      className="btn-createcampaign-form bg-success mx-2"
                      style={{
                        borderRadius: "5px",
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        paddingTop: "1%",
                        paddingBottom: "1%",
                        marginBottom: "2%",
                        marginTop: "2%",
                      }}
                      type="button"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    {otpVerified && (
                      <button
                        className="btn-createcampaign-form bg-success"
                        style={{
                          borderRadius: "5px",
                          paddingLeft: "2%",
                          paddingRight: "2%",
                          paddingTop: "1%",
                          paddingBottom: "1%",
                          marginBottom: "2%",
                          marginTop: "2%",
                        }}
                        onClick={handleSubmit}
                      >
                        Sign Up
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <ToastContainer />
    </div>
  );
};

export default CompanyDetailsForm;
