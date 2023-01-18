import "./assets/css/app.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardStudent from "./pages/DashboardStudent";
import EBooksPage from "./pages/EBooksPage";
import Footer from "./components/Footer";

import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="appMain">
        <Routes>
          <Route path="/" index element={<Home />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<DashboardAdmin />} />
          <Route path="/student-dashboard" element={<DashboardStudent />} />
          <Route path="/e-books" element={<EBooksPage />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
