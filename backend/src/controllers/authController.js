import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required.',
      })
    }

    const admin = await Admin.findOne({ username })

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid username or password.',
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password,
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid username or password.',
      })
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    )

    res.json({
      message: 'Login successful.',
      token,
    })
  } catch (error) {
    next(error)
  }
}