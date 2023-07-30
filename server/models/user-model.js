const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    require: true,
  },
  //role是指身分，只能是student or instructor
  data: {
    type: Date,
    default: Date.now,
  },
});

//預設一些instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isTeacher = function () {
  return this.role == "teacher";
};
userSchema.methods.comparePassword = async function (password, cb) {
  //這個函式的意思是說我們將compare的結果放進result並且將其放進參數二的cbFn內，cbFn會有兩個參數，第一個參數用來確認是否有error，如果執行正常的話就回傳null；反之錯誤則回傳e。第二個參數是用來確認result的結果
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

//mongoose middlewares
//若使用者為新用戶，或是正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  //this代表mongoDB內的document，如果是全新的就會是true(記得不能用arrowFn會抓不到this的值)
  //isNew和isModified是Mongoose中的屬性，用來判斷這個document是否為全新的，也就是尚未保存到資料庫的。而isModified則是檢查該document中的密碼欄位是否被修改過。
  if (this.isNew || this.isModified("password")) {
    const hashedValue = await bcrypt.hash(this.password, 10);
    this.password = hashedValue;
  }
  next();
});
module.exports = mongoose.model("User", userSchema);
