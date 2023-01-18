import Modal from "react-bootstrap/Modal";
import femaleDP from "../assets/images/female-dp.png";
import maleDP from "../assets/images/male-dp.png";
import pendingRequest from "../assets/images/stdnt-pending.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import eBookIcon from "../assets/images/ebook-icon.jpg";

const EBooksPage = () => {
  const [userData, setUserData] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [showSearchedBook, setShowSearchedBook] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // const data = JSON.parse(localStorage.getItem('userData'));
    // if (data && data.StudID) {
    //   setUserData(data);
    // }
    // else {
    //   navigate('/admin-dashboard')
    // }
    getAllBooks();
  }, []);

  const [allBookList, setAllBookList] = useState([]);
  const getAllBooks = () => {
    axios({
      url: "http://localhost/api-abis-ls/ebooks.php",
      method: "get"
    })
      .then(res => {
        if (res.data.status === false) setAllBookList([]);
        else {
          const pages = []
          setAllBookList(res.data);
          setLastPage(Math.ceil(res.data.length / 6) * 1);
          for (let i = 0; i < Math.ceil(res.data.length / 6) * 1; i++) {
            pages.push(i + 1)
          }
          setPages(pages)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const handleImageError = (id) => {
    const img = document.getElementById(id);
    img.src = eBookIcon;
  }

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
      setFilteredAllBookList([]);
    }
  }
  return (
    <div className="e-books-page">
      <div className="search-ebook-wrapper">
        <input type="text" placeholder="Search e-book..." onChange={(e) => filterAllBooks(e)} /><FaSearch className="search-btn" onClick={() => setShowSearchedBook(true)} />
      </div>
      <div className="ebooks-wrapper">
        <table className="ebooks-table">
          <tbody>
            <tr>
              {allBookList.length ?
                allBookList.map(values =>
                ((allBookList.indexOf(values) < currentPage * 6) && (allBookList.indexOf(values) >= (currentPage * 6) - 6) ?
                  (<td key={values.EbookID} className="ebook-td" >
                    <div className="individual-ebook-wrapper">
                      <img className="ebook-cover-image" id={'book_' + values.EbookID} src={values.EbookImageUrl} alt="" onError={() => handleImageError('book_' + values.EbookID)} />
                      <br /><br />
                      <Button onClick={() => window.open(values.EbookUrl, '_blank')} >Read Online</Button><br /><br />
                      {values.EbookName.length > 50 ? values.EbookName.substr(1, 50) + '...' : values.EbookName}
                    </div>
                  </td>)
                  : null
                ))
                : <td>No e-books available to view now.</td>}
            </tr>


          </tbody>
        </table>
        <div className="ebook-pagination-wrapper" colSpan="6">
          <Pagination className="ebook-pagination">
            <Pagination.First disabled={currentPage === 1 ? true : false} onClick={() => setCurrentPage(1)} /> {/*go to first page */}
            <Pagination.Prev disabled={currentPage === 1 ? true : false} onClick={() => setCurrentPage(currentPage !== 1 ? currentPage - 1 : currentPage)} />
            {pages.length ?
              pages.map(page => (
                <>
                  <Pagination.Item onClick={() => setCurrentPage(page)} active={currentPage === page ? true : false}>{page}</Pagination.Item>
                </>
              ))
              : null}
            <Pagination.Next disabled={currentPage === lastPage ? true : false} onClick={() => setCurrentPage(currentPage !== lastPage ? currentPage + 1 : currentPage)} />
            <Pagination.Last disabled={currentPage === lastPage} onClick={() => setCurrentPage(lastPage)} /> {/*go to last page */}
          </Pagination>
        </div>
      </div>

      <Modal
        show={showSearchedBook}
        onHide={() => {setShowSearchedBook(false); setFilteredAllBookList([])}}
        contentClassName="search-ebook-modal"
        dialogClassName="search-ebook-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Search Result/s </Modal.Title>
          </Modal.Header>
        <Modal.Body >
          {filteredAllBookList.length ? (
          <Table className="manage-book-request-table" striped bordered hover>
            <thead>
              <tr className="align-center">
                <th className="request-borrow-name">&nbsp;</th>
                <th className="request-borrow-name">E-BOOK TITLE</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllBookList.map(values => {
                  <tr>
                    <td>
                      <div className="td-searched-cover">
                        <img className="ebook-cover-image" id={'book_' + values.EbookID} src={values.EbookImageUrl} alt="" onError={() => handleImageError('book_' + values.EbookID)} />
                      <br/>
                      <br/>
                      <Button onClick={() => window.open(values.EbookUrl, '_blank')} >Read Online</Button>
                      </div>
                    </td>
                    <td>
                      <div className="searched-title">
                        {values.EbookName.length > 150 ? values.EbookName.substr(1, 150) + '...' : values.EbookName}
                      </div>
                    </td>
                  </tr>
              })}
            </tbody>
          </Table>
        ) : 
       <h4>No record found... Please try to search again.</h4>}
        </Modal.Body>
      </Modal>
    </div >
  );
};

export default EBooksPage;
