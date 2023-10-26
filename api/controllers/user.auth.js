import User from '../models/user.models.js'
import bcrypt from 'bcrypt';

const signup = async (req,res,next) => {
    const {username, email, password} = req.body;
    
    // Generate a random salt.
    const salt = bcrypt.genSaltSync(10);
    const hashpassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({username, email, password: hashpassword});
    try{
        await newUser.save();
        res.status(201).json('user created sucessfully');
    }catch(err){
        next(err);
    }
}

export default signup;