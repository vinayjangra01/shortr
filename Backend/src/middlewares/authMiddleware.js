import {verifyToken} from '../utils/tokenUtils';

export const authenticateToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if(!token)
        {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided"
            })
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}


export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};