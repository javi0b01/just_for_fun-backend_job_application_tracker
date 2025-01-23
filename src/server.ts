import express, { Application, Request, Response } from 'express';
import applicationRouter from './routers/applicationsRouter';
import signInRouter from './routers/signInRouter';
import signUpRouter from './routers/signUpRouter';
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
server.use(express.static('public'));
server.use('/api/applications/', applicationRouter);
server.use('/api/sign-in/', signInRouter);
server.use('/api/sign-up/', signUpRouter);
server.use('/api/users/', userRouter);

server.get('/', (req: Request, res: Response) => {
  //console.info(req);
  res.json({ message: 'Works!' });
});

export default server;
