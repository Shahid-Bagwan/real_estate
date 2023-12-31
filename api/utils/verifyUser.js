import jwt from 'jsonwebtoken';
import  errorHandler  from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  const tokenFromHeader = req.headers.access_token; 
  const tokenFromCookie = req.cookies.access_token; 
  const token = tokenFromHeader || tokenFromCookie; 
  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.Secretkey, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};