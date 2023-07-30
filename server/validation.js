//使用Joi套件的限制式
const Joi = require("joi");
const registerValidation = (data) => {
  const Schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.empty": "username為必要輸入項目",
    }), //可以在每個欄位上使用.messages來自訂messages。這邊使用string.empty而不是required的原因是不知道為什麼required會將不輸入的值偵測為""而不是null或undefined，導致錯誤提示無法正常出現
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("student", "teacher"),
  });
  return Schema.validate(data);
};
const loginValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return Schema.validate(data);
};
const courseValidation = (data) => {
  const Schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });
  return Schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
