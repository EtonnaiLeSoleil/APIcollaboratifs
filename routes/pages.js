const express = require('express');
const storage = require('../data/storage');

const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Project API', projectsCount: storage.projects.length });
});

// List projects in HTML
router.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects', projects: storage.projects });
});

// Project detail
router.get('/projects/:projectId', (req, res) => {
  const id = Number(req.params.projectId);
  const project = storage.projects.find(p => p.id === id);
  if (!project) return res.status(404).render('404', { message: 'Projet non trouvé' });
  res.render('project', { title: project.name, project });
});

module.exports = router;
 