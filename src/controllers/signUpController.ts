import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import bcryptjs from 'bcryptjs';
import errorHandler from '../middlewares/errorHandler';
import { IRecord } from '../interfaces/recordInterface';
import Record from '../models/recordModel';
import { getProfileCode } from '../utils/profileUtils';
import { deleteUser } from '../utils/userUtils';

const SignUpController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const recordFound = await Record.find({
        username: username,
      }).exec();
      if (recordFound.length === 0) {
        const encryptedPassword = await bcryptjs.hash(password, 8);
        const record: IRecord = {
          username: username,
          password: encryptedPassword,
          profile: getProfileCode(),
          enable: true,
        };
        const newRecord: HydratedDocument<IRecord> = new Record(record);
        const recordCreated = await newRecord.save();
        if (recordCreated._id === newRecord._id) {
          res.status(201).json({
            message: {
              severity: 'success',
              summary: 'Done!',
              detail: 'Sign up successfully',
            },
            data: recordCreated._id.toString(),
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
      } else {
        res.status(200).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Record already exists',
          },
          data: null,
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
  changePassword: async (req: Request, res: Response) => {
    try {
      const recordFound = await Record.findById(req.params.id);
      if (recordFound) {
        const { currentPassword, newPassword } = req.body;
        if (currentPassword && newPassword) {
          const allowChange = await bcryptjs.compare(
            currentPassword,
            recordFound.password
          );
          if (allowChange) {
            const encryptedPassword = await bcryptjs.hash(newPassword, 8);
            const record = await Record.findByIdAndUpdate(req.params.id, {
              password: encryptedPassword,
            });
            if (record) {
              res.status(200).json({
                message: {
                  severity: 'success',
                  summary: 'Done!',
                  detail: 'Password changed successfully',
                },
                data: null,
              });
            } else {
              res.status(404).json({
                message: {
                  severity: 'warn',
                  summary: 'Oops!',
                  detail: 'Try again',
                },
                data: null,
              });
            }
          } else {
            res.status(200).json({
              message: {
                severity: 'warn',
                summary: 'Oops!',
                detail: 'Current password wrong',
              },
              data: null,
            });
          }
        } else {
          res.status(401).json({
            message: {
              severity: 'warn',
              summary: 'Oops!',
              detail: 'Unauthorized',
            },
            data: null,
          });
        }
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
  delete: async (req: Request, res: Response) => {
    try {
      const recordDeleted = await Record.findByIdAndDelete(req.params.id);
      if (recordDeleted) {
        await deleteUser(req.params.id);
        res.status(204).json({
          message: {
            severity: 'success',
            summary: 'Done!',
            detail: 'Record deleted',
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
};

export default SignUpController;
