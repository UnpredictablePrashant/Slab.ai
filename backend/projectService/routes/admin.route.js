const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const requireAdminAuth = require('../middlewares/requireAdminAuth')

router.post('/login', adminController.login)

router.use(requireAdminAuth)

router.get('/summary', adminController.getSummary)
router.get('/projects', adminController.listProjects)
router.post('/projects', adminController.createProject)
router.put('/projects/:id', adminController.updateProject)
router.delete('/projects/:id', adminController.deleteProject)

module.exports = router
