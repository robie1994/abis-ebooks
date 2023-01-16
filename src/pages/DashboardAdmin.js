import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import approvedBooks from "../assets/images/approved-books.png";
import manageBooks from "../assets/images/manage-books.png";
import monthlyReport from "../assets/images/monthly-report.png";
import manageBookRequest from "../assets/images/manage-book-request.png";
import pending from "../assets/images/pending.png";
import studentsList from "../assets/images/student-list.png";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
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
  const [showApprovedBooksList, setShowApprovedBooksList] = useState(false);
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
      url: "http://localhost/api-abis-ls/transaction-reports.php",
      method: "get"
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
      url: "http://localhost/api-abis-ls/student-reports.php",
      method: "get"
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
      url: "http://localhost/api-abis-ls/books.php",
      method: "get"
    })
      .then(res => {
        if (res.data.status === false) setAllBookList([]);
        else setAllBookList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [allPending, setAllPending] = useState([]);
  const getAllPending = () => {
    axios({
      url: "http://localhost/api-abis-ls/pending-requests.php",
      method: "get"
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
      url: "http://localhost/api-abis-ls/approved-requests.php",
      method: "get"
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
      url: "http://localhost/api-abis-ls/returned-requests.php",
      method: "get"
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
      url: "http://localhost/api-abis-ls/students.php",
      method: "get"
    })
      .then(res => {
        if (res.data.status === false) setAllStudents([]);
        else setAllStudents(res.data);
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
  }, []);

  const checkIfAdmin = () => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (!data.username) {
      navigate('/student-dashboard')
    }
  }
  // TO BE REMOVED
  let numbers = [];
  for (let i = 1; i < 51; i++) {
    numbers[i] = i;
  }
  // END
  const acceptRequest = id => {
    const sevenDaysAgo = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    let date = sevenDaysAgo.getDate();
    let month = sevenDaysAgo.getMonth() + 1;
    let year = sevenDaysAgo.getFullYear();
    const dueDate = year + '/' + month + '/' + date;
    if (
      window.confirm("Do you really want to approve transaction : " + id + "?")
    ) {
      axios
        .post("http://localhost/api-abis-ls/approve-request.php", {
          transactionId: id,
          dueDate: dueDate
        })
        .then(() => {
          window.location.reload();
        });
    }

  };
  const returnBook = id => {
    if (
      window.confirm("Do you really want to return transaction : " + id + "?")
    ) {
      axios
        .post("http://localhost/api-abis-ls/return-request.php", {
          transactionId: id
        })
        .then(() => {
          window.location.reload();
        });
    }
  };
  const declineRequest = id => {
    if (
      window.confirm("Do you really want to dectline transaction : " + id + "?")
    ) {
      axios
        .post("http://localhost/api-abis-ls/decline-request.php", {
          transactionId: id
        })
        .then(() => {
          window.location.reload();
        });
    }
  };
  const updateBook = id => {
    let book = allBookList.find(x => x.BookID === id);
    if (window.confirm("Do you really want to update book : " + id + "?")) {
      axios
        .post("http://localhost/api-abis-ls/book-update.php", {
          id,
          name: book.BookName,
          author: book.Author,
          category: book.BookCategory
        })
        .then(() => {
          window.location.reload();
        });
    }
  };
  const createBook = book => {
    if (window.confirm("Do you really want to create book : ?")) {
      axios
        .post("http://localhost/api-abis-ls/book-create.php", {
          name: book.BookName,
          author: book.Author,
          category: book.BookCategory
        })
        .then(() => {
          window.location.reload();
        });
    }
  };
  const deleteBook = id => {
    if (
      window.confirm("Do you really want to delete this book : " + id + "?")
    ) {
      axios
        .post("http://localhost/api-abis-ls/book-delete.php", {
          id
        })
        .then(() => {
          window.location.reload();
        });
    }
  };


  // ALL SEARCH FILTER FUNCTIONS

  // === FILTER ALL BORROWED BOOKS === 
  const [filteredBorrowedBooksTransactions, setFilteredBorrowedBooksTransactions] = useState(allApproved);
  const filterAllApproved = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allApproved.map((transaction) => {
        const bookName = transaction.BookName.toLowerCase();
        if (bookName.includes(e.target.value.toLowerCase())) {
          arr.push(transaction)
        }
        setFilteredBorrowedBooksTransactions(arr);
      })
    }
    else {
      setFilteredBorrowedBooksTransactions(allApproved);
    }
  }

  // === FILTER ALL BOOKS === 
  const [filteredAllBookList, setFilteredAllBookList] = useState(allBookList);
  const filterAllBooks = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allBookList.map((books) => {
        const bookName = books.BookName.toLowerCase();
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

  // === FILTER SETTLED TRANSACTIONS === 
  const [filterSettledTransactionsList, setFilterSettledTransactionsList] = useState(allReturned);
  const filterSettledTransactions = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allReturned.map((transaction) => {
        const studLastName = transaction.LastName.toLowerCase();
        if (studLastName.includes(e.target.value.toLowerCase())) {
          arr.push(transaction)
        }
        setFilterSettledTransactionsList(arr);
      })
    }
    else {
      setFilterSettledTransactionsList(allReturned);
    }
  }

  // === FILTER PENDING REQUESTS === 
  const [filteredPendingRequestsList, setFIlteredPendingRequestsList] = useState(allPending);
  const filterPendingRequests = (e) => {
    const arr = [];
    if (e.target.value.length) {
      allPending.map((transaction) => {
        const studEmail = transaction.Email.toLowerCase();
        if (studEmail.includes(e.target.value.toLowerCase())) {
          arr.push(transaction)
        }
        setFIlteredPendingRequestsList(arr);
      })
    }
    else {
      setFIlteredPendingRequestsList(allPending);
    }
  }
  // END OF SEARCH FILTER FUNCTIONS

  const [selectedStudent, setSelectedStudent] = useState();
  const [showResetPasswordSuccessfull, setShowResetPasswordSuccessfull] = useState();
  // RESET PASSWORD
  const resetPassword = () => {
    console.log()
    axios({
      url: "http://localhost/api-abis-ls/student-change-password.php",
      method: "UPDATE",
      data: {
        "password": selectedStudent.LastName.toLowerCase() + '_' + selectedStudent.Lrn,
        "id": selectedStudent.StudID
      }
    }).then(res => {
      setShowResetPassword(false)
      setShowResetPasswordSuccessfull(true);
      setTimeout(() => window.location.reload(), 10000)
    })
      .catch(err => {
        console.log(err);
      });
  }
  // END OF RESET PASSWORD
  return (
    <div className="admin-dashboard-page">
      <h3>ADMIN DASHBOARD</h3>
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-form">
          <span className="loggedin-as-admin">Logged in as: Admin</span>
          <br />
          <br />
          <div className="div-admin-dashboard">
            <Table className="table1-admin-dashboard">
              <tbody>
                <tr>
                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h1>{allApproved ? allApproved.length : 0}</h1></span>
                      <span className="stats-label"><p>Borrowed Books</p></span>
                    </div>
                  </td>
                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h1>{allBookList ? allBookList.length : 0}</h1></span>
                      <span className="stats-label"><p>Registered Book</p></span>
                    </div>
                  </td>

                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h1>{allStudents ? allStudents.length : 0}</h1></span>
                      <span className="stats-label"><p>Students</p></span>
                    </div>
                  </td>
                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h1>{allReturned ? allReturned.length : 0}</h1></span>
                      <span className="stats-label"><p>Settled Transactions</p></span>
                    </div>
                  </td>

                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h1>{allPending ? allPending.length : 0}</h1></span>
                      <span className="stats-label"><p>Pending Book Requests</p></span>
                    </div>
                  </td>
                  <td>
                    <div className="table1-td-wrapper">
                      <span className="stats-numbers"><h2>{month + '/' + date + '/' + year}</h2></span>
                      <span className="stats-label"><p>Date Today</p></span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <br />
          <hr />
          <br />
          <div className="div-admin-dashboard">
            <Table className="table-admin-dashboard" bordered>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={manageBookRequest}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => { setShowManageBookRequest(true); setFilteredBorrowedBooksTransactions(allApproved) }}
                        className="admin-dashboard-btn">
                        Manage Borrowed Books
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={manageBooks}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => { setShowBooksManagement(true); setFilteredAllBookList(allBookList) }}
                        className="admin-dashboard-btn"
                      >
                        Books Management
                      </Button>
                    </div>
                  </td>

                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={studentsList}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => { setShowRegisteredStudents(true); setFilteredStudentList(allStudents) }}
                        className="admin-dashboard-btn"
                      >
                        Registered Students
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={approvedBooks}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => { setShowApprovedBooksList(true); setFilterSettledTransactionsList(allReturned) }}
                        className="admin-dashboard-btn"
                      >
                        Settled Transactions
                      </Button>
                    </div>
                  </td>

                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={pending}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => { setShowPendingBookRequest(true); setFIlteredPendingRequestsList(allPending) }}
                        className="admin-dashboard-btn"
                      >
                        Pending Book Requests
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div>
                      <img
                        className="admin-dashboard-icons"
                        src={monthlyReport}
                        alt=""
                      />
                    </div>
                    <div>
                      <Button
                        className="admin-dashboard-btn"
                        onClick={() => setShowReports(true)}
                      >
                        Monthly Report
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {/* ======== MODALS ======== */}

      {/* BOOK MANAGEMENT */}
      <Modal
        show={showManageBookRequest}
        onHide={() => setShowManageBookRequest(false)}
        contentClassName="manage-book-request"
        dialogClassName="manage-book-request"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="adminDashboard-modalHeader">Manage Borrowed Books</span>
            <span className="adminDashboard-modalHeader-search-label">Search transaction via Book title</span>
            <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter book title here ..." onChange={(e) => filterAllApproved(e)} /></span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Table className="manage-book-request-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th className="adminDashboard-lrn">LRN</th>
                <th className="adminDashboard-name">NAME</th>
                <th className="request-borrow-bookcategory">EMAIL</th>
                <th className="pending-request-status">DUE DATE</th>
                <th className="pending-request-status">{"GR&SEC"}</th>
                <th className="pending-request-status">BOOK BORROWED</th>
                <th className="pending-request-status">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowedBooksTransactions ? filteredBorrowedBooksTransactions.map(values => (
                <tr>
                  <td>{values.Lrn}</td>
                  <td>
                    {values.FirstName} {values.LastName}
                  </td>
                  <td>{values.Email}</td>
                  <td>{values.DueDate}</td>
                  <td>
                    {values.GradeLevel}-{values.Section}
                  </td>
                  <td>{values.BookName}</td>
                  <td>
                    <Button
                      className="admin-dashboard-btn2"
                      onClick={() => returnBook(values.TransactionID)}
                    >
                      RETURN
                    </Button>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* END OF BOOK MANAGEMENT */}

      {/* BOOK MANAGEMENT */}
      <Modal
        show={showBooksManagement}
        onHide={() => setShowBooksManagement(false)}
        contentClassName="manage-book-request"
        dialogClassName="manage-book-request"
      >
        <Modal.Header closeButton>
          <Modal.Title>Books Management </Modal.Title>
          <Button
            disabled={filteredAllBookList.length && filteredAllBookList[0].BookID === null}
            variant="primary"
            className="add-book"
            onClick={() => {
              let books = [...filteredAllBookList];
              books.unshift({ BookName: "", Author: "", isEdit: true });
              setFilteredAllBookList(books);
            }}
          >
            Add a book
          </Button>
          <span className="adminDashboard-modalHeader-search-label">Search a book</span>
          <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter book title here ..." onChange={(e) => filterAllBooks(e)} /></span>
        </Modal.Header>
        <Modal.Body >
          <Table className="manage-book-request-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th className="adminDashboard-bookId">BOOK ID</th>
                <th className="adminDashboard-name">BOOK NAME</th>
                <th className="request-borrow-name">AUTHOR</th>
                <th className="request-borrow-name">CATEGORY</th>
                <th className="pending-request-status">STATUS</th>
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
                      <td>{values.BookID}</td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Enter Book Name"
                          value={values.BookName}
                          onChange={e => {
                            let books = [...filteredAllBookList];
                            books.find(
                              x => x.BookID === values.BookID
                            ).BookName = e.target.value;
                            setFilteredAllBookList(books);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Enter Book Author"
                          value={values.Author}
                          onChange={e => {
                            let books = [...filteredAllBookList];
                            books.find(x => x.BookID === values.BookID).Author =
                              e.target.value;
                            setFilteredAllBookList(books);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Enter Book Category"
                          value={values.BookCategory}
                          onChange={e => {
                            let books = [...filteredAllBookList];
                            books.find(x => x.BookID === values.BookID).BookCategory = e.target.value;
                            setFilteredAllBookList(books);
                          }}
                        />
                      </td>
                      <td>{values.Availability}</td>
                      <td className="book-management-actions">
                        <Button
                          className="admin-dashboard-btn2"
                          variant="success"
                          onClick={() => {
                            if (values.BookID) updateBook(values.BookID);
                            else createBook(values);
                          }}
                        >
                          SAVE
                        </Button>
                      </td>
                      <td className="book-management-actions">
                        <Button
                          className="admin-dashboard-btn2"
                          variant="danger"
                          onClick={() => {
                            if (values.BookID) {
                              let books = [...filteredAllBookList];
                              books[
                                books.findIndex(x => x.BookID === values.BookID)
                              ] = tempBook;
                              setFilteredAllBookList(books);
                            } else {
                              let books = [...filteredAllBookList];
                              books.splice(books[0],1);
                              setFilteredAllBookList(books);
                            }
                          }}
                        >

                          CANCEL
                        </Button>
                      </td>
                    </tr>
                  );
                else
                  return (
                    <tr>
                      <td>{values.BookID}</td>
                      <td>{values.BookName}</td>
                      <td>{values.Author}</td>
                      <td>{values.BookCategory}</td>
                      <td>{values.Availability}</td>
                      <td className="book-management-actions">
                        <Button
                          className="admin-dashboard-btn2"
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
                          UPDATE DETAILS
                        </Button>
                      </td>
                      <td className="book-management-actions">
                        <Button
                          className="admin-dashboard-btn2"
                          onClick={() => deleteBook(values.BookID)}
                        >
                          DELETE
                        </Button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* END OF BOOK MANAGEMENT */}

      {/* BOOK MANAGEMENT */}
      <Modal
        show={showRegisteredStudents}
        onHide={() => setShowRegisteredStudents(false)}
        contentClassName="manage-book-request"
        dialogClassName="manage-book-request"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="adminDashboard-modalHeader">Registered Students List</span>
            <span className="adminDashboard-modalHeader-search-label">Search a Student via Last Name</span>
            <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter student's lastname here ..." onChange={(e) => filterAllStudents(e)} /></span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Table className="manage-book-request-table" striped bordered hover>
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
        </Modal.Body>
      </Modal>
      {/* END OF BOOK MANAGEMENT */}

      {/* BOOK MANAGEMENT */}
      <Modal
        show={showApprovedBooksList}
        onHide={() => setShowApprovedBooksList(false)}
        contentClassName="manage-book-request"
        dialogClassName="manage-book-request"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="adminDashboard-modalHeader">Settled Transactions</span>
            <span className="adminDashboard-modalHeader-search-label">Search a Settled Transaction via Student's Last Name</span>
            <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter student's lastname here ..." onChange={(e) => filterSettledTransactions(e)} /></span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Table className="manage-book-request-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th className="adminDashboard-bookId2">TRANSACTION ID</th>
                <th className="adminDashboard-name">BOOK NAME</th>
                <th className="request-borrow-name">AUTHOR</th>
                <th className="pending-request-status">BORROWER</th>
                <th className="pending-request-status">DATE BORROWED</th>
                <th className="pending-request-status">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterSettledTransactionsList.map(values => (
                <tr>
                  <td>{values.TransactionID}</td>
                  <td>{values.BookName}</td>
                  <td>{values.Author}</td>
                  <td>
                    {values.FirstName} {values.LastName}
                  </td>
                  <td className="book-management-actions">
                    {values.BorrowedDate}
                  </td>
                  <td className="approvedbooks-status">
                    RETURNED: {values.ReturnedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* END OF BOOK MANAGEMENT */}

      {/* BOOK MANAGEMENT */}
      <Modal
        show={showPendingBookRequest}
        onHide={() => setShowPendingBookRequest(false)}
        contentClassName="manage-book-request"
        dialogClassName="manage-book-request"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="adminDashboard-modalHeader">Pending Book Request</span>
            <span className="adminDashboard-modalHeader-search-label">Search a Pending Request via Student's Email Address</span>
            <span className="adminDashboard-modalHeader-search"><input type="text" placeholder="Enter student's email here ..." onChange={(e) => filterPendingRequests(e)} /></span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Table className="manage-book-request-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th className="adminDashboard-bookId2">TRANSACTION ID</th>
                <th className="adminDashboard-name">BOOK NAME</th>
                <th className="request-borrow-name">CATEGORY</th>
                <th className="pending-request-status">BORROWER EMAIL</th>
                <th colSpan="2" className="pending-request-status">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingRequestsList.map(values => (
                <tr>
                  <td>{values.TransactionID}</td>
                  <td>{values.BookName}</td>
                  <td>{values.BookCategory}</td>
                  <td>{values.Email}</td>
                  <td className="book-management-actions">
                    <Button
                      className="admin-dashboard-btn2"
                      onClick={() => acceptRequest(values.TransactionID)}
                    >
                      ACCEPT
                    </Button>
                  </td>
                  <td className="book-management-actions">
                    <Button
                      className="admin-dashboard-btn2"
                      onClick={() => declineRequest(values.TransactionID)}
                    >
                      DECLINE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* END OF BOOK MANAGEMENT */}

      {/* Reports */}
      <Modal
        show={showReports}
        onHide={() => setShowReports(false)}
        contentClassName="manage-reports"
        dialogClassName="manage-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>Monthly Report</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Line options={options} data={data} />
        </Modal.Body>
      </Modal>
      {/* END OF BOOK Reports */}


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
          The student's new password is <br/>"[student's lastname]_[student's lrn]"<br /><br />
        </Modal.Body>
      </Modal>
      {/* END OF RESET Password */}

      {/* ======== END OF MODALS ======== */}
    </div>
  );
};

export default DashboardAdmin;
