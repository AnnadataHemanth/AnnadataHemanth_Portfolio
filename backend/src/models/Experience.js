import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
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

const Experience = mongoose.model(
  'Experience',
  experienceSchema,
)

export default Experience