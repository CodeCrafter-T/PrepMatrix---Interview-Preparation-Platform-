import Experience from "../models/Experience.js";

export const createExperience = async (req, res) => {
  try {
    const newExperience = new Experience({
      ...req.body, 
      user: req.user._id 
    });

    // Basic validation
    if (!newExperience.rounds || newExperience.rounds.length === 0) {
      return res.status(400).json({ message: "Please add at least one interview round." });
    }

    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);

  } catch (error) {
    console.log("Error in createExperience:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExperiences = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { companyName: { $regex: search, $options: "i" } }, // case-insensitive 
          { role: { $regex: search, $options: "i" } }
        ]
      };
    }

    const experiences = await Experience.find(query)
      .populate("user", "email") 
      .sort({ createdAt: -1 });

    res.status(200).json(experiences);

  } catch (error) {
    console.log("Error in getExperiences:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate("user", "email");

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);

  } catch (error) {
    console.log("Error in getExperienceById:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(experiences);

  } catch (error) {
    console.log("Error in getMyExperiences:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // auth check
    if (experience.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this experience" });
    }

    await Experience.findByIdAndDelete(req.params.id); 

    res.status(200).json({ message: "Experience deleted successfully" });

  } catch (error) {
    console.log("Error in deleteExperience:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (experience.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this experience" });
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    res.status(200).json(updatedExperience);

  } catch (error) {
    console.log("Error in updateExperience:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};