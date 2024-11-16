const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required. No token provided or invalid format.' 
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      console.log('Authenticated user:', req.user);
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;

