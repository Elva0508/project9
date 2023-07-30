const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const courseValidation = require("../validation").courseValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("正在接收一個跟Auth有關的請求。。。");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});
router.post("/register", async (req, res) => {
  //這是用來確認註冊的數據是否符合規定
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了");

  //通過驗證，可以製作新用戶
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "成功儲存使用者",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。" + e);
  }
});
router.post("/login", async (req, res) => {
  //用來確認登入的數據是否符合規定
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認信箱是否註冊過
  const foundUser = await User.findOne({ email: req.body.email });
  // console.log(foundUser);
  if (!foundUser) return res.status(401).send("查無使用者，請確認信箱是否正確");
  //下面的instance method是我們在user-model預設的method，用來驗證使用者登入的密碼與資料庫內雜湊處理過的密碼是否相符
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    //第二個參數是一個cb裡面有兩個參數，第一個參數會回傳e or null (有錯誤或沒有錯誤)，第二個則是compare的結果(true or false)，我們將cb的兩個參數取名為err跟isMatch來接住回傳的資訊
    if (err) return res.status(500).send("有錯誤：" + err);
    if (isMatch) {
      //如果匹配正確，則允許製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼輸入錯誤");
    }
  });
});

module.exports = router;
