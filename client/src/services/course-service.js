import axios from "axios";
const API_URL = "http://localhost:8080/api/course";

class CourseService {
  post(title, description, price) {
    //這邊的token意思是，我們要確認使用者是否有登錄，有登錄的使用者才會獲得token，我們要將從user登陸時獲取的資料中提取token並放在course route相關的 http request內，因為我們在設計course route的時候有加一個jwt驗證的middleware，只有送出的請求上帶有jwt token並且符合驗證信息的用戶才能使用該API
    let token;
    if (localStorage.getItem("user")) {
      token = JSON(localStorage.getItem("user").token);
    } else {
      token = "";
    }
    //第三個參數放header請求的配置選項，用來傳遞例如身分驗證令牌、使用的資料格式、瀏覽器類型等等。
    axios.post(
      API_URL,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON(localStorage.getItem("user").token);
    } else {
      token = "";
    }
    return axios.get(API_URL + "/teacher/" + _id, {
      headers: { Authorization: token },
    });
  }
}
export default new CourseService();
