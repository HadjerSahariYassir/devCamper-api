const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/authentification");

const { protect } = require("../middleware/auth");

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route("/me").get(protect, getMe);

module.exports = router;


