import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [String],
      default: [],
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

const Skill = mongoose.model('Skill', skillSchema)

export default Skill