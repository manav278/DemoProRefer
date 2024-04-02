import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import login from "./assets/Login.jpg";
import MainNav from "./MainNav";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onHandleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  async function submit(e) {
    e.preventDefault();
    let response = null;

    try {
      response = await axios
        .post("http://localhost:3003/api/login", {
          email,
          password,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.message === "Invalid email or password") {
            toast.error("Invalid Username or password", {
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
          else if(res.data===-2){
            toast.success("User doesn't exist. Please signup.", {
              position: "top-center",
              autoClose: 600,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => {
                
              },
            });
          } 
          else {
            toast.success("Loggedin Successfully", {
              position: "top-center",
              autoClose: 300,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => {
                const { token } = res.data;
                localStorage.setItem("token", token); // Store token in local storage
                setLoggedIn(true);
              },
            });
          }
        });
    } catch (e) {
      console.log("Login failed: ", e);
    }
  }
  return (
    <div>
      <MainNav></MainNav>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6" style={{ padding: "0%" }}>
            <img src={login} className="img-fluid" alt="Img"></img>
          </div>
          <div
            className="col-md-6 my-md-0 my-3 text-dark bg-login-container"
            style={{ padding: "8%" }}
          >
            <div className="row">
              <div className="col-12">
                <h1>Welcome back!</h1>
                <div>
                  <p>Log in to access your account.</p>
                </div>
              </div>
              <div className="col-12">
                <form action="POST">
                  <div className="mb-3">
                    <label
                      for="email"
                      style={{ marginTop: "2%" }}
                      className="form-label font-family-label"
                    >
                      Email
                    </label>
                    <input
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      type="email"
                      onChange={onHandleChangeEmail}
                      placeholder="Email Address"
                      id="email"
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
                      onChange={onHandleChangePassword}
                      className="form-control text-light bg-dark createcampaign-placeholder"
                      placeholder="Password"
                      id="password"
                    ></input>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={submit}
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
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 my-2">
                <span>Don't have an account? </span>
                <Link to="/signup">Signup now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <ToastContainer />
    </div>
  );
}
