import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import login from "./assets/Login.jpg";
import MainNav from "./MainNav";
import Footer from "./Footer";
const PersonalDetailsForm = ({ formData, handleChange, nextStep }) => {
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
                  <h3>Personal Details</h3>
                </div>
              </div>
              <div className="col-12">
                <form
                  action="POST"
                  onSubmit={(e) => {
                    e.preventDefault();
                    nextStep();
                  }}
                >
                  <div className="mb-3">
                    <label
                      for="firstname"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      First Name
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="First Name"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label
                      for="lastname"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Last Name
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="Last Name"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label
                      for="personalemail"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Personal Email
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="email"
                      placeholder="Personal Email Address"
                      id="personalemail"
                      name="personalemail"
                      value={formData.personalemail}
                      onChange={handleChange}
                    ></input>
                  </div>

                  <div className="mb-3">
                    <label
                      for="mobilenumber"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Mobile Number
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="Mobile Number"
                      id="mobilenumber"
                      name="mobilenumber"
                      value={formData.mobilenumber}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3" style={{ marginTop: "1%" }}>
                    <label
                      for="password"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    ></input>
                  </div>

                  <div>
                    <button
                      type="submit"
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
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 my-2">
                <span>Already have an account? </span>
                <Link to="/login">Login now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default PersonalDetailsForm;
