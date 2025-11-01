// Serveur Express minimal et simple (débutant-friendly)
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const pages = require('./routes/pages');
const { signToken } = require('./utils/jwt');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Pug view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Point simple pour obtenir un token (exemple pédagogique)
app.post('/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'username requis' });
  const token = signToken({ username });
  res.json({ token });
});

// Pages (Pug views)
app.use('/', pages);

// API routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
