const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret-for-tp';
const EXPIRES_IN = '1h';

exports.signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

exports.verifyToken = (token) => jwt.verify(token, SECRET);
