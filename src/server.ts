import express, { Application, Request, Response } from 'express';
import signUpRouter from './routers/signUpRouter';
import signInRouter from './routers/signInRouter';
import userRouter from './routers/usersRouter';

const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const server: Application = express();

server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(fileUpload());
server.use('/api/sign-up/', signUpRouter);
server.use('/api/sign-in/', signInRouter);
server.use('/api/users/', userRouter);

server.get('/', (req: Request, res: Response) => {
  //console.info(req);
  res.json({ message: 'Works!' });
});

export default server;
