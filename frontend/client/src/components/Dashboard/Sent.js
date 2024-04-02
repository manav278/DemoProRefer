import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sent = () => {
  const viewResume = async () => {
    try {
      const response = await axios.get("http://localhost:3003/api/getPdf", {
        responseType: "blob", // Use blob responseType to handle binary data
      });

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

  // -------------------------------------------------------

  const formatDate = (dateNumber) => {
    let dateString = dateNumber.toString(); // Convert number to string

    let year = dateString.substring(0, 4); // Extract year
    let month = dateString.substring(4, 6); // Extract month
    let day = dateString.substring(6, 8); // Extract day

    let formattedDate = `${year}/${month}/${day}`;
    // console.log(formattedDate);
    return formattedDate;
  };

  const [currentRequest, setCurrentRequest] = useState([]);
  const fetchCurrentSent = async () => {
    try {
      const response = await axios.get("http://localhost:3003/api/currentsent");
      console.log(response);
      const formattedData = response.data.map((obj) => {
        return {
          ...obj,
          Request_Date: formatDate(obj.Request_Date),
        };
      });
      console.log(formattedData);
      setCurrentRequest(formattedData);
    } catch (error) {
      console.error("Error fetching CurrentRequest Sent data:", error);
    }
  };
  useEffect(() => {
    fetchCurrentSent();
  }, []);

  // -------------------------------------------------------

  const [pastRequest, setPastRequest] = useState([]);
  const fetchHistoricalSent = async () => {
    try {
      const response = await axios.get("http://localhost:3003/api/historysent");
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
    fetchHistoricalSent();
  }, []);

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
                            {ob.Request_Date}
                          </div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-12 col-sm-3 col-md-3">
                          <div style={{ marginBottom: "4%" }}>
                            <button
                              onClick={() => {
                                window.open(ob.Job_Portal_Url, "_blank");
                              }}
                              className="bg-warning text-dark"
                              style={{ borderRadius: "10px", border: "none" }}
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
                              onClick={viewResume}
                            >
                              Resume
                            </button>
                          </div>
                          <div>{ob.Company_Name}</div>
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

                        <div className="col-4">
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
                            {ob.date}
                          </div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-4">
                          <div style={{ marginBottom: "2%" }}>
                            {ob.Company_Name}
                          </div>
                          <div>{ob.Position}</div>
                        </div>

                        {/* ---------------------------------------------- */}

                        <div className="col-4">
                          <button
                            className={`text-light ${
                              ob.result === "Not Referred"
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
                            {ob.result}
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
    </div>
  );
};

export default Sent;
