const express = require("express");
const authController = require("../../controllers/auth-controller/index");
const authMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/check-auth").get(authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: { user },
  });
});
router
  .route("/get-employees")
  .get(authMiddleware, authController.getAllEmployees);
router.route("/delete-employee/:id").delete(authController.deleteEmployeeById);

router.route("/add-employee").post(authController.addEmployee);
router.route("/update-employee/:id").put(authController.updateEmployee);
router.route("/get-employee/:id").get(authController.getEmployeeById);

module.exports = router;
