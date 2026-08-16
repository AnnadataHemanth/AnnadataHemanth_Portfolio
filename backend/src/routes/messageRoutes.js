import express from 'express'

import {
  createMessage,
  getMessages,
  deleteMessage,
} from '../controllers/messageController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.post('/', createMessage)

// Admin only
router.get('/', authMiddleware, getMessages)

router.delete(
  '/:id',
  authMiddleware,
  deleteMessage,
)

export default router