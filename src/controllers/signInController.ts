import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import bcryptjs from 'bcryptjs';
import errorHandler from '../middlewares/errorHandler';
import { IRecord } from '../interfaces/recordInterface';
import Record from '../models/recordModel';
import { getToken } from '../utils/tokenUtils';

const SignInController = {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const recordFound = await Record.findOne({ username });
      if (recordFound) {
        const validPassword = await bcryptjs.compare(
          password,
          recordFound.password
        );
        if (validPassword) {
          const token = await getToken({
            id: recordFound._id.toString(),
          });
          res.status(200).json({
            message: {
              severity: 'success',
              summary: 'Done!',
              detail: 'Sign in successfully',
            },
            data: token,
          });
        } else {
          res.status(200).json({
            message: {
              severity: 'warn',
              summary: 'Oops!',
              detail: 'Username and/or Password invalids',
            },
            data: null,
          });
        }
      } else {
        res.status(404).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Username and/or Password invalids',
          },
          data: null,
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
};

export default SignInController;
