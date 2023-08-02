const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("mongoDB運行中。。。");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware

//前兩句用來解析客戶端寄送的HTTP request的資料類型
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //在到達各個route之前先經過cors
app.use("/api/user", authRoute);
//courses routes應該被保護，只有登入系統的人才能夠新增或註冊課程(有登入過的使用者都會有一個jwt)
//我們使用在passport製作好的middleware(authenticate)來做保護驗證
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//不要使用3000，因為3000是react預設的port，不能用相同的
app.listen(8080, () => {
  console.log("port8080聆聽中。。。");
});
