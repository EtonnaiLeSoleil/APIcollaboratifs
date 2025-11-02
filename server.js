// Serveur Express minimal et simple (débutant-friendly)
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const pages = require('./routes/pages');
const { signToken } = require('./utils/jwt');
const multer = require('multer');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Statically serve the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err); // For debugging purposes

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }

  if (err.message === 'Seuls les PDF sont acceptés') {
    return res.status(415).json({ message: 'Invalid file type. Only PDF files are allowed.' });
  }

  // Default to 500 server error
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
