const storage = require('../data/storage');

exports.createMember = (req, res) => {
  const projectId = Number(req.params.projectId);
  const { name, role } = req.body;

  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ path: 'name', message: 'Member name is required and must be a non-empty string' });
  }
  if (!role || typeof role !== 'string' || role.trim().length === 0) {
    errors.push({ path: 'role', message: 'Member role is required and must be a non-empty string' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const project = storage.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
  const member = { id: storage.nextMemberId++, name, role, projectId };
  project.members.push(member);
  res.status(201).json({ member });
};

exports.listMembers = (req, res) => {
  const projectId = Number(req.params.projectId);
  const project = storage.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
  res.json({ members: project.members });
};

exports.getMember = (req, res) => {
  const projectId = Number(req.params.projectId);
  const memberId = Number(req.params.memberId);
  const project = storage.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
  const member = project.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ message: 'Membre non trouvé' });
  res.json({ member });
};

exports.updateMember = (req, res) => {
  const projectId = Number(req.params.projectId);
  const memberId = Number(req.params.memberId);
  const project = storage.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

  if (req.user && req.user.username !== project.organizer) {
    return res.status(403).json({ message: "Action réservée à l'organizer" });
  }

  const member = project.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ message: 'Membre non trouvé' });
  const { name, role } = req.body;
  if (name) member.name = name;
  if (role) member.role = role;
  res.json({ member });
};

exports.deleteMember = (req, res) => {
  const projectId = Number(req.params.projectId);
  const memberId = Number(req.params.memberId);
  const project = storage.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

  if (req.user && req.user.username !== project.organizer) {
    return res.status(403).json({ message: "Action réservée à l'organizer" });
  }

  const idx = project.members.findIndex(m => m.id === memberId);
  if (idx === -1) return res.status(404).json({ message: 'Membre non trouvé' });
  project.members.splice(idx, 1);
  res.status(204).send();
};
