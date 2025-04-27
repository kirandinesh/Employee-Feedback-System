const User = require("../../models/user");
const Review = require("../../models/review");
const review = require("../../models/review");

const assignReview = async (req, res) => {
  const { recipientEmail } = req.body;
  const { id } = req.params;

  try {
    const reviewer = await User.findById(id);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!reviewer || !recipient) {
      return res.status(404).json({
        success: false,
        message: "Reviewer or Recipient not found",
      });
    }

    const alreadyAssigned = await User.exists({
      _id: id,
      assignedReviews: recipient._id,
    });

    if (alreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: "Review already assigned!",
      });
    }

    await User.updateOne(
      { _id: id },
      { $addToSet: { assignedReviews: recipient._id } }
    );

    res.status(200).json({
      success: true,
      message: "Review assigned successfully!",
    });
  } catch (err) {
    console.error("Assign Review Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const submitReview = async (req, res) => {
  const { recipientEmail, feedback } = req.body;
  try {
    const recipient = await User.findOne({ email: recipientEmail });
    const id = req.user._id;
    const reviewer = await User.findById(id);

    if (!reviewer) {
      return res.status(404).json({
        success: false,
        message: "Reviewer (employee) not found",
      });
    }

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient (employee to review) not found",
      });
    }

    const review = await Review.create({
      review: feedback,
      reviewer: reviewer._id,
      recipient: recipient._id,
    });

    await recipient.updateOne({
      $push: { reviewsFromOthers: review },
    });

    await reviewer.updateOne({
      $pull: { assignedReviews: recipient.id },
    });
    await reviewer.save();

    res.status(201).json({
      success: true,
      message: "Review Submitted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: { review: feedback } },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review does not exist!" });
    }

    res.status(200).json({
      success: true,
      message: "Review Updated Successfully",
      data: updatedReview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const fetchAssignedReviewOfEmployee = async (req, res) => {
  try {
    const id = req.user._id;
    const employeeExist = await User.findById(id).populate("assignedReviews");

    if (!employeeExist) {
      return res
        .status(404)
        .json({ success: false, message: "Employee does not exist!" });
    }

    const allAssignedReviewEmailAndId = employeeExist.assignedReviews.map(
      (emp) => ({
        email: emp.email,
        recipientId: emp._id,
      })
    );

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: allAssignedReviewEmailAndId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const fetchFeedbackOfEmployee = async (req, res) => {
  try {
    const id = req.user._id;
    const employeeExist = await User.findById(id).populate({
      path: "reviewsFromOthers",
      populate: { path: "reviewer", select: "email" },
    });

    if (!employeeExist) {
      return res
        .status(404)
        .json({ success: false, message: "Employee does not exist!" });
    }

    const getFeedBackAndReviewer = employeeExist.reviewsFromOthers.map(
      (emp) => ({
        reviewerEmail: emp.reviewer.email,
        review: emp.review,
      })
    );

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: getFeedBackAndReviewer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
const fetchFeedbackOfEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeExist = await User.findById(id).populate({
      path: "reviewsFromOthers",
      populate: { path: "reviewer", select: "email" },
    });

    if (!employeeExist) {
      return res
        .status(404)
        .json({ success: false, message: "Employee does not exist!" });
    }

    const getFeedBackAndReviewer = employeeExist.reviewsFromOthers.map(
      (emp) => ({
        reviewerEmail: emp.reviewer.email,
        review: emp.review,
        reviewId: emp._id,
      })
    );

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: getFeedBackAndReviewer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  assignReview,
  submitReview,
  updateReview,
  fetchAssignedReviewOfEmployee,
  fetchFeedbackOfEmployee,
  fetchFeedbackOfEmployeeById,
};
