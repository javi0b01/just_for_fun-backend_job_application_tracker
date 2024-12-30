import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import errorHandler from '../middlewares/errorHandler';
import { IApplication } from '../interfaces/applicationInterface';
import Application from '../models/applicationModel';

const ApplicationsController = {
  register: async (req: Request, res: Response) => {
    try {
      console.log('body:', req.body);
      if (
        !req.body.userId ||
        !req.body.job.source ||
        !req.body.company.name ||
        !req.body.application.dateApplied ||
        !req.body.application.response ||
        !req.body.application.position ||
        !req.body.application.model
      ) {
        res.status(400).json({
          message: {
            severity: 'warn',
            summary: 'Oops!',
            detail: 'Missing mandatory information',
          },
          data: null,
        });
        return;
      }
      const application: IApplication = { ...req.body };
      const newApp: HydratedDocument<IApplication> = new Application(
        application
      );
      const appCreated = await newApp.save();
      if (appCreated._id) {
        res.status(201).json({
          message: {
            severity: 'success',
            summary: 'Done!',
            detail: 'New application created',
          },
          data: appCreated._id.toString(),
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
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
  list: async (req: Request, res: Response) => {
    try {
      const allApplications = await Application.find();
      res.status(200).json({
        message: {
          severity: 'success',
          summary: 'Done!',
          detail: 'All applications',
        },
        data: allApplications,
      });
    } catch (error) {
      errorHandler(error, req, res, () => null);
    }
  },
};

export default ApplicationsController;
