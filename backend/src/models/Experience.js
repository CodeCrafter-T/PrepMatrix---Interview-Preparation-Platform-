import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  ctcOffered: { type: String }, 
  location: { type: String },
  
  // Stats
  overallToughness: { type: Number, min: 1, max: 10 },
  platformsUsed: [String], 
  numberOfRounds: { type: Number },
  
  // Nested Array
  rounds: [{
    roundName: { type: String, required: true }, 
    dateAttempted: { type: Date },
    duration: { type: String }, 
    toughness: { type: Number, min: 1, max: 10 },
    topicsFocused: [String], 
    numberOfQuestionsAsked: { type: Number },
    
    questions: [{
      questionText: { type: String, required:true },
      answerText: { type: String } 
    }]
  }],

  // General Fields
  tips: { type: String },
  overallExperience: { type: String },
  
  isAnonymous: { type: Boolean, default: false },

}, { timestamps: true });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;