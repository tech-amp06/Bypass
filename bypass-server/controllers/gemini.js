import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const callGemini = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(process.env.GEMINI_API_KEY ? "Key loaded" : "Key missing");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });
  
  const result = await model.generateContent("Explain AI in 1 sentence");
  console.log(result.response.text());
}

callGemini();

// const models = await genAI.ListModels();
// console.log(models);