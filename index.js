import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import authRoutes from './Routes/auth.js';
import userRoutes from './Routes/users.js';
import postRoutes from './Routes/posts.js';
import commentRoutes from './Routes/comments.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000 ;


app.use(mongoSanitize({
  replaceWith: '-'
}));



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(cookieParser())
app.use(helmet());
app.use(morgan('common'));


app.use('/auth' , authRoutes);
app.use('/user' , userRoutes);
app.use('/post' , postRoutes);
app.use('/post' , commentRoutes);

app.use(express.static('public'));






mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
