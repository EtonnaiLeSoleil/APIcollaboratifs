const express = require('express');
const projectController = require('../controllers/projectController');
const membersRouter = require('./members');
const { auth } = require('../middleware/auth');
const { uploadPdf } = require('../middleware/upload');

const router = express.Router();

// CRUD projects
router.post('/', auth, uploadPdf, projectController.createProject);
router.get('/', auth, projectController.listProjects);
router.get('/:projectId', auth, projectController.getProject);
router.put('/:projectId', auth, projectController.updateProject);
router.delete('/:projectId', auth, projectController.deleteProject);

// Routes imbriquées pour les membres
router.use('/:projectId/members', membersRouter);

module.exports = router;
