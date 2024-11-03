import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import bcryptjs from 'bcryptjs';
import errorHandler from '../middlewares/errorHandler';
import { ProfileCodes, ProfileNames } from '../enums/userEnum';
import { IUser, IUserInfo, IUserList } from '../interfaces/userInterface';
import User from '../models/userModel';

const UsersController = {
  create: async (req: Request, res: Response) => {
    try {
      const userFound = await User.find({
        $or: [{ email: req.body.email }, { phone: req.body.phone }],
      });
      if (userFound.length === 0) {
        const { profile, password } = req.body;
        const profileCode =
          profile === ProfileCodes.Admin ? profile : ProfileCodes.User;
        const encryptedPassword = await bcryptjs.hash(password, 8);
        const user: IUser = {
          ...req.body,
          profile: profileCode,
          password: encryptedPassword,
        };
        const newUser: HydratedDocument<IUser> = new User(user);
        const userCreated = await newUser.save();
        if (userCreated._id === newUser._id) {
          res.status(201).json({
            message: 'Got a POST request | new user created',
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
        console.log('Got a POST request | error caught');
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
        console.log('Got a GET request | error caught');
      });
    }
  },
  read: async (req: Request, res: Response) => {
    try {
      const userFound = await User.findById(req.params.userId);
      if (userFound) {
        const userInfo: IUserInfo = {
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          nickname: userFound.nickname,
          email: userFound.email,
          image: userFound.image,
          phone: userFound.phone,
          profile:
            userFound.profile === 100 ? ProfileNames.Admin : ProfileNames.User,
          enable: userFound.enable,
          birthDay: userFound.birthDay,
        };
        res.status(200).json({
          message: 'Got a GET request | user info',
          data: userInfo,
        });
      } else {
        res.status(404).json({
          message: 'Got a GET request | user not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('Got a GET request | error caught');
      });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if (password) {
        res.status(401).json({
          message: 'Got a PUT request | unauthorized',
        });
      } else {
        const { profile } = req.body;
        const profileCode =
          profile === ProfileCodes.Admin ? profile : ProfileCodes.User;
        const userFound = await User.findByIdAndUpdate(req.params.userId, {
          ...req.body,
          profile: profileCode,
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
        console.log('Got a PUT request | error caught');
      });
    }
  },
  updateChunk: async (req: Request, res: Response) => {
    try {
      const userFound = await User.findById(req.params.userId);
      if (userFound) {
        const { currentPassword, newPassword } = req.body;
        if (currentPassword && newPassword) {
          const allowChange = await bcryptjs.compare(
            currentPassword,
            userFound.password
          );
          if (allowChange) {
            const encryptedPassword = await bcryptjs.hash(newPassword, 8);
            const user = await User.findByIdAndUpdate(req.params.userId, {
              password: encryptedPassword,
            });
            if (user) {
              res.status(200).json({
                message: 'Got a PATCH request | password updated',
              });
            } else {
              res.status(404).json({
                message: 'Got a PATCH request | user not found',
              });
            }
          } else {
            res.status(200).json({
              message: 'Got a PATCH request | password not updated',
            });
          }
        } else {
          res.status(401).json({
            message: 'Got a PATCH request | unauthorized',
          });
        }
      } else {
        res.status(404).json({
          message: 'Got a PATCH request | user not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('Got a PATCH request | error caught');
      });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const userDeleted = await User.findByIdAndDelete(req.params.userId);
      if (userDeleted) {
        res.status(204).json({
          message: 'Got a DELETE request | user deleted',
        });
      } else {
        res.status(404).json({
          message: 'Got a DELETE request | user not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.log('Got a DELETE request | error caught');
      });
    }
  },
};

export default UsersController;
