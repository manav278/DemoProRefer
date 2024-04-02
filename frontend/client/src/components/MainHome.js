import React, { useState, useEffect } from "react";
import MainNav from "./MainNav";
import Hom1 from "./assets/Hom1.jpg";
import Hom2 from "./assets/Hom2.jpg";
import Hom3 from "./assets/Hom3.jpg";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";
import Footer from "./Footer";
import Loader from "./Loader";
import "../App.css";
const MainHome = () => {
  const [counterOn, setCounterOn] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  useEffect(()=>{
    setTimeout(()=>{
      setIsloading(false);
    },1200)
  },[])
  return (
    <div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <MainNav />
          <div style={{ marginTop: "3%", marginBottom: "3%" }}>
            <h1 style={{ textAlign: "center" }} className="text-light">
              How does ProRefer work?
            </h1>
          </div>
          <div class="container text-center text-light">
            <div class="row g-2 ">
              <div class="col-12 col-md-6 order-md-first order-2 ">
                <div
                  class="home-div"
                  style={{ height: "45vh", textAlign: "center" }}
                >
                  <h2 className="text-primary">The basics for a new user</h2>
                  <p style={{ fontSize: "120%" }}>
                    As a new user, you can get started with ProRefer by
                    submitting referral requests. Once submitted, our employees
                    will review the resumes and either accept or reject the
                    referral requests. You can track the status of your requests
                    in the referral history section of your account!
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-6 order-md-2 order-first">
                <div class="">
                  <img src={Hom1} alt="1-ProRefer" width="62.4%" height="48%" />
                  {/* 520:406 */}
                </div>
              </div>
              <div class="col-12 col-md-6 order-md-3 order-3">
                <div class="">
                  <img src={Hom2} alt="1-ProRefer" width="54%" height="48%" />
                  {/* 530:471 */}
                </div>
              </div>
              <div class="col-12 col-md-6 order-md-4 order-4">
                <div
                  class=" home-div"
                  style={{ height: "45vh", textAlign: "center" }}
                >
                  <h2 className="text-primary">
                    ProRefer and the referral process
                  </h2>
                  <p style={{ fontSize: "120%" }}>
                    ProRefer is the platform that connects referral seekers with
                    employees. Our referral process is efficient, transparent,
                    and reliable. It's a place for users to find the right job
                    opportunities through employee referrals.
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-6 order-md-5 order-last">
                <div
                  class="home-div"
                  style={{ height: "45vh", textAlign: "center" }}
                >
                  <h2 className="text-primary">
                    Revolutionize your job search
                  </h2>
                  <p style={{ fontSize: "120%" }}>
                    ProRefer enables organizations to streamline their referral
                    process, making it easier for employees to refer candidates
                    and for referral seekers to find job opportunities. Join
                    ProRefer today and revolutionize your job search!
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-6 order-md-last order-5">
                <div class="">
                  <img src={Hom3} alt="1-ProRefer" width="59%" height="48%" />
                  {/* 390:317 */}
                </div>
              </div>
            </div>
          </div>
          <ScrollTrigger
            onEnter={() => setCounterOn(true)}
            onExit={() => setCounterOn(false)}
          >
            <div className="container" style={{ marginBottom: "-2%" }}>
              <div className="row justify-content-around" style={{ height: "25vh", width: "100%" }}>
                <div className="col-4 home-numbers" style={{borderRight: "2px solid white"}}>
                  <h2 className="text-primary">
                    {counterOn && (
                      <CountUp start={0} end={10000} duration={1.5} delay={0} />
                    )}
                    +
                  </h2>
                  <p className="text-light">Referrals</p>
                </div>
                <div className="col-4 home-numbers" style={{borderRight: "2px solid white"}}>
                  <h2 className="text-primary">
                    {counterOn && (
                      <CountUp start={0} end={500} duration={1.5} delay={0} />
                    )}
                    +
                  </h2>
                  <p className="text-light">Companies</p>
                </div>
                <div className="col-4 home-numbers">
                  <h2 className="text-primary">
                    {counterOn && (
                      <CountUp start={0} end={5000} duration={1.5} delay={0} />
                    )}
                    +
                  </h2>
                  <p className="text-light">Employees</p>
                </div>
              </div>
            </div>
          </ScrollTrigger>
          <Footer></Footer>
        </>
      )}
    </div>
  );
};

export default MainHome;
