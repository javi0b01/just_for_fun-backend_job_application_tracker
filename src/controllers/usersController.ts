import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import fse from 'fs-extra';
import errorHandler from '../middlewares/errorHandler';
import { IUser, IUserInfo, IUserList } from '../interfaces/userInterface';
import User from '../models/userModel';
import { getRecord, setUserProfile } from '../utils/recordUtils';
import { getProfileName } from '../utils/profileUtils';

const UsersController = {
  create: async (req: any, res: Response) => {
    try {
      if (!req.body.recordId) {
        res.status(400).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Record is mandatory',
          },
          data: null,
        });
        return;
      }
      if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Image is mandatory',
          },
          data: null,
        });
        return;
      }
      const recordFound = await getRecord(req.body.recordId);
      if (recordFound) {
        const userFound = await User.find({
          recordId: req.body.recordId,
        });
        if (userFound.length === 0) {
          const image = req.files.image;
          const prefix = Date.now() + '0x0' + Math.round(Math.random() * 1e9);
          const uploadPath = `public/uploads/${prefix}-${image.name}`;
          image.mv(uploadPath, async function (err: any) {
            if (err) {
              res.status(200).json({
                message: {
                  severity: 'warn',
                  summary: 'Oops!',
                  detail: 'An error occurred while uploading the image',
                },
                data: null,
              });
            } else {
              const user: IUser = {
                ...req.body,
                image: uploadPath,
              };
              const newUser: HydratedDocument<IUser> = new User(user);
              const userCreated = await newUser.save();
              if (userCreated._id === newUser._id) {
                await setUserProfile(req.body.recordId);
                res.status(201).json({
                  message: {
                    severity: 'success',
                    summary: 'Done!',
                    detail: 'New user created',
                  },
                  data: userCreated._id.toString(),
                });
              } else
                res.status(200).json({
                  message: {
                    severity: 'warn',
                    summary: 'Oops!',
                    detail: 'Try again',
                  },
                  data: null,
                });
            }
          });
        } else
          res.status(200).json({
            message: {
              severity: 'warn',
              summary: 'Oops!',
              detail: 'User already exists',
            },
            data: null,
          });
      } else {
        res.status(404).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Record not found',
          },
          data: null,
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => null);
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
      res.status(200).json({
        message: {
          severity: 'success',
          summary: 'Done!',
          detail: 'All users',
        },
        data: arr,
      });
    } catch (error) {
      errorHandler(error, req, res, () => null);
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
            message: {
              severity: 'success',
              summary: 'Done!',
              detail: 'User info',
            },
            data: userInfo,
          });
        } else {
          res.status(404).json({
            message: {
              severity: 'warn',
              summary: 'Oops!',
              detail: 'Record not found',
            },
            data: null,
          });
        }
      } else {
        res.status(404).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'User not found',
          },
          data: null,
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      if (req.body.recordId) {
        res.status(401).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Unauthorized',
          },
          data: null,
        });
      } else {
        const userFound = await User.findByIdAndUpdate(req.params.id, {
          ...req.body,
        });
        if (userFound) {
          res.status(200).json({
            message: {
              severity: 'success',
              summary: 'Done!',
              detail: 'User updated',
            },
            data: null,
          });
        } else {
          res.status(404).json({
            message: {
              severity: 'warn',
              summary: 'Oops!',
              detail: 'User not found',
            },
            data: null,
          });
        }
      }
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
};

export default UsersController;
