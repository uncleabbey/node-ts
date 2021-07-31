import { Response } from 'express';

type errorType = {
  res: Response;
  status: number;
  error: unknown;
};
const errorResponse = ({ res, status, error }: errorType): Response => {
  res.status(status);
  return res.json({
    status: 'error',
    error,
  });
};

export default errorResponse;
