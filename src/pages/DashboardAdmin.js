import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import addEbook from "../assets/images/add-book.png";
import booksReadIon from "../assets/images/books-read-icon.png";
import registeredStudentsIcon from "../assets/images/students-list.png";
import eBooksRecordIcon from "../assets/images/books-list-icon.png";
import pending from "../assets/images/pending.png";
import studentsList from "../assets/images/student-list.png";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { FaRegEdit, FaTrashAlt, FaCheck, FaWindowClose } from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { NavItem } from "react-bootstrap";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const DashboardAdmin = () => {
  const [showManageBookRequest, setShowManageBookRequest] = useState(false);
  const [showBooksManagement, setShowBooksManagement] = useState(false);
  const [showRegisteredStudents, setShowRegisteredStudents] = useState(false);
  const [showDashboardContent, setShowDashboardContent] = useState(false);
  const [showPendingBookRequest, setShowPendingBookRequest] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [allBookList, setAllBookList] = useState([]);
  const [tempBook, setTempBook] = useState({});
  const navigate = useNavigate();

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Monthly Transaction and Registration of Student"
      }
    }
  };
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Registration of Students per month",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "Transactions per Month",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774"
      }
    ]
  });

  const getReports = () => {
    let transactions = [];
    let students = [];
    let labels = [];
    axios({
      url: "https://api-abis-ls.000webhostapp.com/transaction-reports.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        transactions = res.data;
        var dates = res.data.map(values => {
          return values["DATE_FORMAT(transactionDateTime, '%M %Y')"];
        });
        let tempData = { ...data };
        tempData.labels = tempData.labels.concat(dates);
        setData(tempData);
      })
      .catch(err => {
        console.log(err);
      });
    axios({
      url: "https://api-abis-ls.000webhostapp.com/student-reports.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        var dates = res.data.map(values => {
          return values["DATE_FORMAT(Created, '%M %Y')"];
        });
        students = res.data;
        let tempData = { ...data };

        tempData.labels = tempData.labels.concat(dates);
        labels = tempData.labels;

        var transactionPerMonth = [];
        var studentPerMonth = [];
        labels.map((values) => {
          transactionPerMonth.push(
            transactions.find(
              x => x["DATE_FORMAT(transactionDateTime, '%M %Y')"] === values
            )
              ? transactions.find(
                x => x["DATE_FORMAT(transactionDateTime, '%M %Y')"] === values
              ).count
              : 0
          );

          studentPerMonth.push(
            students.find(x => x["DATE_FORMAT(Created, '%M %Y')"] === values)
              ? students.find(x => x["DATE_FORMAT(Created, '%M %Y')"] === values)
                .count
              : 0
          );
        });
        tempData.datasets[0].data = studentPerMonth;
        tempData.datasets[1].data = transactionPerMonth;
        setData(tempData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getAllBooks = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/ebooks.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllBookList([]);
        else { setAllBookList(res.data); setFilteredAllBookList(res.data); }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [allPending, setAllPending] = useState([]);
  const getAllPending = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/pending-requests.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllPending([]);
        else setAllPending(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [allApproved, setAllApproved] = useState([]);
  const getAllApproved = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/approved-requests.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllApproved([]);
        else setAllApproved(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [allReturned, setAllReturned] = useState([]);
  const getAllReturned = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/returned-requests.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllReturned([]);
        else setAllReturned(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [allStudents, setAllStudents] = useState([]);
  const getAllStudents = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/students.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllStudents([]);
        else setAllStudents(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [allLogs, setAllLogs] = useState([]);
  const getAllLogs = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/ebooks-get-all-reading-logs.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setAllLogs([]);
        else setAllLogs(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [topFiveLogs, setTopFiveLogs] = useState([]);
  const getTopFiveLogs = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/ebooks-get-reading-logs.php",
      method: "get",
      headers: {"Content-Type": "application/json"}
    })
      .then(res => {
        if (res.data.status === false) setTopFiveLogs([]);
        else setTopFiveLogs(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    checkIfAdmin();
    getAllBooks();
    getAllPending();
    getAllStudents();
    getAllApproved();
    getAllReturned();
    getReports();
    getAllLogs();
    getTopFiveLogs();
  }, []);

  const checkIfAdmin = () => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (!data.username) {
      navigate('/student-dashboard')
    }
  }
  const updateBook = id => {
    let book = allBookList.find(x => x.EbookID === id);
    if (window.confirm("Do you really want to update book : " + id + "?")) {
      axios
        .post("https://api-abis-ls.000webhostapp.com/ebook-update.php", {
          id,
          ebookname: book.EbookName,
          ebookurl: book.EbookUrl,
          imageurl: book.EbookImageUrl
        },{headers: {"Content-Type": "application/json"}})
        .then(() => {
          getAllBooks();
        });
    }
  };
  const createBook = book => {
    if (window.confirm("Do you really want to create book : ?")) {
      axios
        .post("https://api-abis-ls.000webhostapp.com/ebook-create.php", {
          ebookname: book.EbookName,
          ebookurl: book.EbookUrl,
          imageurl: book.EbookImageUrl
        },
        {headers: {"Content-Type": "application/json"}})
        .then(() => {
          getAllBooks();
        });
    }
  };
  const deleteBook = id => {
    if (
      window.confirm("Do you really want to delete this book : " + id + "?")
    ) {
      axios
        .post("https://api-abis-ls.000webhostapp.com/ebook-delete.php", {
          id
        },
        {headers: {"Content-Type": "application/json"}})
        .then(() => {
          getAllBooks();
        });
    }
  };
  // ALL SEARCH FILTER FUNCTIONS

  // === FILTER ALL BOOKS === 
  const [filteredAllBookList, setFilteredAllBookList] = useState(allBookList);
  const filterAllBooks = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allBookList.map((books) => {
        const bookName = books.EbookName.toLowerCase();
        if (bookName.includes(e.target.value.toLowerCase())) {
          arr.push(books)
        }
        setFilteredAllBookList(arr);
      })
    }
    else {
      setFilteredAllBookList(allBookList);
    }
  }

  // === FILTER REGISTERED STUDENTS === 
  const [filteredStudentList, setFilteredStudentList] = useState(allStudents);
  const filterAllStudents = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allStudents.map((student) => {
        const studLastName = student.LastName.toLowerCase();
        if (studLastName.includes(e.target.value.toLowerCase())) {
          arr.push(student)
        }
        setFilteredStudentList(arr);
      })
    }
    else {
      setFilteredStudentList(allStudents);
    }
  }


  const [selectedStudent, setSelectedStudent] = useState();
  const [showResetPasswordSuccessfull, setShowResetPasswordSuccessfull] = useState();
  // RESET PASSWORD

  const resetPassword = () => {
    axios({
      url: "https://api-abis-ls.000webhostapp.com/student-change-password.php",
      method: "UPDATE",
      headers: {"Content-Type": "application/json"},
      data: {
        "password": selectedStudent.LastName.toLowerCase() + '_' + selectedStudent.Lrn,
        "id": selectedStudent.StudID
      }
    }).then(res => {
      setShowResetPassword(false)
      setShowResetPasswordSuccessfull(true);
      setTimeout(() => setShowResetPasswordSuccessfull(false), 10000)
    })
      .catch(err => {
        console.log(err);
      });
  }
  // END OF RESET PASSWORD
  return (
    <div className="admin-dashboard-page">
      <h3 className="align-center"><b>ADMIN DASHBOARD</b></h3>
      <div className="admin-dashboard-form">
        <table>
          <tbody>
            <tr>
              <td className="admin-dashboard-panel">
                <div className="admin-dashboard-panel-wrapper">
                  <table>
                    <thead>
                      <th className="loggedin-as-admin">Logged in as: Admin</th>
                    </thead>
                    <tbody>
                      <div className="button-wrapper">
                        <tr>
                          <td><Button className="admin-dashboard-main-btn" onClick={() => { setShowBooksManagement(false); setShowRegisteredStudents(false); setShowDashboardContent(true) }}>Dashboard</Button></td>
                        </tr>
                        <tr>
                          <td><br /><Button className="admin-dashboard-main-btn" onClick={() => { setShowBooksManagement(false); setShowDashboardContent(false); setShowRegisteredStudents(true); setFilteredStudentList(allStudents); }}>Registered Students</Button></td>
                        </tr>
                        <tr>
                          <td><br /><Button className="admin-dashboard-main-btn" onClick={() => { setShowRegisteredStudents(false); setShowDashboardContent(false); setShowBooksManagement(true); setFilteredAllBookList(allBookList) }}>Manage E-Books</Button><br /><br /><br /></td>
                        </tr>
                      </div>
                    </tbody>
                  </table>
                </div>
              </td>
              <td className="admin-dashboard-content">
                <div className="admin-dashboard-content-wrapper">
                  {showBooksManagement ?
                    /* ========================== START OF MANAGE E-BOOKS ========================== */
                    (<>
                      <Button
                        disabled={filteredAllBookList.length && filteredAllBookList[0].BookID === null}
                        variant="primary"
                        className="add-book"
                        onClick={() => {
                          let books = [...filteredAllBookList];
                          books.unshift({ EbookName: "", EbookUrl: "", EbookImageUrl: "", isEdit: true });
                          setFilteredAllBookList(books);
                        }}>
                        <img src={addEbook} className="add-ebook-img" /> Add E-Book
                      </Button>
                      <span className="adminDashboard-modalHeader-search-label">Search e-book</span>
                      <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter e-book title here ..." onChange={(e) => filterAllBooks(e)} /></span>
                      <Table className="manage-book-request-table" bordered hover>
                        <thead>
                          <tr className="align-center">
                            <th className="adminDashboard-bookId">BOOK ID</th>
                            <th className="adminDashboard-name">IMAGE URL</th>
                            <th className="request-borrow-name">E-BOOK NAME</th>
                            <th className="request-borrow-name">E-BOOK URL</th>
                            <th colSpan="2" className="pending-request-status">
                              ACTIONS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAllBookList.map(values => {
                            if (values.isEdit)
                              return (
                                <tr>
                                  <td>{values.EbookID}</td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Image URL"
                                      value={values.EbookImageUrl}
                                      onChange={e => {
                                        let books = [...filteredAllBookList];
                                        books.find(
                                          x => x.EbookID === values.EbookID
                                        ).EbookImageUrl = e.target.value;
                                        setFilteredAllBookList(books);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Book Title"
                                      value={values.EbookName}
                                      onChange={e => {
                                        let books = [...filteredAllBookList];
                                        books.find(x => x.EbookID === values.EbookID).EbookName =
                                          e.target.value;
                                        setFilteredAllBookList(books);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter E-Book URL"
                                      value={values.EbookUrl}
                                      onChange={e => {
                                        let books = [...filteredAllBookList];
                                        books.find(x => x.EbookID === values.EbookID).EbookUrl = e.target.value;
                                        setFilteredAllBookList(books);
                                      }}
                                    />
                                  </td>
                                  <td className="book-management-actions">
                                    <FaCheck
                                      className="admin-dashboard-btn3"
                                      variant="success"
                                      onClick={() => {
                                        if (values.EbookID) updateBook(values.EbookID);
                                        else createBook(values);
                                      }}
                                    />
                                  </td>
                                  <td className="book-management-actions">
                                    <FaWindowClose
                                      className="admin-dashboard-btn3"
                                      variant="danger"
                                      onClick={() => {
                                        if (values.EbookID) {
                                          let books = [...filteredAllBookList];
                                          books[
                                            books.findIndex(x => x.EbookID === values.EbookID)
                                          ] = tempBook;
                                          setFilteredAllBookList(books);
                                        } else {
                                          let books = [...filteredAllBookList];
                                          books.splice(books[0], 1);
                                          setFilteredAllBookList(books);
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                              );
                            else
                              return (
                                <tr>
                                  <td>{values.EbookID}</td>
                                  <td>{values.EbookImageUrl.length > 30 ? values.EbookImageUrl.substr(1, 30) + '...' : values.EbookImageUrl}</td>
                                  <td>{values.EbookName}</td>
                                  <td>{values.EbookUrl.length > 30 ? values.EbookUrl.substr(1, 30) + '...' : values.EbookUrl}</td>
                                  <td className="book-management-actions">
                                    <Button
                                      className="admin-dashboard-btn4"
                                      onClick={() => {
                                        let books = [...filteredAllBookList];
                                        setTempBook(Object.assign({}, values));
                                        books[books.indexOf(values)].isEdit = true;
                                        setFilteredAllBookList(books);
                                      }}
                                      disabled={
                                        filteredAllBookList.length &&
                                        filteredAllBookList.find(x => x.isEdit)
                                      }
                                    >
                                      <FaRegEdit />
                                    </Button>
                                  </td>
                                  <td className="book-management-actions">
                                    <Button
                                      className="admin-dashboard-btn4"
                                      onClick={() => deleteBook(values.EbookID)}
                                    ><FaTrashAlt />
                                    </Button>
                                  </td>
                                </tr>
                              );
                          })}
                        </tbody>
                      </Table>
                    </>)
                    /* ========================== END OF MANAGE E-BOOKS ========================== */


                    : showRegisteredStudents ?
                      (<>
                        {/* ========================== START OF REGISTERED STUDENTS ========================== */}
                        <span className="adminDashboard-modalHeader">Registered Students List</span>
                        <span className="adminDashboard-modalHeader-search-label">Search a Student via Last Name</span>
                        <span className="adminDashboard-modalHeader-search"><input className="search-student-tb" type="text" placeholder="Enter student's lastname here ..." onChange={(e) => filterAllStudents(e)} /></span>

                        <Table className="manage-book-request-table" bordered hover>
                          <thead>
                            <tr className="align-center">
                              <th className="adminDashboard-lrn">LRN</th>
                              <th className="adminDashboard-name">NAME</th>
                              <th className="request-borrow-bookcategory">EMAIL</th>
                              <th className="pending-request-status">DATE REGISTERED</th>
                              <th className="pending-request-status">{"GR&SEC"}</th>
                              <th className="pending-request-status">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudentList.map(values => (
                              <tr>
                                <td>{values.Lrn}</td>
                                <td>
                                  {values.FirstName} {values.LastName}
                                </td>
                                <td>{values.Email}</td>
                                <td>{values.Created}</td>
                                <td>{values.GradeLevel} - {values.Section}</td>
                                <td><Button
                                  className="admin-dashboard-btn2"
                                  onClick={() => { { setShowResetPassword(true); setSelectedStudent(values) } }}
                                >
                                  RESET PASSWORD
                                </Button></td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </>)
                      /* ========================== END OF MANAGE E-BOOKS ========================== */



                      : /* ========================== START OF DASHBOARD MAIN CONTENT ========================== */
                      (<>
                        <div className="statistics-wrapper">
                          <div className="stats-header-wrapper">
                            E-Books System Statistics
                          </div>
                          <div className="stats-content-wrapper">
                            <table>
                              <tbody>
                                <tr>
                                  <td>
                                    <>Registered Accounts</><br />
                                    <div className="stats"><img className="small-icons" src={registeredStudentsIcon} alt="" /><>{studentsList.length}</></div>
                                  </td>
                                  <td>
                                    <>E-Book Records</><br />
                                    <div className="stats"><img className="small-icons" src={eBooksRecordIcon} alt="" /><>{allBookList.length}</></div>
                                  </td>
                                  <td>
                                    <>Total E-Books Read</><br />
                                    <div className="stats"><img className="small-icons" src={booksReadIon} alt="" /><>{allLogs.length}</></div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <hr />
                        </div>

                        <div className="stats-header-wrapper">Top 5 Most Commonly Read E-Books</div>
                        <div className="stats-content-wrapper">
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <table>
                                    <thead>
                                      <tr>
                                        <td><b>Book Title</b></td>
                                        <td className="align-center"><b>Times Read</b></td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {topFiveLogs.map(values => (
                                        <tr>
                                          <td>{values.EbookName}</td>
                                          <td className="align-center">{values.xcount}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <hr />
                        {console.log(allBookList.slice(Math.max(allBookList.length - 5, 0)))}
                        <div>
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <table>
                                    <tbody>
                                      <tr>
                                        {/* START OF RECENTLY ADDED E-BOOKS */}
                                        <td>
                                          <table>
                                            <thead>
                                              <tr>
                                                <td colSpan="2"><div className="stats-header-wrapper">Recently Added E-Books</div></td>
                                              </tr>
                                              <tr>
                                                <td><b>Book ID</b></td>
                                                <td><b>Book Title</b></td>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {allBookList.slice(Math.max(allBookList.length - 5, 0)).map(values => (
                                                <tr>
                                                  <td>{values.EbookID}</td>
                                                  <td>{values.EbookName}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </td>
                                        {/* END OF RECENTLY ADDED E-BOOKS */}

                                        {/* START OF RECENTLY REGISTERED STUDENTS */}
                                        <td>
                                          <table>
                                            <thead>
                                              <tr>
                                                <td colSpan="2"><div className="stats-header-wrapper">Recently Registered Students</div></td>
                                              </tr>
                                              <tr>
                                                <td><b>Complete Name</b></td>
                                                <td><b>Grade & Section</b></td>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {allStudents.slice(Math.max(allStudents.length - 5, 0)).map(values => (
                                                <tr>
                                                  <td>{values.FirstName + ' ' + values.MiddleName + ' ' + values.LastName}</td>
                                                  <td>{values.GradeLevel + ' - ' + values.Section}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </td>
                                        {/* END OF RECENTLY REGISTERED STUDENTS */}
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>)
                    /* ========================== END OF DASHBOARD MAIN CONTENT ========================== */
                  }
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* ======== MODALS ======== */}
      {/* RESET Password */}
      <Modal
        show={showResetPassword}
        onHide={() => setShowResetPassword(false)}
        contentClassName="manage-reports"
        dialogClassName="manage-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reset the password of this user?<br /><br />
          <div className="align-center">
            <Button className="resetpassword" onClick={() => resetPassword()}>YES</Button>
            <Button className="resetpassword" onClick={() => setShowResetPassword(false)}>CANCEL</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showResetPasswordSuccessfull}
        onHide={() => setShowResetPasswordSuccessfull(false)}
        contentClassName="manage-reports"
        dialogClassName="manage-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password Successfull</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The student's new password is <br />"[student's lastname]_[student's lrn]"<br /><br />
        </Modal.Body>
      </Modal>
      {/* END OF RESET Password */}

      {/* ======== END OF MODALS ======== */}
    </div>
  );
};

export default DashboardAdmin;
