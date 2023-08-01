import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../CurrentUser-context";

const CourseComponent = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  const handleToLogin = () => {
    navigate("/login");
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <>
          <p>瀏覽課程頁面前，請先登入會員</p>
          <button className="btn btn-primary btn-md" onClick={handleToLogin}>
            回到登入畫面
          </button>
        </>
      )}

      <>
        {currentUser && currentUser.user.role == "teacher" && (
          <h1>歡迎來到講師的課程介面</h1>
        )}
        {currentUser && currentUser.user.role == "student" && (
          <h1>歡迎來到學生的課程介面</h1>
        )}
      </>
    </div>
  );
};

export default CourseComponent;
