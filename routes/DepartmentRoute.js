const express = require("express");
const {
  addDepartment,
  deleteDepartment,
  editDepartment,
  getDepartment,
  getDepartments,
} = require("../controllers/Department");
// const userVerification = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/add", addDepartment);
router.put("/edit/:id", editDepartment);
router.get("/all", getDepartments);
router.get("/:id", getDepartment);
router.delete("/delete/:id", deleteDepartment);

module.exports = router;
