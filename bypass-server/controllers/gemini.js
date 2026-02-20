// server/controllers/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash', // Corrected stable model
  systemInstruction: `You are a surgical triage assistant. Your goal is to identify symptoms that match specific post-operative threats. 
  For Cardiac surgery: focus on chest pain and shortness of breath (Predicting Heart Failure). 
  For General surgery: focus on redness and fever (Predicting Sepsis). 
  Analyze the patient text and return a standardized symptom name from this list: chest_pain, shortness_of_breath, fever, wound_redness, joint_swelling.`
});

// Fixed: Pure JavaScript default export
export default async function generateGemini(req, res) {
    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        return res.status(200).json({ text: result.response.text() });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}