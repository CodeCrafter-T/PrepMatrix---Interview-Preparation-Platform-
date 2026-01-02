import { groq } from "../config/groq.js"; 
import AIReview from "../models/AIReview.js";

export const generateReview = async (req, res) => {
  const { companyName, role } = req.body;

  try {
    // Validate input
    if (!companyName || !role) {
      return res.status(400).json({ message: "Company name and Role are required" });
    }

    // Check database
    const existingReview = await AIReview.findOne({
      user: req.user._id,
      companyName: companyName.toLowerCase(),
      role: role.toLowerCase()
    });

    if (existingReview) {
      console.log("Found cached review in DB. Returning immediately.");
      return res.status(200).json(existingReview);
    }

    // Prompt
    const systemPrompt = `You are a Senior Tech Hiring Manager. 
    Your goal is to provide deep research on a company role.
    You must output ONLY a valid JSON object. Do not output any thinking, intro, or markdown code blocks.`;

    const userPrompt = `
      Analyze the role of "${role}" at "${companyName}".
      
      Provide a comprehensive JSON response including:
      1. Technical Skills & Stack (Current and Past)
      2. 3 Specific MCQ/Aptitude topics to study (with resource links).
      3. 5 LeetCode-style coding problems frequently asked at this company.
      4. Insider tips and profile of hired candidates.

      Return a JSON object with this EXACT structure:
      {
        "preferredSkills": ["skill1", "skill2"],
        "latestTechStack": ["tech1", "tech2"],
        "pastTechStack": ["tech1"],
        "companyMotto": "Short motto",
        "inTheNews": "One sentence news summary",
        "mcqResources": [ {"topic": "Topic Name", "link": "https://example.com", "description": "Short desc"} ],
        "codingQuestions": [ {"problemName": "Two Sum", "link": "https://leetcode.com/...", "frequency": "High"} ],
        "mostProudProjects": ["Project 1"],
        "tipsFromSeniors": ["Tip 1", "Tip 2"],
        "hiredProfiles": ["Profile 1"]
      }
    `;

    console.log(`Requesting Groq (Llama-3.3) for: ${companyName}...`);

    // Call GROQ API
    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.5,
        max_tokens: 2048, 
        response_format: { type: "json_object" } 
    });

    const text = completion.choices[0]?.message?.content || "";
    console.log("Groq Response Received.");

    // Parse and save
    let aiData;
    try {
        aiData = JSON.parse(text);
    } catch (parseError) {
        console.error("JSON Parse Failed. Raw text:", text);
        return res.status(500).json({ message: "AI returned invalid data format." });
    }

    const newReview = new AIReview({
      user: req.user._id, 
      companyName: companyName.toLowerCase(),
      role: role.toLowerCase(),
      ...aiData
    });

    await newReview.save();
    console.log("Saved new review to Database.");

    res.status(201).json(newReview);

  } catch (error) {
    console.error(" GROQ Error ");
    console.error(error.message);
    
    res.status(500).json({ 
      message: "AI Service Error: " + (error.message || "Unknown error") 
    });
  }
};

export const getAIReview = async (req, res) => {
  try {
    const review = await AIReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};