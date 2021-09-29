const models = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
exports.login = async (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  };
  if (!validateEmail(data.email) || !validatePassword(data.password)) {
    return res.status(400).send({
      message: `Invalid credentials`
    });
  }
  const user = await models.User.findOne({
    where: {
      Email: data.email
    }
  });
  if (user) {
    const password = await bcrypt.compare(data.password, user.dataValues.Password)
    if (!password) {
      return res.status(403).send({
        message: `Invalid Password`
      })
    } 
    jwt.sign({ data }, process.env.SECRET_KEY, (err, token) => {
      res.send({
        token,
        userId: user.dataValues.UserId
      });
    });
  } else {
    return res.status(403).send({
      message: `No account registered with given credentials`
    });
  }
}; 

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  if (password.trim().length < 7) {
    return false;
  }
  return true;
};
