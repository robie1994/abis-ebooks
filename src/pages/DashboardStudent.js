import Modal from "react-bootstrap/Modal";
import femaleDP from "../assets/images/female-dp.png";
import maleDP from "../assets/images/male-dp.png";
import borrowABook from "../assets/images/stdnt-borrow-a-book.png";
import pendingRequest from "../assets/images/stdnt-pending.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const DashboardStudent = () => {
  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [showPendingRequestModal, setShowPendingRequestModal] = useState(false);
  const [availableBookList, setAvailableBookList] = useState([]);
  const [studentCurrentBorrowedBooks, setStudentCurrentBorrowedBooks] = useState([]);
  const [studentPendingRequest, setStudentPendingRequest] = useState([]);
  const [userData, setUserData] = useState([]);
  const [toggleUpdateProfile, setToggleUpdateProfile] = useState(false);
  const [updateProfileMessage, setUpdateProfileMessage] = useState(false);
  const [showBorrowConfirmBox, setShowBorrowConfirmBox] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [validChangePassword, setValidChangePassword] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
  const [studentID, setStudentID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data && data.StudID) {
      setUserData(data);
    }
    else {
      navigate('/admin-dashboard')
    }
    getAvailableBooksList();
    getStudentPendingRequest();
    getStudentCurrentBorrowedBooks();
    getOtherStudents();
  }, []);
  
  const [otherStudents, setOtherStudents] = useState([]);
  const getOtherStudents = () => {
    const arr = [];
    const storageData = JSON.parse(localStorage.getItem('userData'));
    axios({
      url: "http://localhost/api-abis-ls/students.php",
      method: "get"
    })
      .then(res => {
        if (res.data.status === false) setOtherStudents([]);
        else {
          res.data.map((student) => {
            if(storageData.StudID !== student.StudID){
              arr.push(student.Lrn.toLowerCase())
          }
          })
        }
        setOtherStudents(arr);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const [lrnValidationError, setLrnValidationError] = useState(false);
  const verifyLRN = (e) => {
    if(otherStudents.includes(e.target.value.toLowerCase())){
      setLrnValidationError(true)
    }
    else setLrnValidationError(false);
  }

  const getAvailableBooksList = () => {
    axios({
      url: "http://localhost/api-abis-ls/available-books.php",
      method: "POST"
    })
      .then(res => {
        setAvailableBookList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [pastDueList, setPastDueList] = useState(false);
  const getStudentCurrentBorrowedBooks = () => {
    const data = JSON.parse(localStorage.getItem('userData'));
    let newDate = new Date()
    let month = newDate.getMonth()+1;
    let dateToday = newDate.getFullYear() + '-' + month + '-' + newDate.getDate();
    var arr = [];
    axios({
      url: "http://localhost/api-abis-ls/student-all-current-borrowed-books.php",
      method: "POST",
      data: {
        "id": data.StudID
      }
    })
      .then(res => {
        setStudentCurrentBorrowedBooks(res.data);
        res.data.map((data) => {
          let today = Date.parse(dateToday);
          let due = Date.parse(data.DueDate);
          if(due < today){
            arr.push(data)
          }
        })
        setPastDueList(arr);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getStudentPendingRequest = () => {
    const data = JSON.parse(localStorage.getItem('userData'));
    axios({
      url: "http://localhost/api-abis-ls/pending-requests-by-student.php",
      method: "POST",
      data:
      {
        "StudID": data.StudID
      }
    })
      .then(res => {
        setStudentPendingRequest(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const requestBook = (bookID) => {
    axios({
      url: "http://localhost/api-abis-ls/request-book.php",
      method: "POST",
      data: {
        "StudID": userData.StudID,
        "BookID": bookID
      }
    })
      .then(res => {
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  }
  const triggerUpdateProfile = () => {
    setToggleUpdateProfile(true)
    setFirstName(userData.FirstName)
    setMiddleName(userData.MiddleName)
    setLastName(userData.LastName)
    setGender(userData.Gender)
    setAddress(userData.Address)
    setCity(userData.City)
    setGradeLevel(userData.GradeLevel)
    setSection(userData.Section)
    setContactNumber(userData.ContactNumber)
    setEmailAddress(userData.Email)
    setLRN(userData.Lrn)
    setPassword(userData.Password)
    setStudentID(userData.StudID)
  }

  const saveUpdate = () => {
    axios({
      url: "http://localhost/api-abis-ls/student-update.php",
      method: "UPDATE",
      data: {
        "firstname": firstName,
        "middlename": middleName,
        "lastname": lastName,
        "gender": gender,
        "city": city,
        "address": address,
        "email": emailAddress,
        "gradelevel": gradeLevel,
        "section": section,
        "contact": contactNumber,
        "lrn": lrn,
        "id": studentID
      }
    })
      .then(res => {
        console.log(res);
        setToggleUpdateProfile(false)
        axios({
          url: "http://localhost/api-abis-ls/student-get-data.php",
          method: "POST",
          data:
          {
            "lrn": lrn,
          }
        })
          .then(res => {
            if (res.data.Lrn) {
              localStorage.setItem('userData', JSON.stringify(res.data));
              setUpdateProfileMessage(true);
              setTimeout(() => window.location.reload(), 1000);
            }
          })
          .catch(err => {
            alert(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }


const checkCurrentPassword = (e) => {
  axios({
    url: "http://localhost/api-abis-ls/student-check-current-password.php",
    method: "POST",
    data: {
      "lrn": userData.Lrn,
      "password": e.target.value
    }
  })
    .then(res => {
      if(res.data === "Current Password Matched") {
        setValidChangePassword(true);
        setPassword(e.target.value)
      }
      else setValidChangePassword(false);
    })
    .catch(err => {
      console.log(err);
    });
}

const changePassword = () => {
  axios({
    url: "http://localhost/api-abis-ls/student-change-password.php",
    method: "UPDATE",
    data: {
      "password": newPassword,
      "id": studentID
    }
  })
    .then(res => {
      setToggleUpdateProfile(false)
      axios({
        url: "http://localhost/api-abis-ls/student-get-data.php",
        method: "POST",
        data:
        {
          "lrn": lrn,
        }
      })
        .then(res => {
          if (res.data.Lrn) {
            localStorage.setItem('userData', JSON.stringify(res.data));
            setUpdateProfileMessage(true);
            setTimeout(() => window.location.reload(), 1000);
          }
        })
        .catch(err => {
          alert(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}
  return (
    <div className="stdnt-dashboard-page">
      <div className="stdnt-dashboard-form">
        <h3>STUDENT DASHBOARD</h3>
        <table className="stdnt-dashboard-wrapper">
          <tbody>
            <tr>
              <td className="div-user-profile">
                {!toggleUpdateProfile ? (
                  <Table className="table-user-profile" striped>
                    <thead>
                      <tr className="align-center">
                        <td colSpan="2">
                          <img className="img-userProfile" src={userData.Gender === 'Male' ? maleDP : femaleDP} alt="" />
                        </td>
                      </tr>
                      <tr className="align-center">
                        <th className="profile-td" colSpan="2"><div>{userData.FirstName + ' ' + userData.MiddleName + ' ' + userData.LastName}</div></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">Grade Level & Section:</td>
                        <td className="profile-td"><div>{'Grade ' + userData.GradeLevel + '-' + userData.Section}</div></td>
                      </tr>
                      <tr>
                        <td>Address:</td>
                        <td className="profile-td"><div>{userData.Address + ' ' + userData.City}</div></td>
                      </tr>
                      <tr>
                        <td>Contact Number:</td>
                        <td className="profile-td"><div>{userData.ContactNumber}</div></td>
                      </tr>
                      <tr>
                        <td>Email Address:</td>
                        <td className="profile-td"><div>{userData.Email}</div></td>
                      </tr>
                      <tr>
                        <td>Gender:</td>
                        <td className="profile-td"><div>{userData.Gender}</div></td>
                      </tr>
                      <tr>
                        <td>LRN:</td>
                        <td className="profile-td"><div>{userData.Lrn}</div></td>
                      </tr>
                      <tr className="align-center">
                        <td colSpan="2">
                          <Button onClick={() => triggerUpdateProfile()}>UPDATE PROFILE</Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>) : (
                  <Table className="table-user-profile" striped bordered hover>
                    <thead>
                      <tr className="align-center">
                        <td colSpan="2">
                          <img className="img-userProfile" src={userData.Gender === 'Male' ? maleDP : femaleDP} alt="" />
                        </td>
                      </tr>
                      <tr className="align-center">
                        <th colSpan="2">
                          <input type="text" value={firstName} className="update-user-med-fn" onChange={event => setFirstName(event.target.value)} />
                          <input type="text" value={middleName} className="update-user-med" onChange={event => setMiddleName(event.target.value)} />
                          <input type="text" value={lastName} className="update-user-med" onChange={event => setLastName(event.target.value)} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">Grade Level & Section:</td>
                        <td>
                          <select className="user-grade-level-dropdown" onChange={event => setGradeLevel(event.target.value)} >
                            <option defaultValue={userData.GradeLevel}>{userData.GradeLevel}</option>
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
                          <input type="text" className="update-user-med" value={section} onChange={event => setSection(event.target.value)} />
                        </td>
                      </tr>
                      <tr>
                        <td>Address:</td>
                        <td>
                          <input type="text" className="update-user-lg" value={address} onChange={event => setAddress(event.target.value)} />
                          <input type="text" value={city} onChange={event => setCity(event.target.value)} />
                        </td>
                      </tr>
                      <tr>
                        <td>Contact Number:</td>
                        <td><input type="text" className="update-user-lg" value={contactNumber} onChange={event => setContactNumber(event.target.value)} /></td>
                      </tr>
                      <tr>
                        <td>Email Address:</td>
                        <td><input type="text" className="update-user-lg" value={emailAddress} onChange={event => setEmailAddress(event.target.value)} /></td>
                      </tr>
                      <tr>
                        <td>Gender:</td>
                        <td><select onChange={event => setGender(event.target.value)}>
                          <option defaultValue={userData.Gender === 'Male' ? 'Male' : 'Female'}>{userData.Gender}</option>
                          <option value={userData.Gender === 'Male' ? 'Female' : 'Male'}>{userData.Gender === 'Male' ? 'Female' : 'Male'}</option>
                        </select>
                        </td>
                      </tr>
                      <tr>
                        <td>LRN:</td>
                        <td>
                          <input type="text" className="update-user-lg" value={lrn} onChange={event => {setLRN(event.target.value); verifyLRN(event)}} />
                          {lrnValidationError ? <p className="update-profile-validation">The LRN you entered is already used.</p> : null}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="align-center"><Button className="align-center" onClick={() => setShowChangePassword(true)}>CHANGE PASSWORD</Button></td>
                      </tr>
                      <tr className="align-center">
                        <td colSpan="2">
                          <Button className="update-profile-btn" disabled={lrnValidationError ? true : false} onClick={saveUpdate}>SAVE</Button>
                          <Button className="update-profile-btn" onClick={() => setToggleUpdateProfile(false)}>CANCEL</Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <Modal
        show={showRequestBookModal}
        onHide={() => setShowRequestBookModal(false)}
        contentClassName="request-borrow-book-modal"
        dialogClassName="request-borrow-book-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Request to borrow book/s</Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Table className="request-borrow-book-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th colSpan="4">LIST OF AVAILABLE BOOKS</th>
              </tr>
              <tr className="align-center">
                <th className="request-borrow-bookname">BOOK NAME</th>
                <th className="request-borrow-bookauthor">AUTHOR</th>
                <th className="request-borrow-bookcategory">CATEGORY</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {availableBookList.length ? availableBookList.map(book => (
                <tr key={book.BookID}>
                  <td>{book.BookName}</td>
                  <td>{book.Author}</td>
                  <td>{book.BookCategory}</td>
                  <td>
                    <Button className="request-borrow-book-btn" onClick={() => { setShowBorrowConfirmBox(true); setSelectedBook(book.BookID) }}>
                      REQUEST
                    </Button>
                  </td>
                </tr>
              )) :
                <tr>
                  <td className="align-center" colSpan="4">No available books as of the moment...</td>
                </tr>}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showPendingRequestModal}
        onHide={() => setShowPendingRequestModal(false)}
        contentClassName="request-borrow-book-modal"
        dialogClassName="request-borrow-book-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Table className="request-borrow-book-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th colSpan="4">PENDING REQUEST/S</th>
              </tr>
              <tr className="align-center">
                <th className="request-borrow-bookname">BOOK NAME</th>
                <th className="request-borrow-bookauthor">AUTHOR</th>
                <th className="request-borrow-bookcategory">CATEGORY</th>
                <th className="pending-request-status"> </th>
              </tr>
            </thead>
            <tbody>
              {studentPendingRequest.length ? studentPendingRequest.map((request) => (
                <tr key={request.BookID}>
                  <td>{request.BookName}</td>
                  <td>{request.Author}</td>
                  <td>{request.BookCategory}</td>
                  <td>IN PROCESS</td>
                </tr>
              )) : null}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* UPDATE ALERT */}
      <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={updateProfileMessage}
        onHide={() => setUpdateProfileMessage(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>All set!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <p>Profile Successfully Updated!</p>
        </Modal.Body>
      </Modal>
      {/* END OF UPDATE ALERT */}

      {/* REQUEST TO BORROW BOOK CONFIRMATION */}
      <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={showBorrowConfirmBox}
        onHide={() => setShowBorrowConfirmBox(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>Request to borrow a book</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <p>Are you sure you want to borrow this book?</p>
          <Button className="borrow-confirmBtn" onClick={() => requestBook(selectedBook)}>YES</Button>
          <Button className="borrow-confirmBtn" onClick={() => setShowBorrowConfirmBox(false)}>CANCEL</Button>
        </Modal.Body>
      </Modal>
      {/* END OF REQUEST TO BORROW BOOK CONFIRMATION */}

       {/* REQUEST TO BORROW BOOK CONFIRMATION */}
       <Modal
        contentClassName="signup-modal-message"
        dialogClassName="signup-modal-message"
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      >
        <Modal.Header className="signup-modal-header" closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="signup-modal-body">
          <table>
            <tbody>
              <tr>
                <td><input type="text" className="text-changepassword" onChange={(e)=> {checkCurrentPassword(e)}} placeholder="Enter Old Password"/></td>
                <td className="text-changepassword-error">{validChangePassword ? ' ' : "Current Password is invalid"}</td>
              </tr>

              <tr>
                <td colSpan="2"><input type="text" className="text-changepassword" onChange={event => setNewPassword(event.target.value)} placeholder="Enter New Password"/></td>
              </tr>
            </tbody>
          </table>
          <Button className="borrow-confirmBtn" disabled={validChangePassword ? false : true} onClick={() => changePassword()}>SAVE</Button>
          <Button className="borrow-confirmBtn" onClick={() => setShowChangePassword(false)}>CANCEL</Button>
        </Modal.Body>
      </Modal>
      {/* END OF REQUEST TO BORROW BOOK CONFIRMATION */}

      {/* END OF MODALS */}
    </div >
  );
};

export default DashboardStudent;
