import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import errorHandler from '../middlewares/errorHandler';
import { IUser, IUserInfo, IUserList } from '../interfaces/userInterface';
import User from '../models/userModel';
import { getRecord, setUserProfile } from '../utils/recordUtils';
import { getProfileName } from '../utils/profileUtils';

const UsersController = {
  create: async (req: Request, res: Response) => {
    try {
      const recordFound = await getRecord(req.body.recordId);
      if (recordFound) {
        const userFound = await User.find({
          recordId: req.body.recordId,
        });
        if (userFound.length === 0) {
          const user: IUser = {
            ...req.body,
          };
          const newUser: HydratedDocument<IUser> = new User(user);
          const userCreated = await newUser.save();
          if (userCreated._id === newUser._id) {
            await setUserProfile(req.body.recordId);
            res.status(201).json({
              message: 'Got a POST request | new user created',
              id: userCreated._id.toString(),
            });
          } else
            res.status(200).json({
              message: 'Got a POST request | try again',
            });
        } else
          res.status(200).json({
            message: 'Got a POST request | user already exists',
          });
      } else {
        res.status(404).json({
          message: 'Got a POST request | record not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a POST request | error caught');
      });
    }
  },
  readAll: async (req: Request, res: Response) => {
    try {
      const allUsers = await User.find();
      const arr = allUsers.map((user) => {
        const obj: IUserList = {
          id: user._id.toString(),
          nickname: user.nickname || user.firstName,
          image: user.image,
        };
        return obj;
      });
      res
        .status(200)
        .json({ message: 'Got a GET request | all users', data: arr });
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a GET request | error caught');
      });
    }
  },
  read: async (req: Request, res: Response) => {
    try {
      const userFound = await User.findById(req.params.id);
      if (userFound) {
        const recordFound = await getRecord(userFound.recordId);
        if (recordFound) {
          const userInfo: IUserInfo = {
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            nickname: userFound.nickname,
            email: recordFound.username,
            image: userFound.image,
            phone: userFound.phone,
            profile: getProfileName(recordFound.profile),
            enable: recordFound.enable,
            birthDay: userFound.birthDay,
          };
          res.status(200).json({
            message: 'Got a GET request | user info',
            data: userInfo,
          });
        } else {
          res.status(404).json({
            message: 'Got a POST request | record not found',
          });
        }
      } else {
        res.status(404).json({
          message: 'Got a GET request | user not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a GET request | error caught');
      });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      if (req.body.recordId) {
        res.status(401).json({
          message: 'Got a PUT request | unauthorized',
        });
      } else {
        const userFound = await User.findByIdAndUpdate(req.params.id, {
          ...req.body,
        });
        if (userFound) {
          res.status(200).json({
            message: 'Got a PUT request | user updated',
          });
        } else {
          res.status(404).json({
            message: 'Got a PUT request | user not found',
          });
        }
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a PUT request | error caught');
      });
    }
  },
};

export default UsersController;
