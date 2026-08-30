import express from 'express'

import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from '../controllers/experienceController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.get('/', getExperiences)

// Admin protected
router.post('/', authMiddleware, createExperience)

router.post(
  '/reorder',
  authMiddleware,
  reorderExperiences,
)

router.put(
  '/:id',
  authMiddleware,
  updateExperience,
)

router.delete(
  '/:id',
  authMiddleware,
  deleteExperience,
)

export default router