const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = db.users;

exports.signUp = (req, res) => {
  console.log(req.body)
  if (!req.body.email && !req.body.password) {
    res
      .status(400)
      .send({ message: "Please provide email and password to continue." });
    return;
  }

  const email = req.body.email;

  const filter = { email: email };
  User.findOne(filter, (err, user) => {
    if (err || user === null) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);


      console.log(hash);

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: hash,
        role: req.body.role ? req.body.role : "user",
        isLoggedIn: true,
      });
      user
        .save(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred, please try again later.",
          });
        });
    } else {
      res.status(400).send({
        message: "User Already Exists.",
      });
    }
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email && !password) {
    res
      .status(400)
      .send({ message: "Please provide email and password to continue." });
    return;
  }

  const filter = { email: email };
  User.findOne(filter, (err, user) => {
    if (err || user === null) {
      res.status(401).send({
        message: "Email or password not correct.",
      });
    } else {
      console.log(bcrypt.compareSync(password, user.password));

      if (bcrypt.compareSync(password, user.password)) {
        user.isLoggedIn = true;

        User.findOneAndUpdate(filter, user, { useFindAndModify: false })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: "Some error occurred, please try again later.",
              });
            } else {
              const token = jwt.sign({ _id: data._id }, "myprivatekey");
              data.accesstoken = token;
              console.log(data)
              res.send(data);
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating.",
            });
          });
      } else {
        res.status(401).send({
          message: "Email or password not correct.",
        });
      }
    }
  });
};

exports.logout = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ message: "Please provide user Id." });
    return;
  }

  const id = req.body.id;
  const update = { isLoggedIn: false };

  User.findByIdAndUpdate(id, update)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Some error occurred, please try again later.",
        });
      } else res.send({ message: "Logged Out successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating.",
      });
    });
};