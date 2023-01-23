import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import signupImg from "../assets/images/abis-logo.png"

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [lrn, setLRN] = useState('');
  const [password, setPassword] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showSignupMessage, setShowSignupMessage] = useState(false);
  const [signupMessageHeader, setSignupMessageHeader] = useState('');
  const [signupMessageBody, setSignupMessageBody] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    checkIfFormIsComplete();
  })
  const checkIfFormIsComplete = () => {
    if (firstName.length && middleName.length && lastName.length && gender.length && address.length && city.length && gradeLevel.length && section.length && contactNumber.length && emailAddress.length && lrn.length && password.length) {
      setIsFormComplete(true);
    }
    else {
      setIsFormComplete(false);
    }
  }
  const registerStudent = () => {
    if (isFormComplete) {
      axios({
        url: "https://api-abis-ls.000webhostapp.com/student-create.php",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data:
        {
          "firstname": firstName,
          "middlename": middleName,
          "lastname": lastName,
          "lrn": lrn,
          "password": password,
          "city": city,
          "address": address,
          "gender": gender,
          "gradelevel": gradeLevel,
          "email": emailAddress,
          "section": section,
          "contact": contactNumber,
        }
      })
        .then(res => {
          if (res.data.status) {
            setSignupMessageHeader('Successfully Registered!')
            setSignupMessageBody('You will be redirected to the login page in a moment ...')
            setShowSignupMessage(true)
            setTimeout(() => navigate('/login'), 3000);
          }
          else {
            setSignupMessageHeader('Error signing up!')
            setSignupMessageBody('The LRN you are trying to register is already used. Please contact administrator.')
            setShowSignupMessage(true)
          }
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
      <div className="signup-form">
        <h3>REGISTER</h3>
        <table>
          <tbody>
            <tr>
              <td>First Name</td>
              <td><input className="signup-textbox" type="text" placeholder="First Name" onChange={event => setFirstName(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Middle Name</td>
              <td><input className="signup-textbox" type="text" placeholder="Middle Name" onChange={event => setMiddleName(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td><input className="signup-textbox" type="text" placeholder="Last Name" onChange={event => setLastName(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>
                <select className="signup-dropdown" onChange={event => setGender(event.target.value)}>
                  <option defaultValue={null}>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
            </tr>

            <tr>
              <td>&nbsp;</td>
            </tr>

            <tr>
              <td>Contact Number</td>
              <td><input className="signup-textbox" type="text" placeholder="Contact Number" onChange={event => setContactNumber(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td><input className="signup-textbox" type="text" placeholder="Email Address" onChange={event => setEmailAddress(event.target.value)} /></td>
            </tr>

            <tr>
              <td>&nbsp;</td>
            </tr>

            <tr>
              <td>Address</td>
              <td><input className="signup-textbox" type="text" placeholder="Address" onChange={event => setAddress(event.target.value)} /></td>
            </tr>
            <tr>
              <td>City</td>
              <td><input className="signup-textbox" type="text" placeholder="City" onChange={event => setCity(event.target.value)} /></td>
            </tr>

            <tr>
              <td>&nbsp;</td>
            </tr>

            <tr>
              <td>Grade Level</td>
              <td>
                <select className="signup-dropdown" onChange={event => setGradeLevel(event.target.value)}>
                  <option defaultValue={null}>Grade Level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Section</td>
              <td><input className="signup-textbox" type="text" placeholder="Section" onChange={event => setSection(event.target.value)} /></td>
            </tr>

            <tr>
              <td>&nbsp;</td>
            </tr>

            <tr>
              <td>LRN</td>
              <td><input className="signup-textbox" type="text" placeholder="LRN" onChange={event => setLRN(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input className="signup-textbox" type="password" placeholder="Password" onChange={event => setPassword(event.target.value)} /></td>
            </tr>

            <tr>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td className="tdRegisterBtn" colSpan="2"><Button className="registerBtn" disabled={isFormComplete ? false : true} onClick={() => registerStudent()}>Register</Button></td>
            </tr>
          </tbody>
        </table>

      </div>
      </div>

      {/* SIGNUP ALERT */}
      <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={showSignupMessage}
        onHide={() => setShowSignupMessage(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>{signupMessageHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <p>{signupMessageBody}</p>
        </Modal.Body>
      </Modal>
      {/* END OF SIGNUP ALERT */}
    </div>
  );
};

export default Signup;
