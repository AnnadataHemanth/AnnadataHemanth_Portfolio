import express from 'express'

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getSkills)

router.post(
  '/reorder',
  authMiddleware,
  reorderSkills,
)

router.post(
  '/',
  authMiddleware,
  createSkill,
)

router.put(
  '/:id',
  authMiddleware,
  updateSkill,
)

router.delete(
  '/:id',
  authMiddleware,
  deleteSkill,
)

export default router