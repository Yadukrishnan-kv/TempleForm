const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token missing from Authorization header');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: error.message });
    }
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};


