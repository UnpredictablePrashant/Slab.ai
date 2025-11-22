const Project = require('../models/project.model')
const ProjectDomain = require('../models/projectDomain.model')
const ProjectContent = require('../models/projectContent.model')
const { signAdminToken } = require('../utils/adminAuth')

const isJsonString = (value) => {
  if (typeof value !== 'string') return false
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    return false
  }
}

const parseSubProjects = (input) => {
  if (!input) return []
  if (Array.isArray(input)) return input
  if (typeof input === 'string' && input.trim()) {
    if (isJsonString(input)) {
      return JSON.parse(input)
    }
  }
  return []
}

const parseKeywords = (input) => {
  if (!input) return []
  if (Array.isArray(input)) return input
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean)
  }
  return []
}

const ensureValue = (value, field) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${field} is required`)
  }
  return value
}

const parsePricing = (value) => {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    throw new Error('pricing must be a number')
  }
  return parsed
}

const getAdminCredentials = () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('Admin credentials are not configured')
  }

  return { email, password }
}

const buildProjectPayload = (body) => {
  ensureValue(body.projectTitle, 'projectTitle')
  ensureValue(body.description, 'description')
  ensureValue(body.projectDomain, 'projectDomain')
  ensureValue(body.pricing, 'pricing')

  const subProjects = parseSubProjects(body.subProjects)
  const keyWords = parseKeywords(body.keyWords)

  return {
    projectTitle: body.projectTitle,
    description: body.description,
    imageUrl: body.imageUrl || null,
    pricing: parsePricing(body.pricing),
    projectDomain: body.projectDomain,
    keyWords,
    noOfSubProjects: subProjects.length,
    subProjects,
  }
}

exports.login = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const credentials = getAdminCredentials()

    if (email !== credentials.email || password !== credentials.password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signAdminToken({ email, role: 'admin' })
    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createProject = async (req, res) => {
  try {
    const payload = buildProjectPayload(req.body)
    const project = await Project.create(payload)
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const payload = buildProjectPayload({ ...req.body, subProjects: req.body.subProjects || [] })
    const project = await Project.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json({ message: 'Project deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSummary = async (_req, res) => {
  try {
    const [totalProjects, totalDomains, totalContents, recentProjects] = await Promise.all([
      Project.countDocuments(),
      ProjectDomain.countDocuments(),
      ProjectContent.countDocuments(),
      Project.find({}).sort({ createdAt: -1 }).limit(5),
    ])

    res.json({
      totalProjects,
      totalDomains,
      totalContents,
      recentProjects,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
