import axios from "axios";
import { json } from "react-router-dom";
const API_URL = "http://localhost:8080/api/courses";

class CourseService {
  post(title, description, price) {
    //這邊的token意思是，我們要確認使用者是否有登錄，有登錄的使用者才會獲得token，我們要將從user登陸時獲取的資料中提取token並放在course route相關的 http request內，因為我們在設計course route的時候有加一個jwt驗證的middleware，只有送出的請求上帶有jwt token並且符合驗證信息的用戶才能使用該API
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    //第三個參數放header請求的配置選項，用來傳遞例如身分驗證令牌、使用的資料格式、瀏覽器類型等等。
    return axios.post(
      API_URL,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }

  //使用student id來找到學生已註冊的課程
  getEnrolledCourse(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }

  //使用teacher id來找到講師擁有的課程
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/teacher/" + _id, {
      headers: { Authorization: token },
    });
  }

  //利用course title(name)找到特定的課程
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByname/" + name, {
      headers: { Authorization: token },
    });
  }
  //利用課程id找到該課程資料並修改其student屬性
  enRoll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/enroll/" + _id,
      { _id },
      {
        headers: { Authorization: token },
      }
    );
  }
}
export default new CourseService();
