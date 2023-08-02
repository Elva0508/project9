import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../CurrentUser-context";
import courseService from "../services/course-service";

const EnrollCourseComponent = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  let [searchInput, setSearchInput] = useState(null);
  let [searchResult, setSearchResult] = useState([]);
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleToLogin = () => {
    navigate("/login");
  };
  const handleSearch = () => {
    //根據目前search input的內容到資料庫尋找資料
    courseService
      .getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleEnroll = (_id) => {
    courseService
      .enRoll(_id)
      .then((data) => {
        alert(data.data)
        navigate("/course")
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div style={{ padding: "3rem" }}>
      {/* 如果未登入的話，隱藏課程資訊，顯示請使用者先進行登入 */}
      {!currentUser && (
        <>
          <p>註冊新課程前，請先登入會員</p>
          <button className="btn btn-primary btn-md" onClick={handleToLogin}>
            回到登入畫面
          </button>
        </>
      )}

      <>
        {currentUser && currentUser.user.role == "teacher" && (
          <h1>只有學生可以註冊新課程。</h1>
        )}
        {currentUser && currentUser.user.role == "student" && (
          <>
            <h1>歡迎來到學生的註冊課程介面</h1>
            <div className="search input-group mb-3">
              <input
                type="text"
                className="form-control"
                onChange={handleChangeInput}
              />
              <button onClick={handleSearch} className="btn btn-primary">
                搜尋
              </button>
            </div>
            {currentUser && searchResult && searchResult != 0 && (
              <div>
                <p>這是我們從API返回的課程數據：</p>
                {searchResult.map((course) => {
                  return (
                    <div
                      className="card"
                      style={{ width: "18rem" }}
                      key={course._id}
                    >
                      <div className="card-body">
                        <h5 className="card-title">課程名稱：{course.title}</h5>
                        <p
                          style={{ margin: "0.5rem 0rem" }}
                          className="card-text"
                        >
                          {course.description}
                        </p>
                        <p style={{ margin: "0.5rem 0rem" }}>
                          學生人數：{course.student.length}
                        </p>
                        <p style={{ margin: "0.5rem 0rem" }}>
                          課程價格：{course.price}
                        </p>
                        <p style={{ margin: "0.5rem 0rem" }}>
                          講師：{course.teacher.username}
                        </p>
                      </div>
                      <a
                        href="#"
                        id={course._id}
                        className="card-text btn btn-primary"
                        onClick={() => {
                          handleEnroll(course._id);
                        }}
                      >
                        註冊課程
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default EnrollCourseComponent;
