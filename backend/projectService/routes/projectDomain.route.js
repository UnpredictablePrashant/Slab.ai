const express = require('express');
const router = express.Router();
const projectDomainController = require('../controllers/projectDomain.controller');
const requireAdminAuth = require('../middlewares/requireAdminAuth');

router.post('/', requireAdminAuth, projectDomainController.createProjectDomain);
router.get('/', projectDomainController.getAllProjectDomains);
router.get('/:id', projectDomainController.getProjectDomainById);
router.put('/:id', requireAdminAuth, projectDomainController.updateProjectDomain);
router.delete('/:id', requireAdminAuth, projectDomainController.deleteProjectDomain);

module.exports = router;
