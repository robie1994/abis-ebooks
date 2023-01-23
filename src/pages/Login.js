import { useState, useEffect } from "react";
import abisLogo from "../assets/images/abis-logo.png";
import captchaReload from "../assets/images/captcha-reload.png";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

const Login = () => {
  const [lrn, setLRN] = useState('');
  const [password, setPassword] = useState('');

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [loginMessageHeader, setLoginMessageHeader] = useState('');
  const [loginMessageBody, setLoginMessageBody] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState('');

  useEffect(() => {
    generateCaptcha(5);
  }, [])

  const login = () => {
    axios({
      url: "http://localhost/api-abis-ls/student-login.php",
      method: "POST",
      data:
      {
        "lrn": lrn,
        "password": password
      }
    })
      .then(res => {
        if (res.data.Lrn) {
          localStorage.setItem('userData', JSON.stringify(res.data));
          setTimeout(() => window.location.href = 'http://localhost:3000/student-dashboard', 500);
        }
        else{
          axios({
            url: "http://localhost/api-abis-ls/admin-login.php",
            method: "POST",
            data:
            {
              "username": lrn,
              "password": password
            }
          })
            .then(res => {
              if (res.data.username) {
                localStorage.setItem('userData', JSON.stringify(res.data));
                setTimeout(() => window.location.href = 'http://localhost:3000/admin-dashboard', 500);
              }
              else{
                localStorage.setItem('userData', JSON.stringify(''));
                setLoginMessageHeader('Login Failed! ')
                 setLoginMessageBody('Please check the username/password that you entered.')
                setShowLoginMessage(true)
              }
            })
            .catch(err => {
              alert(err);
            });
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const verifyCaptcha = (e) => {
    if (captchaCharacters === e.target.value) {
      setIsCaptchaVerified(true);
    }
    else {
      setIsCaptchaVerified(false);
    }
  }
  
  const [captchaCharacters, setCaptchaCharacters] = useState('');
  const generateCaptcha = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    setCaptchaCharacters(result.replaceAll(' ',''));
}
  return (
    <div className="login-page">
      <h3>SIGN IN</h3>
      <div className="login-form">
        <Form>
          <Row className="login-logo-row">
            <img className="login-logo" src={abisLogo} alt="" />
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Username:</Form.Label>
              <Form.Control required type="text" placeholder="Username" onChange={event => setLRN(event.target.value)} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Password:</Form.Label>
              <Form.Control required type="password" placeholder="Password" onChange={event => setPassword(event.target.value)} />
            </Form.Group>
          </Row>
          <br />

          <Row className="align-center">
            <Form.Group md="12">
              <Form.Label>
                <div className="captcha">
                  <table>
                    <tbody>
                      <tr>
                        <td className="captcha-code"><div>{captchaCharacters}</div></td>
                        <td className="captcha-reload"><div><img onClick={() => {generateCaptcha(5); setIsCaptchaVerified(false)}} src={captchaReload}/></div></td>
                      </tr>
                      <tr>
                        <td className="captcha-field-td" colSpan="2"><input className="captcha-textbox" type="text" placeholder="Enter captcha"
                        onChange={(e) => verifyCaptcha(e)}/></td>
                      </tr>
                    </tbody>
                  </table>
                </div></Form.Label>
            </Form.Group>
          </Row>

          <Row>
            {isCaptchaVerified ? (<Button className="loginBtn" as={Col} md="8" onClick={() => login()}>
              Log in
            </Button>) : (<button disabled className="loginBtn" as={Col} md="8" onClick={() => login()}>Log in</button>)}
          </Row>
          <br />
          <Row>
            <a className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
          </Row>
        </Form>
      </div>
      {/* LOGIN ALERT */}
      <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={showLoginMessage}
        onHide={() => setShowLoginMessage(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>{loginMessageHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <p>{loginMessageBody}</p>
        </Modal.Body>
      </Modal>

      <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>FORGOT PASSWORD?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <p>Please contact your administrator to reset your password.</p>
        </Modal.Body>
      </Modal>
      {/* END OF LOGIN ALERT */}
    </div>
  );
};

export default Login;
