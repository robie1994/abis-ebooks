import abisLogo from "../assets/images/abis-logo.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState();

  const [userData, setUserData] = useState([]);
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
          </tr>
          <tr>
          <td colSpan={2} className="header-nav">
              <div className="topnav">
                <a href="/">Home</a>
                {isLoggedIn ? <a href="/e-books">E-BOOKS</a> : null}
                {isLoggedIn ? <a href={isAdmin ? '/admin-dashboard' : '/student-dashboard'}>DASHBOARD</a> : <a href="/signup">REGISTER </a>}
                {isLoggedIn ? null : <a href="/login">LOGIN</a>}
                <a href="https://abis.depedmandaluyong.org/about" target="_blank">ABOUT US</a>
                <a href="https://abis.depedmandaluyong.org/contact-us" target="_blank">CONTACT US</a>
                {isLoggedIn ? <a href="/" onClick={() => { localStorage.setItem('userData', JSON.stringify([])); setIsLoggedIn(false) }}>LOGOUT</a> : null}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Header;
