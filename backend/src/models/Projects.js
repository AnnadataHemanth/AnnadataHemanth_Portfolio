import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: '',
      trim: true,
    },

    live: {
      type: String,
      default: '',
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Project = mongoose.model('Project', projectSchema)

export default Project