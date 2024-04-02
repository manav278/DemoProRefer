import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "../../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Received = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [msg, setMsg] = useState(null);
  const fetchAccept = async (Referral_ID) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://prorefer-backend.onrender.com/api/accept1/${Referral_ID}`
      );
      if (response.data.message === "Added") {
        setLoading(false);
        toast.success("Accepted successfully", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            axios.get("https://prorefer-backend.onrender.com/api/accept2");
            navigate("/dashboard");
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.error("Error fetching Accept data:", error);
    }
  };

  const fetchReject = async (Referral_ID) => {
    setLoadingReject(true);
    try {
      const response = await axios.get(
        `https://prorefer-backend.onrender.com/api/reject1/${Referral_ID}`
      );
      if (response.data === 0) {
        setLoadingReject(false);
        toast.success("Rejected successfully", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            axios.get("https://prorefer-backend.onrender.com/api/reject2");
            navigate("/dashboard");
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.error("Error fetching Accept data:", error);
    }
  };

  // -------------------------------------------------
  const [id, setId] = useState(null);
  useEffect(() => {
    axios
      .get("https://prorefer-backend.onrender.com/api/getreceiveemployeeid")
      .then((response) => {
        setId(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching ID:", error);
      });
  }, []);

  // ------------------------------------------
  const viewResume = async (applicantId) => {
    try {
      const response = await axios.get(
        `https://prorefer-backend.onrender.com/api/getApplicantPdf/${applicantId}`,
        {
          responseType: "blob", // Use blob responseType to handle binary data
        }
      );

      // Create a Blob object from the binary data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the Blob object
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Use the download attribute to trigger a download of the PDF file
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "file.pdf"); // Specify the file name here
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the URL object
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  //----------------------------------------------------
  const [currentRequest, setCurrentRequest] = useState([]);
  const fetchCurrentData = async () => {
    try {
      const response = await axios.get(
        "https://prorefer-backend.onrender.com/api/currentreceive"
      );
      // console.log(response);
      const formattedData = response.data.map((obj) => {
        return {
          ...obj,
          Request_Date: formatDate(obj.Request_Date),
        };
      });
      setCurrentRequest(formattedData);
    } catch (error) {
      console.error("Error fetching PastRequest Sent data:", error);
    }
  };
  useEffect(() => {
    fetchCurrentData();
  }, []);

  // -------------------------------------------------

  const [pastRequest, setPastRequest] = useState([]);
  const fetchPastData = async () => {
    try {
      const response = await axios.get("https://prorefer-backend.onrender.com/api/pastreceive");
      console.log(response);
      const formattedData = response.data.map((obj) => {
        return {
          ...obj,
          date: formatDate(obj.date),
        };
      });
      setPastRequest(formattedData);
    } catch (error) {
      console.error("Error fetching PastRequest Sent data:", error);
    }
  };
  useEffect(() => {
    fetchPastData();
  }, []);

  const formatDate = (dateNumber) => {
    let dateString = dateNumber.toString(); // Convert number to string
    let year = dateString.substring(0, 4); // Extract year
    let month = dateString.substring(4, 6); // Extract month
    let day = dateString.substring(6, 8); // Extract day

    let formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="scrollable-list" style={{maxHeight:"33.5em"}}>
            <ul className="list-group">
              {/* ---------------currentRequest Data------------ */}
              <h3
                style={{
                  color: "peachpuff",
                  marginBottom: "1%",
                }}
              >
                Current Requests
              </h3>

              {/* ---------------------------------------------- */}

              {currentRequest.length === 0 ? (
                <p className="text-light">No Current Requests Now</p>
              ) : (
                currentRequest.map((ob, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      index % 2 === 0
                        ? "bg-dark-blue text-light"
                        : "bg-light-blue text-light"
                    }`}
                  >
                    <div class="container text-center">
                      <div className="row justify-content-evenly">
                        {/* ---------------------------------------------- */}

                        <div className="col-12 col-sm-3 col-md-3">
                          <div style={{ marginBottom: "6%" }}>
                            <b style={{ color: "yellowgreen" }}>
                              Referral ID:{" "}
                            </b>
                            {ob.Referral_ID}
                          </div>
                          <div>
                            <b style={{ color: "yellowgreen" }}>
                              Request Date:{" "}
                            </b>
                            {/* {ob.Request_Date} */}
                            {formatDate(
                              id &&
                                ob.History.filter(
                                  (obj) => obj.Employee_ID === id
                                )[0]?.Employee_Request_Date
                            ) || "Not Available"}
                          </div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-12 col-sm-3 col-md-3">
                          <div style={{ marginBottom: "4%" }}>
                            <button
                              className="bg-warning text-dark"
                              style={{ borderRadius: "10px", border: "none" }}
                              onClick={() => {
                                window.open(ob.Job_Portal_Url, "_blank");
                                // window.location.href = `${ob.Job_Portal_Url}`;
                              }}
                            >
                              Job-URL
                            </button>
                          </div>
                          <div>{ob.Position}</div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-6 col-sm-3 col-md-3">
                          <div style={{ marginBottom: "4.8%" }}>
                            <button
                              className="bg-info text-dark"
                              style={{ borderRadius: "10px", border: "none" }}
                              onClick={() => {
                                viewResume(ob.Applicant_ID);
                              }}
                            >
                              Resume
                            </button>
                          </div>
                          <div>{ob.Company_Name}</div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-6 col-sm-3 col-md-3">
                          <div style={{ marginBottom: "4%" }}>
                            <button
                              onClick={() => {
                                fetchAccept(ob.Referral_ID);
                              }}
                              disabled={loading}
                              className="bg-success text-light"
                              style={{ borderRadius: "10px", border: "none" }}
                            >
                              {loading ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              ) : msg ? (
                                <div>
                                  <p>{msg}</p>
                                </div>
                              ) : null}
                              Accept
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => {
                                fetchReject(ob.Referral_ID);
                              }}
                              disabled={loadingReject}
                              className="bg-danger text-light"
                              style={{ borderRadius: "10px", border: "none" }}
                            >
                              {loadingReject ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              ) : msg ? (
                                <div>
                                  <p>{msg}</p>
                                </div>
                              ) : null}
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}

              {/* --------------pastRequest Data-------------- */}
              <h3
                style={{
                  color: "peachpuff",
                  marginBottom: "1%",
                  marginTop: "1%",
                }}
              >
                Historical Requests
              </h3>
              {pastRequest.length === 0 ? (
                <p className="text-light">No Historical Requests Yet</p>
              ) : (
                pastRequest.map((ob, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      index % 2 === 0
                        ? "bg-dark-blue text-light"
                        : "bg-light-blue text-light"
                    }`}
                  >
                    <div className="container">
                      <div className="row">
                        {/* ---------------------------------------------- */}

                        <div className="col-md-4 mb-1 mb-md-0">
                          <div style={{ margin: "2%" }}>
                            <b style={{ color: "yellowgreen" }}>
                              Referral ID:{" "}
                            </b>
                            {ob.Referral_ID}
                          </div>
                          <div>
                            <b style={{ color: "yellowgreen" }}>
                              Request Date:{" "}
                            </b>
                            {formatDate(
                              id &&
                                ob.History.filter(
                                  (obj) => obj.Employee_ID === id
                                )[0]?.Employee_Request_Date
                            ) || "Not Available"}
                          </div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-md-4 mb-md-0">
                          <div style={{ margin: "2%" }}>{ob.Company_Name}</div>
                          <div>{ob.Position}</div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-md-4 mb-md-0">
                          <button
                            className={`text-light ${
                              (id &&
                                ob.History.filter(
                                  (obj) => obj.Employee_ID === id
                                )[0]?.Result) === "Not Referred"
                                ? "bg-warning text-dark"
                                : ob.result === "Referred"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                            style={{
                              borderRadius: "10px",
                              border: "none",
                              margin: "6%",
                            }}
                          >
                            {(id &&
                              ob.History.filter(
                                (obj) => obj.Employee_ID === id
                              )[0]?.Result) ||
                              "Not Available"}
                            {/* {ob.result} */}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Received;
