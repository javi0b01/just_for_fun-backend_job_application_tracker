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
            message: 'Got a POST request | sign up successfuly',
            id: recordCreated._id.toString(),
          });
        } else
          res.status(200).json({
            message: 'Got a POST request | try again',
          });
      } else {
        res.status(200).json({
          message: 'Got a POST request | record already exists',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a POST request | error caught');
      });
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
                message: 'Got a PATCH request | password changed',
              });
            } else {
              res.status(404).json({
                message: 'Got a PATCH request | try again',
              });
            }
          } else {
            res.status(200).json({
              message:
                'Got a PATCH request | current password wrong, password not changed',
            });
          }
        } else {
          res.status(401).json({
            message: 'Got a PATCH request | unauthorized',
          });
        }
      } else {
        res.status(404).json({
          message: 'Got a PATCH request | record not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a PATCH request | error caught');
      });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const recordDeleted = await Record.findByIdAndDelete(req.params.id);
      if (recordDeleted) {
        await deleteUser(req.params.id);
        res.status(204).json({
          message: 'Got a DELETE request | record deleted',
        });
      } else {
        res.status(404).json({
          message: 'Got a DELETE request | record not found',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a DELETE request | error caught');
      });
    }
  },
};

export default SignUpController;
