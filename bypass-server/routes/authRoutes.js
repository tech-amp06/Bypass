import { Router } from 'express'
import { login, signup, logout } from '../controllers/auth.js'

const router = Router()

// POST /api/auth/login
// body: { email, password }
router.post('/login', login)

// POST /api/auth/signup
// body: { email, password }
router.post('/signup', signup)

// POST /api/auth/logout
router.post('/logout', logout)

export default router