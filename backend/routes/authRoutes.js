import express from 'express'
import { signup, login, googleAuth, logout, getProfile } from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/logout', logout)
router.get('/profile', protect, getProfile)

export default router