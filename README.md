# project-api (TP)

API minimal pour gérer des projets et leurs membres.

Points importants pour débutants :
- Démarrer : `node server.js` (ou `npm run dev` après `npm install` si nodemon installé)
- Obtenir un token : POST /auth/login avec `{ "username": "alice.smith" }` → renvoie `{ token }`
- Créer un projet : POST /api/projects (multipart/form-data) champs `name`, `description`, `organizer`, fichier `spec` (PDF)
- Routes :
  - GET /api/projects
  - GET /api/projects/:projectId
  - PUT /api/projects/:projectId
  - DELETE /api/projects/:projectId
  - POST /api/projects/:projectId/members
  - GET /api/projects/:projectId/members

Stockage : en mémoire dans `data/storage.js`.

N.B. : c'est une base pédagogique, simple à lire et modifier pour apprendre Node.js + Express.
