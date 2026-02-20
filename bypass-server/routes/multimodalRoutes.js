import { Router } from 'express'
import generateGemini from '../controllers/gemini.js'

const router = Router()

// POST /api/multimodal/gemini
// body: { prompt?: string }
router.post('/gemini', async (req, res) => {
  return generateGemini(req, res)
})

export default router
