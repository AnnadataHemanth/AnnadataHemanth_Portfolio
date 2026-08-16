import express from 'express'

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  uploadProjectImages,
} from '../controllers/projectController.js'

import authMiddleware from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getProjects)

router.post(
  '/upload',
  authMiddleware,
  upload.array('images', 10),
  uploadProjectImages,
)

router.post(
  '/reorder',
  authMiddleware,
  reorderProjects,
)

router.post(
  '/',
  authMiddleware,
  createProject,
)

router.put(
  '/:id',
  authMiddleware,
  updateProject,
)

router.delete(
  '/:id',
  authMiddleware,
  deleteProject,
)

export default router