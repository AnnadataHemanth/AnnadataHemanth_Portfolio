import Project from '../models/Projects.js'
import cloudinary from '../config/cloudinary.js'

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const lastProject = await Project.findOne().sort({
      order: -1,
    })

    const nextOrder = lastProject
      ? lastProject.order + 1
      : 0

    const project = await Project.create({
      ...req.body,
      order: nextOrder,
    })

    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.',
      })
    }

    res.status(200).json(project)
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id,
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.',
      })
    }

    res.status(200).json({
      message: 'Project deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

export const reorderProjects = async (req, res, next) => {
  try {
    const { orderedIds } = req.body

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        message: 'orderedIds must be an array.',
      })
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }))

    if (operations.length > 0) {
      await Project.bulkWrite(operations)
    }

    const projects = await Project.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
}

export const uploadProjectImages = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No images uploaded.',
      })
    }

    const uploadImage = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                'annadata-hemanth-portfolio/projects',
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

    const results = await Promise.all(
      req.files.map((file) => uploadImage(file)),
    )

    const images = results.map(
      (result) => result.secure_url,
    )

    res.status(201).json({
      message: 'Images uploaded successfully.',
      images,
    })
  } catch (error) {
    next(error)
  }
}