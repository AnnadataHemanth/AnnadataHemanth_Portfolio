import Skill from '../models/Skills.js'

export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(skills)
  } catch (error) {
    next(error)
  }
}

export const createSkill = async (req, res, next) => {
  try {
    const lastSkill = await Skill.findOne().sort({
      order: -1,
    })

    const nextOrder = lastSkill
      ? lastSkill.order + 1
      : 0

    const skill = await Skill.create({
      ...req.body,
      order: nextOrder,
    })

    res.status(201).json(skill)
  } catch (error) {
    next(error)
  }
}

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!skill) {
      return res.status(404).json({
        message: 'Skill group not found.',
      })
    }

    res.status(200).json(skill)
  } catch (error) {
    next(error)
  }
}

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(
      req.params.id,
    )

    if (!skill) {
      return res.status(404).json({
        message: 'Skill group not found.',
      })
    }

    res.status(200).json({
      message: 'Skill group deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

export const reorderSkills = async (req, res, next) => {
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
      await Skill.bulkWrite(operations)
    }

    const skills = await Skill.find().sort({
      order: 1,
      createdAt: 1,
    })

    res.status(200).json(skills)
  } catch (error) {
    next(error)
  }
}