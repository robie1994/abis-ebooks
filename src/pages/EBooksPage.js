import Modal from "react-bootstrap/Modal";
import femaleDP from "../assets/images/female-dp.png";
import maleDP from "../assets/images/male-dp.png";
import eBookIcon from "../assets/images/ebook-icon.jpg";
import pendingRequest from "../assets/images/stdnt-pending.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';

const EBooksPage = () => {
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
            if (storageData.StudID !== student.StudID) {
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
    if (otherStudents.includes(e.target.value.toLowerCase())) {
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
    let month = newDate.getMonth() + 1;
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
          if (due < today) {
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
        if (res.data === "Current Password Matched") {
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
    <div className="e-books-page">
      <div className="search-ebook-wrapper">
        <input type="text" placeholder="Search e-book..." /><FaSearch />
      </div>

      <div className="ebooks-wrapper">
        <table className="ebooks-table">
          <tbody>
            <tr>
              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                  <img src={eBookIcon} alt="" />
                  <br /><br />
                  Title: Lorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>

              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                  <img src="https://www.pdfbooksworld.com/image/cache/catalog/50-150x180.jpg" alt="" 
                  onClick={() => window.open('https://www.pdfbooksworld.com/bibi/pre.html?book=50.epub','_blank')} />
                  <br /><br />
                  Title: Lorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>
              
              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                <img src="https://www.pdfbooksworld.com/image/cache/catalog/51-150x180.jpg" alt="" 
                  onClick={() => window.open('https://www.pdfbooksworld.com/bibi/pre.html?book=51.epub','_blank')} />                  <br /><br />
                  Title: Lorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>

              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                  <img src={eBookIcon} alt="" />
                  <br /><br />
                  Title: Lorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>

              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                  <img src={eBookIcon} alt="" />
                  <br /><br />
                  Title: Lorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>

              <td className="ebook-td">
                <div className="individual-ebook-wrapper">
                  <img src={eBookIcon} alt="" />
                  <br /><br />
                  Title: Lorem Ipsum<br />
                  Author: Lorem Ipsum
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div >
  );
};

export default EBooksPage;
