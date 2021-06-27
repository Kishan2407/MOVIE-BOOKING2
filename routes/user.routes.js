const auth = require("../middleware/auth"); 

module.exports = app => {
  const users = require("../controllers/user.controller");

    var router = require("express").Router();

    router.post("/login", users.login);

    router.post("/sign-up", users.signUp);

    router.post("/logout", auth, users.logout);

    app.use('/api', router);
  };