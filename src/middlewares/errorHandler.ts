import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    message: {
      severity: 'error',
      summary: 'An error occurred',
      detail: 'Something broke, error caught!',
    },
    data: err.stack,
  });
};

export default errorHandler;
