import mongoose from "mongoose";

const aiReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, required: true, lowercase: true, trim: true },

  // Tech & Company Info
  preferredSkills: { type: [String], default: [] },
  latestTechStack: { type: [String], default: [] },
  pastTechStack: { type: [String], default: [] },
  companyMotto: { type: String, default: "" },
  inTheNews: { type: String, default: "" },

  mcqResources: [{
    topic: String,
    link: String,
    description: String
  }],
  
  codingQuestions: [{
    problemName: String,
    link: String,
    frequency: String // e.g. "High", "Medium"
  }],

  // Cultural / Insider Info
  mostProudProjects: { type: [String], default: [] },
  tipsFromSeniors: { type: [String], default: [] },
  hiredProfiles: { type: [String], default: [] },
  
  generatedAt: { type: Date, default: Date.now }
});

// Unique index to prevent duplicate saves for the same search
aiReviewSchema.index({ user: 1, companyName: 1, role: 1 }, { unique: true });

const AIReview = mongoose.model("AIReview", aiReviewSchema);

export default AIReview;