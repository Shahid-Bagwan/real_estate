import jwt from 'jsonwebtoken';
import  errorHandler  from '../utils/error.js';
import cookie from 'cookie';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.Secretkey, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};