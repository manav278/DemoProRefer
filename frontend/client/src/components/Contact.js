import React, { useRef } from "react";
import MainNav from "./MainNav";
import Footer from "./Footer";
import "../App.css";
import feedback from "./assets/Feedback-1.png";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Contact() {
  // service_id=service_owt5xga
  // template_id=template_utm62cj;
  // publicKey=k_w4S-5BYB0KmuOvO
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_owt5xga", "template_utm62cj", form.current, {
        publicKey: "k_w4S-5BYB0KmuOvO",
      })
      .then(
        () => {
          toast.success("Successfully Sent", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        },
        (error) => {
          toast.error("Please try again later.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    // style={{display:'grid', alignContent:'center', justifyContent:'center'}}
    <>
      <MainNav></MainNav>

      <div className="container text-center" style={{ marginTop: "40px" }}>
        <div className="row text-light">
          <div className="col-12">
            <h4 className="lato-thin">
              You can directly contact us at{" "}
              <span className="text-primary">prorefer.team@gmail.com</span> or
              in case of any feedbacks, fill the below form
            </h4>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "3%", height: "40%" }}>
        <div className="row text-dark">
          <div
            className="col-lg-6 col-12"
            style={{ display: "grid", placeContent: "center" }}
          >
            <img
              src={feedback}
              alt="Feedback"
              width="109.2%"
              height="77.16%"
            ></img>
            {/* 910:643 */}
          </div>
          <form
            ref={form}
            onSubmit={sendEmail}
            style={{ borderRadius: "8px", height: "40%" }}
            className="col-lg-6 col-12 px-3 py-3 bg-color-feedbackform"
            data-bs-theme="dark"
          >
            <div className="mb-3" style={{ marginTop: "2%" }}>
              <label
                for="user_name"
                className="form-label"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                className="form-control text-light feedback-placeholder"
                id="fullname"
                placeholder="Enter your name"
                name="user_name"
              />
            </div>
            <div className="mb-3" style={{ marginTop: "2%" }}>
              <label
                for="user_email"
                class="form-label"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Email
              </label>
              <input
                type="email"
                className="form-control text-light feedback-placeholder"
                id="email"
                placeholder="name@example.com"
                name="user_email"
              />
            </div>
            <div className="mb-3" style={{ marginTop: "2%" }}>
              <label
                for="message"
                // className="form-label"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Feedback
              </label>
              <textarea
                className="form-control text-light feedback-placeholder"
                id="feedback"
                rows="3"
                placeholder="Enter your feedback"
                name="message"
              ></textarea>
            </div>
            <div style={{ marginTop: "5%" }}>
              <button
                className="btn-feedback-form play-btn col-12"
                style={{
                  borderRadius: "10px",
                  paddingTop: "1.5%",
                  paddingBottom: "1.5%",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer></Footer>
      <ToastContainer />
    </>
  );
}
