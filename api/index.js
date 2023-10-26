import express from "express";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'
import userAuth from './routes/user.auth.js'
dotenv.config();

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

app.use('/api/user', userRouter);
app.use('/api/auth', userAuth);

app.listen(3000, () => {
    console.log("Server running on port 3000ss");
});