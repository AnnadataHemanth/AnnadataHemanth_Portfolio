import express from 'express'

import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
  uploadCertificateImage,
} from '../controllers/certificateController.js'

import authMiddleware from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// Public
router.get('/', getCertificates)

// Upload certificate image
router.post(
  '/upload',
  authMiddleware,
  upload.single('image'),
  uploadCertificateImage,
)

// Reorder certificates
router.post(
  '/reorder',
  authMiddleware,
  reorderCertificates,
)

// Create certificate
router.post(
  '/',
  authMiddleware,
  createCertificate,
)

// Update certificate
router.put(
  '/:id',
  authMiddleware,
  updateCertificate,
)

// Delete certificate
router.delete(
  '/:id',
  authMiddleware,
  deleteCertificate,
)

export default router