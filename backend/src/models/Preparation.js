import mongoose from "mongoose";

const preparationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  
  // card from a "Search" or an "AI Generation"?
  type: { 
    type: String, 
    enum: ["Search", "AI Review"], 
    required: true 
  },
  
  //If AI Review, link to the specific review ID
  aiReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AIReview",
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

preparationSchema.index({ user: 1, createdAt: -1 });

const Preparation = mongoose.model("Preparation", preparationSchema);

export default Preparation;