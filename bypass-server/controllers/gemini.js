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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent(prompt);
    return result.response.text();

    // result.response.text() may be async or sync depending on SDK; await to be safe
    // const text = typeof result.response.text === 'function' ? result.response.text() : String(result.response)

    return res.json({ text })
  } catch (err) {
    console.error('generateGemini error:', err)
    return res.status(500).json({ error: 'Failed to call Gemini', details: String(err) })
  }
}

export default generateGemini