const express = require("express");
const db = require("./models");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

// App configurations
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(403).send({
      message: `Unauthorized`
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      res.status(403).send({
        message: `Unauthorized`
      });
    }
    req.user = user;
    next();
  });
};

//App Routes
app.use("/auth", require("./routes/r-auth"));
app.use("/user", require("./routes/r-users"));
app.use("/children", verifyToken, require("./routes/r-children"));
app.use("/card", verifyToken, require("./routes/r-cards"));
app.use("/transactions", verifyToken, require("./routes/r-transactions"));

const PORT = process.env.PORT || 3000;
db.sequelize
  .sync({ force: false })
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`App is Running at the PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Could Not connect to database ${err}`);
  });
