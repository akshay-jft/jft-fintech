const models = require("../models/index");
const bcrypt = require("bcrypt");
exports.getUserDetails = async (req, res) => {
  let findUser = await models.User.findOne({
    where: { UserId: req.params.id }
  });
  if (!findUser) {
    return res.status(400).send({
      message: "User not found"
    });
  }
  return findUser;
};

exports.createUser = async (req, res) => {
  let newUser = {
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password
  };

  if (!validateEmail(newUser.Email)) {
    res.status(400).send({
      message: `Invalid Email Address`
    });
  }
  if (!validateName(newUser.Name)) {
    res.status(400).send({
      message: `Name cannot be less than 4 characters`
    });
  }

  const existingUser = await models.User.findOne({
    where: {
      Name: req.body.name,
      Email: req.body.email
    }
  });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT));
    const hashedPassword = await bcrypt.hash(newUser.Password, salt);
    newUser.Password = hashedPassword;
    const createdUser = await models.User.create(newUser);
    if (!createdUser) {
      res.status(400).send({
        message: `Invalid Details, Please re creating the user with valid details`
      });
    } else {
      res.send(createdUser);
    }
  } else {
    res.status(400).send({
      message: `User already exists`
    });
  }
};

exports.getAllChildrens = async (req, res) => {
  const childrens = await models.User.findAll({
    include: {
      model: models.Children,
      where: {
        ParentId: req.params.id
      }
    }
  });
  console.log(childrens);
  return res.send(childrens);
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateName = (name) => {
  if (name.trim().length > 5) {
    return true;
  }
  return false;
};
