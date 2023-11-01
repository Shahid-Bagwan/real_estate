import bcrypt from "bcrypt";
import User from '../models/user.models.js';
import  errorHandler  from '../utils/error.js';
export const test = (req, res) =>{
    res.json({
        message: 'hello world',
    })
    
};
export const updateUser = async (req, res, next) => {
  console.log("updateUser");
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePic: req.body.profilePic,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };