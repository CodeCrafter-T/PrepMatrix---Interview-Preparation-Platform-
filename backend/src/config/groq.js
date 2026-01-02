import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in .env file");
}

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});