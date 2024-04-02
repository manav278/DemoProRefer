import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Company = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = () => {
    if (searchTerm !== "") {
      setCompanyList(
        storedData.filter((item) =>
          item.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setCompanyList(storedData);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    handleChange();
  }, [searchTerm]);

  const apiCall = async () => {
    try {
      await axios.get("http://localhost:3003/api/getCompany").then((res) => {
        setCompanyList(res.data);
        setStoredData(res.data);
        setLoading(false);
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
      });
    } catch (e) {
      console.log("Error occured: ", e);
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  return (
    <div>
      <input
        className="p-2 mt-2 mb-4"
        style={{ color: "black", border: "none", borderRadius: "5px" }}
        type="text"
        id="search"
        placeholder="Search company"
        onChange={handleSearchChange}
      />
      <div className="container">
        <div className="row">
          {loading ? (
            <p>Loading</p>
          ) : (
            <div style={{display:"grid",placeContent:"center",}}>
            <div
              className="scrollable-list"
              style={{overflowY: "scroll",width:"50vw",placeItems:"center",maxHeight:"28.2em"}}
            >
              <ul className="list-group">
                {companyList
                  ? companyList.map((value, index) => (
                      <li
                        key={index}
                        className={`list-group-item ${
                          index % 2 === 0
                            ? "bg-dark-blue text-light"
                            : "bg-light-blue text-light"
                        }`}
                      >
                        {value.company}
                      </li>
                    ))
                  : "None"}
              </ul>
            </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Company;
