import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./assets/logo.png";
import MyContext from "../MyContext";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import "./mainnav.css";
function MainNav() {
  const { loggedIn, handleLogout } = useContext(MyContext);

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  function NavLink({ to, label, activeLink, onClick }) {
    return (
      <Nav.Link
        as={Link}
        to={to}
        className={`main-nav mx-1 my-2 ${
          activeLink === to ? "active-link" : ""
        }`}
        onClick={() => onClick(to)}
      >
        {label}
      </Nav.Link>
    );
  }

  return (
    <div>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        className="main-nav"
        style={{ fontSize: "larger" }}
      >
        <Container>
          <Navbar.Brand href="/">
            <img //aspect-ratio = 72:29.3
              src={logo}
              width="126vw"
              height="51.275vh"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink
                to="/"
                label="How it"
                activeLink={activeLink}
                onClick={handleLinkClick}
              />
              <NavLink
                to="/testimonials"
                label="Testimonials"
                activeLink={activeLink}
                onClick={handleLinkClick}
              />
              <NavLink
                to="/about"
                label="About Us"
                activeLink={activeLink}
                onClick={handleLinkClick}
              />
              <NavLink
                to="/contact"
                label="Contact"
                activeLink={activeLink}
                onClick={handleLinkClick}
              />
              <NavLink
                to="/dashboard"
                label="Dashboard"
                activeLink={activeLink}
                onClick={handleLinkClick}
              />
            </Nav>

            {loggedIn && (
              <Nav pullRight>
                <Nav.Link
                  className="main-nav mx-1 my-2 text-danger"
                  onClick={handleLogout}
                  href="/login"
                >
                  Logout
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr style={{ color: "white" }} />
    </div>
  );
}

export default MainNav;
// {
/* <Nav.Link className="main-nav mx-1 my-2" href="/">
                How it
              </Nav.Link>
              <Nav.Link className="main-nav mx-1 my-2" href="/testimonials">
                Testimonials
              </Nav.Link>
              <Nav.Link className="main-nav mx-1 my-2" href="/about">
                About Us
              </Nav.Link>
              <Nav.Link className="main-nav mx-1 my-2" href="/contact">
                Contact Us
              </Nav.Link>
              <Nav.Link className="main-nav mx-1 my-2" href="/dashboard">
                Dashboard
              </Nav.Link> */
// }
