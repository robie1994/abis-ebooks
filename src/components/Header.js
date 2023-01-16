import abisLogo from "../assets/images/abis-logo.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from "react";

const Header = () => {
  const [userData, setUserData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data) {
      setUserData(data);
      if (data.StudID || data.username) {
        setIsLoggedIn(true);
      }
    }

    checkIfAdmin();
  }, []);

  const checkIfAdmin = () => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data) {
      if (data.username) {
        setIsAdmin(true)
      }
      else {
        setIsAdmin(false)
      }
    }
  }

  return (
    <div className="appHeader">
      <table className="table-logo-header">
        <tbody>
          <tr>
            <td className="appHeaderLogo">
              <img src={abisLogo} alt="" />
            </td>
            <td className="appHeaderText">
              <p>
                Andres Bonifacio Integrated School
              </p>
            </td>
            <td>
              <Navbar expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="/">HOME</Nav.Link>
                    {isLoggedIn ? <Nav.Link href={isAdmin ? '/admin-dashboard' : '/student-dashboard'}>DASHBOARD</Nav.Link> : <Nav.Link href="/signup">REGISTER </Nav.Link>}
                    {isLoggedIn ? null : <Nav.Link href="/login">LOGIN</Nav.Link>}

                    {isLoggedIn ? <Nav.Link href="/" onClick={() => { localStorage.setItem('userData', JSON.stringify([])); setIsLoggedIn(false) }}>LOGOUT</Nav.Link> : null}
                    <Nav.Link href="https://abis.depedmandaluyong.org/about" target="_blank">About Us</Nav.Link>
                    <Nav.Link href="https://abis.depedmandaluyong.org/contact-us" target="_blank">Contact Us</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Header;
