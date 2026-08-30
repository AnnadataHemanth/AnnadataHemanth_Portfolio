import Experience from '../models/Experience.js'

export const getExperiences = async (
  req,
  res,
  next,
) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(experiences)
  } catch (error) {
    next(error)
  }
}

export const createExperience = async (
  req,
  res,
  next,
) => {
  try {
    const lastExperience =
      await Experience.findOne().sort({
        order: -1,
      })

    const nextOrder = lastExperience
      ? lastExperience.order + 1
      : 0

    const experience = await Experience.create({
      ...req.body,
      order: nextOrder,
    })

    res.status(201).json(experience)
  } catch (error) {
    next(error)
  }
}

export const updateExperience = async (
  req,
  res,
  next,
) => {
  try {
    const experience =
      await Experience.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      )

    if (!experience) {
      return res.status(404).json({
        message: 'Experience not found.',
      })
    }

    res.status(200).json(experience)
  } catch (error) {
    next(error)
  }
}

export const deleteExperience = async (
  req,
  res,
  next,
) => {
  try {
    const experience =
      await Experience.findByIdAndDelete(
        req.params.id,
      )

    if (!experience) {
      return res.status(404).json({
        message: 'Experience not found.',
      })
    }

    res.status(200).json({
      message: 'Experience deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

export const reorderExperiences = async (
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
            $set: { order: index },
          },
        },
      }),
    )

    if (operations.length > 0) {
      await Experience.bulkWrite(operations)
    }

    const experiences =
      await Experience.find().sort({
        order: 1,
        createdAt: 1,
      })

    res.status(200).json(experiences)
  } catch (error) {
    next(error)
  }
}