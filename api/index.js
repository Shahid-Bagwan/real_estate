import express from "express";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors'; // Import the cors package
import userRouter from './routes/user.route.js'
import userAuth from './routes/user.auth.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(express.json());
// Use the cors middleware to enable CORS
app.use(cors());
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.use('/api/user', userRouter);
app.use('/api/auth', userAuth);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    return res.status(status).json({ 
        success: false,
        status: status,
        message: error.message 
    });
});

