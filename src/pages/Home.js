import { useNavigate } from "react-router-dom";
import rightImage from "../assets/images/abis-bg1.jpg";
import rightImage2 from "../assets/images/abis-bg2.jpg";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data) {
      if (data.StudID || data.username) {
        setIsLoggedIn(true);
      }
    }

  }, []);

  return (
    <div className="appHomePage">
      <div>
        <h2 className="align-center header-welcome-text">Welcome to Andres Bonifacio Integrated School E - Library</h2>
      </div>

      <div>
        <table className="home-main-content">
          <tbody>
            <tr>
              <td className="main-content-left">
                <div className="main-content-right-div">
                  <img src={rightImage2} />
                </div>
              </td>
              <td className="main-content-right">
                <div className="main-content-right-div">
                  <div className="main-content-right-image-wrapper">
                    <img src={rightImage} />
                  </div>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>

                  <h4 className="align-center">Instructions</h4>

                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>

                  {!isLoggedIn ? 
                  <div className="align-center home-signup-btn" onClick={() => navigate('/signup')}>
                  Sign Up
                  </div> : null}
                  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
