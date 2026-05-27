import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password })
    const token = generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = generateToken(res, user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar, uid } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({ name, email, avatar, provider: 'google', password: uid + process.env.JWT_SECRET })
    }

    const token = generateToken(res, user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0), sameSite: 'none', secure: true })
  res.json({ message: 'Logged out' })
}

// @GET /api/auth/profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  })
}