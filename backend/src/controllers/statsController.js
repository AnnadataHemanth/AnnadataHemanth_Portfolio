import Project from '../models/Projects.js'
import Skill from '../models/Skills.js'
import Message from '../models/Message.js'

export const getStats = async (req, res, next) => {
  try {
    const [projects, skills, messages] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Message.countDocuments(),
    ])

    res.status(200).json({
      projects,
      skills,
      messages,
    })
  } catch (error) {
    next(error)
  }
}