const storage = require('../data/storage');

// Contrôleurs simples et pédagogiques
exports.createProject = (req, res, next) => {
  try {
  const { name, description, organizer } = req.body;
  const specFile = req.file ? req.file.filename : null;

  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
    errors.push({ path: 'name', message: 'Project name is required and must be between 3 and 100 characters' });
  }
  if (!organizer || typeof organizer !== 'string' || organizer.trim().length === 0) {
    errors.push({ path: 'organizer', message: 'Organizer is required' });
  }
  // On vérifie que seul l'utilisateur authentifié peut se désigner comme organizer ou avoir les droits spéciaux pour en désigner un autre
  if (req.user.username !== organizer && !req.user.isAdmin) { // Note: isAdmin serait à implémenter dans le système d'auth
    return res.status(403).json({ message: 'Vous ne pouvez créer un projet qu\'en tant qu\'organizer ou administrateur' });
  }
  if (!specFile) {
    errors.push({ path: 'spec', message: 'A valid PDF file is required' });
  }    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // vérification simple de doublon
    const exists = storage.projects.find(p => p.name === name);
    if (exists) return res.status(409).json({ message: 'Doublon de nom de projet' });

    const project = {
      id: storage.nextProjectId++,
      name,
      description: description || '',
      organizer,
      specFile,
      members: [],
      createdAt: new Date().toISOString()
    };
    storage.projects.push(project);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

exports.listProjects = (req, res) => {
  const { q, role, page = 1, size = 10 } = req.query;
  let items = storage.projects.slice();
  if (q) {
    items = items.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (role) {
    items = items.filter(p => p.members.some(m => m.role === role));
  }
  const total = items.length;
  const start = (page - 1) * size;
  const paged = items.slice(start, start + Number(size)).map(p => ({ id: p.id, name: p.name, organizer: p.organizer, membersCount: p.members.length }));
  res.json({ items: paged, page: Number(page), size: Number(size), total });
};

exports.getProject = (req, res) => {
  const id = Number(req.params.projectId);
  const project = storage.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
  res.json({ project });
};

exports.updateProject = (req, res) => {
  const id = Number(req.params.projectId);
  const project = storage.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
  // Simple autorisation: seul l'organizer (username du token) peut modifier
  if (req.user && req.user.username !== project.organizer) return res.status(403).json({ message: 'Action réservée à l\'organizer' });
  const { name, description } = req.body;
  if (name) project.name = name;
  if (description) project.description = description;
  res.json({ project });
};

exports.deleteProject = (req, res) => {
  const id = Number(req.params.projectId);
  const idx = storage.projects.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Projet non trouvé' });
  const project = storage.projects[idx];
  if (req.user && req.user.username !== project.organizer) return res.status(403).json({ message: 'Action réservée à l\'organizer' });
  storage.projects.splice(idx, 1);
  res.status(204).send();
};
