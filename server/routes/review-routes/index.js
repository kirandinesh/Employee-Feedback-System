const express = require("express");
const reviewController = require("../../controllers/review-controller/index");
const authMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

router.route("/assign-review/:id").post(reviewController.assignReview);
router
  .route("/submit-review")
  .post(authMiddleware, reviewController.submitReview);
router.route("/update-review/:id").put(reviewController.updateReview);
router
  .route("/get-assignedreview")
  .get(authMiddleware, reviewController.fetchAssignedReviewOfEmployee);
router
  .route("/get-feedback")
  .get(authMiddleware, reviewController.fetchFeedbackOfEmployee);
router
  .route("/get-feedback/:id")
  .get(reviewController.fetchFeedbackOfEmployeeById);

module.exports = router;
