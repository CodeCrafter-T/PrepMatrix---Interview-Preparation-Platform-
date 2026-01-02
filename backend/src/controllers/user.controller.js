import AIReview from "../models/AIReview.js";
import User from "../models/User.js"; 

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in getUserProfile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserAIHistory = async (req, res) => {
  try {
    const history = await AIReview.find({ user: req.user._id })
      .select("companyName role createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.log("Error in getUserAIHistory:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};