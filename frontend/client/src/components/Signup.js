import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import login from "./assets/Login.jpg";
import MainNav from "./MainNav";
import Footer from "./Footer";
const Signup = () => {
  //firstname , lastname, mobilenumber,personalemail,country,
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [personalemail, setPersonalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:3003/signup", {
          personalemail,
          password,
        })
        .then((res) => {
          if (res.data === "exist") {
            alert("User already exists");
          } else if (res.data === "notexist") {
            alert("Your account is successfully created.");
          }
        })
        .catch((e) => {
          alert("wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
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
                </div>
              </div>
              <div className="col-12">
                <form action="POST" data-bs-theme="dark">
                  <div className="mb-3">
                    <label
                      for="firstname"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      FirstName
                    </label>
                    <input
                      className="form-control text-light createcampaign-placeholder"
                      type="text"
                      placeholder="First Name"
                      id="firstname"
                      name="firstname"
                      onChange={(e) => setFirstName(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label
                      for="lastname"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      LastName
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="email"
                      placeholder="Last Name"
                      id="lastname"
                      onChange={(e) => setLastName(e.target.value)}
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
                      onChange={(e) => setPersonalEmail(e.target.value)}
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
                      onChange={(e) => setMobileNumber(e.target.value)}
                    ></input>
                  </div>

                  <div className="mb-3">
                    <label
                      for="country"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Country
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="text"
                      placeholder="Country"
                      id="country"
                      // value={formData.country}
                      onChange={(e) => setCountry(e.target.value)}
                      // onChange={handleChange}
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
                      // value={formData.password}
                      onChange={(e) => setPassword(e.target.value)}
                      // onChange={handleChange}
                    ></input>
                  </div>

                  <div>
                    <button
                      type="submit"
                      // onClick={submit}
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
                      Signup
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
export default Signup;
