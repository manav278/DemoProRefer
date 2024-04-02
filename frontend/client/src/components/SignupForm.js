// SignUpForm.js

import React, { useState } from "react";
import PersonalDetailsForm from "./PersonalDetailsForm";
import CompanyDetailsForm from "./CompanyDetailsForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    personalemail: "",
    mobilenumber: "",
    password: "",
    workemail: "",
    companyname: "",
    selectedcompany: "",
    location: "",
    position: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.firstname !== "" &&
        formData.lastname !== "" &&
        formData.personalemail !== "" &&
        formData.mobilenumber !== "" &&
        formData.password !== "" &&
        ((formData.workemail === "" &&
          formData.companyname === "" &&
          formData.selectedcompany === null &&
          formData.location === "" &&
          formData.position === "") ||
          (formData.workemail !== "" &&
            formData.companyname !== "" &&
            formData.selectedcompany == null &&
            formData.location !== "" &&
            formData.position !== "") ||
          (formData.workemail !== "" &&
            formData.companyname === "" &&
            formData.selectedcompany !== null &&
            formData.location !== "" &&
            formData.position !== ""))
      ) {
        const response = await axios.post(
          "http://localhost:3003/api/signup",
          formData
        );
        if (response.data.message === "Personal Email Already Exists.") {
          alert("Personal Email Already Exists.");
        } else if (
          response.data.message ===
          "Personal Email and Company Email Already Exists."
        ) {
          alert("Personal Email and Company Email Already Exists.");
        } else if (response.data.message==="Company Email Already Exists.") {
          alert("Company Email Already Exists.");
        } else {
          alert("Signup Successful!");
          setFormData({
            firstname: "",
            lastname: "",
            personalemail: "",
            mobilenumber: "",
            password: "",
            workemail: "",
            companyname: "",
            selectedcompany: "",
            location: "",
            position: "",
          });
          navigate("/login");
        }
      } else {
        alert(
          "One or more fields are empty in Personal Details Section or Company Details Section"
        );
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again.");
    }
  };

  const updateFormData = (updatedData) => {
    setFormData(updatedData);
  };

  return (
    <div>
      {step === 1 && (
        <PersonalDetailsForm
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <CompanyDetailsForm
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          updateFormData={updateFormData}
        />
      )}
    </div>
  );
};

export default SignupForm;
