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
        const allowChange = await bcryptjs.compare(
          password,
          recordFound.password
        );
        if (allowChange) {
          const token = await getToken({
            id: recordFound._id.toString(),
          });
          res.status(200).json(token);
        } else {
          res.status(200).json({
            message: 'Got a POST request | username and/or password invalids',
          });
        }
      } else {
        res.status(404).json({
          message: 'Got a POST request | username and/or password invalids',
        });
      }
    } catch (error) {
      errorHandler(error, req, res, () => {
        console.warn('Got a POST request | error caught');
      });
    }
  },
};

export default SignInController;
