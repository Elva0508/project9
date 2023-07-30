//通常在MERN專案裡，如果希望做一些功能的話，這些功能會被稱為服務(service)，我們在src內新建services資料夾將這些service集中管理
//在這個文件內我們將製作跟auth component有關的一切service，例如註冊、登入、登出等等...
import axios from "axios";
const API_URL = "http://localhost:8080/api/user"; //用來連結sever端的網域，將其存為一個變數，這樣之後若要修改server的網域就不用大費周章每個request都要修改了

class AuthService {
  login() {}
  logout() {}
  register() {}
} //製作一個class裡面放method
export default new AuthService();
