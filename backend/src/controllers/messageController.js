import Message from '../models/Message.js'

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required.',
      })
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    })

    res.status(201).json({
      message: 'Message sent successfully.',
      data: newMessage,
    })
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    })

    res.status(200).json(messages)
  } catch (error) {
    next(error)
  }
}

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(
      req.params.id,
    )

    if (!message) {
      return res.status(404).json({
        message: 'Message not found.',
      })
    }

    res.status(200).json({
      message: 'Message deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}