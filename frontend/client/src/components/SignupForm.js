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
    selectedcompany: null,
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
          (formData.selectedcompany === null ||
            formData.selectedcompany === "Other") &&
          formData.location === "" &&
          formData.position === "") ||
          (formData.workemail !== "" &&
            formData.companyname !== "" &&
            (formData.selectedcompany == null ||
              formData.selectedcompany === "Other") &&
            formData.location !== "" &&
            formData.position !== "") ||
          (formData.workemail !== "" &&
            formData.companyname === "" &&
            (formData.selectedcompany !== null ||
              formData.selectedcompany === "Other") &&
            formData.location !== "" &&
            formData.position !== ""))
      ) {
        const response = await axios.post(
          "https://prorefer-backend.onrender.com/api/signup",
          formData
        );
        if (response.data.message === "Personal Email Already Exists.") {
          toast.error("Personal Email Already Exists.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (
          response.data.message ===
          "Personal Email and Company Email Already Exists."
        ) {
          toast.error("Personal Email and Company Email Already Exists.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (response.data.message === "Company Email Already Exists.") {
          toast.error("Company Email Already Exists.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (response.data === 0) {
          toast.success("Signup Successful!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => {
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
            },
          });
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
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
