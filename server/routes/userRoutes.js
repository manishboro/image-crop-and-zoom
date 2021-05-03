const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/setProfilePic", userController.setProfilePic);

module.exports = router;
