const { verifyAdminToken } = require('../utils/adminAuth')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const parts = authHeader.split(' ')
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' })
  }

  try {
    const payload = verifyAdminToken(token)
    req.admin = payload
    return next()
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Invalid token' })
  }
}
