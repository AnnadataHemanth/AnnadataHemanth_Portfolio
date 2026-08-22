import Certificate from '../models/Certificates.js'
import cloudinary from '../config/cloudinary.js'

export const getCertificates = async (
  req,
  res,
  next,
) => {
  try {
    const certificates = await Certificate.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(certificates)
  } catch (error) {
    next(error)
  }
}

export const createCertificate = async (
  req,
  res,
  next,
) => {
  try {
    const lastCertificate =
      await Certificate.findOne().sort({
        order: -1,
      })

    const nextOrder = lastCertificate
      ? lastCertificate.order + 1
      : 0

    const certificate = await Certificate.create({
      ...req.body,
      order: nextOrder,
    })

    res.status(201).json(certificate)
  } catch (error) {
    next(error)
  }
}

export const updateCertificate = async (
  req,
  res,
  next,
) => {
  try {
    const certificate =
      await Certificate.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      )

    if (!certificate) {
      return res.status(404).json({
        message: 'Certificate not found.',
      })
    }

    res.status(200).json(certificate)
  } catch (error) {
    next(error)
  }
}

export const deleteCertificate = async (
  req,
  res,
  next,
) => {
  try {
    const certificate =
      await Certificate.findByIdAndDelete(
        req.params.id,
      )

    if (!certificate) {
      return res.status(404).json({
        message: 'Certificate not found.',
      })
    }

    res.status(200).json({
      message: 'Certificate deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

export const reorderCertificates = async (
  req,
  res,
  next,
) => {
  try {
    const { orderedIds } = req.body

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        message: 'orderedIds must be an array.',
      })
    }

    const operations = orderedIds.map(
      (id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $set: {
              order: index,
            },
          },
        },
      }),
    )

    if (operations.length > 0) {
      await Certificate.bulkWrite(operations)
    }

    const certificates =
      await Certificate.find().sort({
        order: 1,
        createdAt: 1,
      })

    res.status(200).json(certificates)
  } catch (error) {
    next(error)
  }
}

export const uploadCertificateImage = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded.',
      })
    }

    const uploadImage = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                'annadata-hemanth-portfolio/certificates',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(error)
                return
              }

              resolve(result)
            },
          )

        uploadStream.end(file.buffer)
      })
    }

    const result = await uploadImage(req.file)

    res.status(201).json({
      message:
        'Certificate image uploaded successfully.',
      image: result.secure_url,
    })
  } catch (error) {
    next(error)
  }
}