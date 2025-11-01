// Stockage en mémoire (jeu de données initial fourni)
module.exports = {
  projects: [
    {
      id: 1,
      name: "Neptune CRM Revamp",
      description: "Refonte front + API",
      organizer: "Alice Smith",
      specFile: "neptune-crm-spec.pdf",
      members: [
        { id: 101, name: "John Doe", role: "Developer", projectId: 1 },
        { id: 102, name: "Nadia Ben", role: "QA", projectId: 1 },
        { id: 103, name: "Léo Tran", role: "ProductOwner", projectId: 1 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Atlas Mobile v2",
      description: "Refonte UX, offline-first",
      organizer: "Marco Polo",
      specFile: "atlas-mobile-spec.pdf",
      members: [
        { id: 201, name: "Sara Kim", role: "Designer", projectId: 2 }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  nextProjectId: 3,
  nextMemberId: 301
};
