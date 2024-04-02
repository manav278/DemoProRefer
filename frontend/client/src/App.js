import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import MyContext from "./MyContext";
import EditProfileForm from "./components/EditProfileForm";
import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Dashboard/Home";
import MainHome from "./components/MainHome";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import SignupForm from "./components/SignupForm";
import Requestreferral from "./components/Requestreferral";



function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("https://prorefer-backend.onrender.com/api/verify");
        // console.log(response);
        if (response.status === 200) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
  };

  const passingObj = {
    loggedIn,
    handleLogout,
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={passingObj}>
        <Routes>
          <Route exact path="/" element={<MainHome />} />
          <Route path="/form" element={<EditProfileForm />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={loggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/requestreferral"
            element={<Requestreferral></Requestreferral>}
          />
          {/* <Route
            path="/signupform"
            element={<SignupForm></SignupForm>}
          /> */}
          
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
