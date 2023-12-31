const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});
router.get("/", async (req, res) => {
  //此route可以獲得系統中的所有課程
  try {
    let courseFound = await Course.find({})
      .populate("teacher", ["username", "email"])
      //populate是mongoose中的一個語法，功能是可以找到跟()內第一個參數有關的資料並且附加在整個資料內。
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});
router.get("/:_id", async (req, res) => {
  //查詢單一課程的route
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("teacher", ["username", "email"])
      .exec();
    if (!courseFound) {
      //檢查課程是否存在
      return res.send("查無此課程");
    }
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用講師id來尋找該講師所有創建的課程
router.get("/teacher/:teacher_id", async (req, res) => {
  let { teacher_id } = req.params;
  let coursesFound = await Course.find({ teacher: teacher_id })
    .populate("teacher", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

//用學生id來尋找該學生所有註冊過的課程
router.get("/student/:student_id", async (req, res) => {
  let { student_id } = req.params;
  let coursesFound = await Course.find({ student: student_id })
    .populate("teacher", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

//用課程名稱尋找特定的課程
router.get("/findByname/:name", async (req, res) => {
  let { name } = req.params;
  let courseFound = await Course.find({ title: name })
    .populate("teacher", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

router.post("/", async (req, res) => {
  //新增課程的route
  // 驗證發布新課程的數據是否符合Joi規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發布新課程，若您為講師，請使用講師帳號登入");
  }
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      teacher: req.user._id,
    });
    let savedCourse = await newCourse.save();
    res.send({ message: "新課程已經保存", savedCourse });
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

//讓學生透過課程id註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id });
    //找到course後，將當前使用者(req.user._id)加入到該course的student屬性內(使用arr.push method將使用者推入student array中)，表示已註冊該課程，再將修改過的course save到資料庫內

    // course.student.push(localStorage.user._id); 題外話，不可以使用這個寫法，因為node.js後端環境不存在localStorage!!
    const result = course.student.some((student) => {
      return student == req.user._id;
    });
    //確認使用者是否註冊過該課程，如果註冊過則不再將其加入student array
    if (result) {
      return res.send("您已註冊過該課程");
    } else {
      course.student.push(req.user._id);
      await course.save();
      res.send("註冊完成");
    }
  } catch (e) {
    res.send(e);
  }
});
router.patch("/:_id", async (req, res) => {
  //先驗證要修改的數據是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { _id } = req.params;

  try {
    //確認要修改的課程真的存在
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到該課程，無法更新內容");
    }

    //確認使用者必須是該課程講師才能編輯課程資料
    if (courseFound.teacher.equals(req.user._id)) {
      //這個判斷式的意思是查詢到的課程的teacher(value=_id)要等於目前登入的使用者(req.user)的_id，才能夠編輯課程
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({ message: "成功更新課程資料", updatedCourse });
    } else {
      return res.status(403).send("只有此課程講師才有權限編輯課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});
router.delete("/:_id", async (req, res) => {
  //該route可以刪除課程(寫法跟編輯課程很類似，都需要確認課程存在並且確認使用者身分)
  let { _id } = req.params;
  try {
    //確認要刪除的課程真的存在
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到該課程，無法進行刪除");
    }

    //確認使用者必須是該課程講師才能刪除該課程
    if (courseFound.teacher.equals(req.user._id)) {
      await Course.findOneAndDelete({ _id });
      return res.send("成功刪除課程資料");
    } else {
      return res.status(403).send("只有此課程講師才能刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});
module.exports = router;
