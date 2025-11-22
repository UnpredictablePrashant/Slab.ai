const express = require('express');
const router = express.Router();
const projectContentController = require('../controllers/projectContent.controller');
const requireAdminAuth = require('../middlewares/requireAdminAuth');

router.post('/', requireAdminAuth, projectContentController.createProject);
router.get('/', projectContentController.getAllProjectLinks);
router.put('/:id', requireAdminAuth, projectContentController.updateProjectContent)
router.delete('/:id', requireAdminAuth, projectContentController.deleteProjectContent)

module.exports = router;
