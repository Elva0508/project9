import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../CurrentUser-context";
import courseService from "../services/course-service";

const CourseComponent = () => {
  const navigate = useNavigate();
  //courseData用來儲存從後端取得的要顯示在畫面上的課程資訊
  const [courseData, setCourseData] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const handleToLogin = () => {
    navigate("/login");
  };
  // 在第一次渲染(加載)頁面時，利用useEffect的cbFn判斷使用者是否已登入，已登入的話判斷使用者的身份來進行其對應的http request
  useEffect(() => {
    if (currentUser) {
      let _id = currentUser.user._id;
      if (currentUser.user.role == "teacher") {
        courseService
          .get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        courseService
          .getEnrolledCourse(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);
  return (
    <div style={{ padding: "3rem" }}>
      {/* 如果未登入的話，隱藏課程資訊，顯示請使用者先進行登入 */}
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
        {/* 判斷是否已登入會員且courseData有抓到值(不為null)且該會員至少註冊或創建過一個課程，判斷為true才顯示下方的課程資訊 */}
        {currentUser && courseData && courseData.length != 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {courseData.map((course) => {
              return (
                <div
                  className="card"
                  style={{ width: "18rem", margin: "1rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">課程名稱：{course.title}</h5>
                    <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                      {course.description}
                    </p>
                    <p style={{ margin: "0.5rem 0rem" }}>
                      學生人數：{course.student.length}
                    </p>
                    <p style={{ margin: "0.5rem 0rem" }}>
                      課程價格：{course.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    </div>
  );
};

export default CourseComponent;
