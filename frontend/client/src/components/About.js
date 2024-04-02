import React from "react";
import MainNav from "./MainNav";
import About1 from "./assets/About1.png";
import About2 from "./assets/About2.png";
import Footer from "./Footer";
export default function About() {
  return (
    <div>
      <MainNav></MainNav>
      <h1 className="text-center text-light" style={{marginTop:"36px",marginBottom:"-1%"}}>The ProRefer Story</h1>
      <div class="container text-light">
        <div class="row text-center p-3 gx-5">
          <div class="col-md-6 col-12 order-md-first order-first" style={{display:'grid', placeContent:'center'}}>
            <img src={About1} alt="Aboutus" width="350vw" height="350vh"></img>
            {/* 1024:1024 */}
          </div>
          <div
            className="col-md-6 col-12 text-dark order-md-last order-last"
            style={{
              padding: "2%",
              borderRadius: "10px",
            }}
          >
            <div className="row">
              <div
                className="col-12 text-light my-1 p-3"
                style={{ borderRadius: "8px" }}
              >
                <h2 className="text-center text-primary">Mission</h2>
                <p style={{fontSize: '120%'}}>
                  Our mission at ProRefer is to bridge the gap between job
                  seekers and potential employers by facilitating the referral
                  process. We believe that personal recommendations are a
                  powerful tool in finding the right job, and we strive to make
                  this process easier and more efficient for everyone involved.
                </p>
              </div>
              <div
                className="col-12 text-light my-1 p-3"
                style={{ borderRadius: "8px" }}
              >
                <h2 className="text-center text-primary">Company Story</h2>
                <p style={{fontSize: '120%'}}>
                  ProRefer was founded in 2024 by a group of professionals who
                  saw a need for a platform that could connect job seekers with
                  potential referrals. Since then, we have grown to become a
                  trusted resource for both job seekers and employers, helping
                  thousands of people find their dream jobs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container text-light">
        <div class="row text-center gx-5" style={{marginBottom:"3%"}}>
          <div
            className="col-md-6 col-12 text-dark order-md-first order-last"
            style={{
              padding: "2%",
              borderRadius: "10px",
            }}
          >
            <div className="row">
              <div
                className="col-12 text-light my-1 p-3"
                style={{ borderRadius: "8px" }}
              >
                <h2 className="text-center text-primary">Values</h2>
                <p style={{fontSize: '120%'}}>
                  At ProRefer, we are guided by a set of core values that shape
                  everything we do. These values include integrity,
                  transparency, and inclusivity, and they drive our commitment
                  to providing a fair and effective platform for job seekers and
                  employers alike.
                </p>
              </div>
              <div
                className="col-12 text-light my-1 p-3"
                style={{ borderRadius: "8px" }}
              >
                <h2 className="text-center text-primary">Benefits</h2>
                <p style={{fontSize: '120%'}}>
                  Joining ProRefer has many benefits. Job seekers can access
                  exclusive job listings and connect with potential employers,
                  while employees can earn rewards for referring qualified
                  candidates. Our platform streamlines the referral process,
                  making it easier than ever to find and fill open positions.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12 order-md-last order-first" style={{display:'grid', placeContent:'center'}}>
            <img src={About2} alt="Aboutus" width="350vw" height="350vh"></img>
            {/* 1024*1024 */}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
