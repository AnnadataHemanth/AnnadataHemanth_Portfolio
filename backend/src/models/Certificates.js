import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      default: '',
      trim: true,
    },

    credentialId: {
      type: String,
      default: '',
      trim: true,
    },

    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },

    image: {
      type: String,
      required: true,
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

const Certificate = mongoose.model(
  'Certificate',
  certificateSchema,
)

export default Certificate