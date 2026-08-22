import Project from '../models/Projects.js'
import Skill from '../models/Skills.js'
import Message from '../models/Message.js'
import Certificate from '../models/Certificates.js'

export const getStats = async (req, res, next) => {
  try {
    const [
      projects,
      skills,
      messages,
      certificates,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Message.countDocuments(),
      Certificate.countDocuments(),
    ])

    res.status(200).json({
      projects,
      skills,
      messages,
      certificates,
    })
  } catch (error) {
    next(error)
  }
}