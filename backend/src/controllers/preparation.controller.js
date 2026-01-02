import Preparation from "../models/Preparation.js";
import AIReview from "../models/AIReview.js";

export const createPreparation = async (req, res) => {
  try {
    const { companyName, role, type, aiReviewId } = req.body;

    if (!companyName || !role || !type) {
      return res.status(400).json({ message: "Company, Role, and Type are required" });
    }

    const newPrep = new Preparation({
      user: req.user._id,
      companyName,
      role,
      type,
      aiReviewId: aiReviewId || null
    });

    const savedPrep = await newPrep.save();
    res.status(201).json(savedPrep);

  } catch (error) {
    console.log("Error in createPreparation:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyPreparations = async (req, res) => {
  try {
    const preps = await Preparation.find({ user: req.user._id })
      .sort({ createdAt: -1 }); 

    res.status(200).json(preps);

  } catch (error) {
    console.log("Error in getMyPreparations:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deletePreparation = async (req, res) => {
  try {
    const { id } = req.params;

    const prep = await Preparation.findById(req.params.id);

    if (!prep) return res.status(404).json({ message: "Preparation Not found" });

    // Check ownership
    if (prep.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //Check and delete linked ai review
    if (prep.aiReviewId) {
      await AIReview.findByIdAndDelete(prep.aiReviewId);
      console.log(`Associated AI Review ${prep.aiReviewId} deleted`);
    }

    await Preparation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Preparation and associated AI Review deleted successfully" });

  } catch (error) {
    console.log("Error in deletePreparation controller:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
