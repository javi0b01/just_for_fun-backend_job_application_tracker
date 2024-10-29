import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/userModel';
import { IUser } from '../interfaces/userInterface';
import errorHandler from '../middlewares/errorHandler';

const UsersController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await User.find({
        $or: [{ email: req.body.email }, { phone: req.body.phone }],
      });
      if (user.length === 0) {
        const { password } = req.body;
        const encryptedPassword = await bcryptjs.hash(password, 8);
        const newUser: HydratedDocument<IUser> = new User({
          ...req.body,
          password: encryptedPassword,
        });
        const userCreated = await newUser.save();
        if (userCreated._id === newUser._id) {
          res.status(201).json({
            message: 'new user created',
            id: userCreated._id.toString(),
          });
        } else
          res.status(200).json({
            message: 'try again',
          });
      } else
        res.status(200).json({
          message: 'user already exists',
        });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
  readAll: (req: Request, res: Response) => {
    try {
      res.json({ message: 'Got a GET request' });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
  read: (req: Request, res: Response) => {
    try {
      res.json({
        message: `Got a GET request, userId: ${req.params.userId}`,
      });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
  update: (req: Request, res: Response) => {
    try {
      res.json({ message: `Got a PUT request, userId: ${req.params.userId}` });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
  updateChunk: (req: Request, res: Response) => {
    try {
      res.json({
        message: `Got a PATCH request, userId: ${req.params.userId}`,
      });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
  delete: (req: Request, res: Response) => {
    try {
      res.json({
        message: `Got a DELETE request, userId: ${req.params.userId}`,
      });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('error caught');
      });
    }
  },
};

export default UsersController;
