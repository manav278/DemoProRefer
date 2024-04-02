import React from "react";
import { ReactTyped } from "react-typed";
import MainNav from "./MainNav";
import img1 from "./assets/Testimonials-1.png";
import img2 from "./assets/Testimonials-2.png";
import img3 from "./assets/Testimonials-3.png";
import Footer from "./Footer";
export default function Testimonials() {
  return (
    <div>
      <MainNav></MainNav>
      <div class="container px-4 text-center">
        <div class="row gx-2">
          <div class="col-12">
            <div class="p-4 text-white">
              <h2>
                <ReactTyped
                  strings={[
                    "Real Stories, Real Results: Hear It Straight From Our Community",
                    "Discover Genuine Insights: Stories Shared by Our Community",
                    "Uncover Impactful Journeys: Insights from Our Community",
                  ]}
                  typeSpeed={30}
                  backSpeed={30}
                  loop
                />
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="container text-center" style={{ marginBottom: "6%" }}>
        <div class="row g-4">
          <div class="col-md-4 col-12">
            <div
              class="p-3 bg-light"
              style={{ height: "100%", borderRadius: "10px" }}
            >
              <div className="row">
                <div className="col-12" style={{ marginBottom: "3%" }}>
                  <img
                    src={img1}
                    alt="Meera Krishnan"
                    height="90vh"
                    width="80vw"
                    style={{ borderRadius: "50%" }}
                  ></img>
                </div>
                <div className="col-12">
                  <p>
                    "This app exceeded all my expectations. Its intuitive
                    interface and unbeatable rewards make it stand out. Both
                    referrer and referee benefit, creating a win-win scenario.
                    I've earned great rewards simply by referring friends".
                  </p>
                </div>
                <div
                  className="col-12"
                  style={{ marginTop: "-2.5%", marginBottom: "2%" }}
                >
                  <button
                    className="bg-primary"
                    style={{
                      width: "15%",
                      height: "15%",
                      border: "none",
                      pointerEvents: "none",
                    }}
                  ></button>
                </div>
                <div className="col-12">
                  <h5>MEERA KRISHNAN</h5>
                  <p>CTO at NovaByte Technologies.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div
              class="p-3 bg-light"
              style={{ height: "100%", borderRadius: "10px" }}
            >
              <div className="row">
                <div className="col-12" style={{ marginBottom: "3%" }}>
                  <img
                    src={img2}
                    alt="Juan Torres"
                    height="90vh"
                    width="80vw"
                    style={{ borderRadius: "50%" }}
                  ></img>
                </div>
                <div className="col-12">
                  <p>
                    "The referral app revolutionized my business growth
                    strategy. Its streamlined process simplifies customer
                    referrals, boosting sales effectively. The built-in
                    analytics provide valuable insights, enhancing marketing
                    strategies."
                  </p>
                </div>
                <div
                  className="col-12"
                  style={{ marginTop: "-2.5%", marginBottom: "2%" }}
                >
                  <button
                    className="bg-primary"
                    style={{
                      width: "15%",
                      height: "15%",
                      border: "none",
                      pointerEvents: "none",
                    }}
                  ></button>
                </div>
                <div className="col-12">
                  <h5>JUAN TORRES</h5>
                  <p>CMO at CyberVista Systems.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div
              class="p-3 bg-light"
              style={{ height: "100%", borderRadius: "10px" }}
            >
              <div className="row">
                <div className="col-12" style={{ marginBottom: "3%" }}>
                  <img
                    src={img3}
                    alt="Sophie Boucher"
                    height="90vh"
                    width="80vw"
                    style={{ borderRadius: "50%" }}
                  ></img>
                </div>
                <div className="col-12">
                  <p>
                    "The referral app amazed me with its user-friendly interface
                    and fantastic rewards! I've referred many friends, all with
                    positive experiences. Highly recommended for anyone seeking
                    effortless referral rewards and a seamless experience!"
                  </p>
                </div>
                <div
                  className="col-12"
                  style={{ marginTop: "-2.5%", marginBottom: "2%" }}
                >
                  <button
                    className="bg-primary"
                    style={{
                      width: "15%",
                      height: "15%",
                      border: "none",
                      pointerEvents: "none",
                    }}
                  ></button>
                </div>
                <div className="col-12">
                  <h5>SOPHIE BOUCHER</h5>
                  <p>Director of Data Science at Digital Nexus Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
