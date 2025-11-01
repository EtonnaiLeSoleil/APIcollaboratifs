const express = require('express');
const projects = require('./projects');
const members = require('./members');

const router = express.Router();

router.use('/projects', projects);
// members router is mounted inside projects routes using projects router

module.exports = router;
