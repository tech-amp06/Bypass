import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

// Handler that calls Gemini and returns the generated text.
// Accepts JSON body: { prompt?: string }
export async function generateGemini(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing on server' })

    const prompt = req.body && req.body.message;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are a medical assistant helping resolve queries of recently discharged patients. Do not remember any conversation, only respond based on the context provided.'
    })

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('generateGemini error:', err)
    return res.status(500).json({ error: 'Failed to call Gemini', details: String(err) })
  }
}

export default generateGemini