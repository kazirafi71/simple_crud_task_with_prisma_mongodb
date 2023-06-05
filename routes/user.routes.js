const {
  userRegistration,
  listUsers,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const { isAdminOrSupport, isLoggedIn } = require("../utils/permissions");

const router = require("express").Router();

router.post("/create-user", isAdminOrSupport, userRegistration);

router.post("/list-users", isAdminOrSupport, listUsers);

router.put("/update-user/:userId", isLoggedIn, updateUser);

router.delete("/delete-user/:userId", isLoggedIn, deleteUser);

module.exports = router;
