import { Response } from 'express';

type success = {
  res: Response;
  message: string;
  status: number;
  data?: unknown;
};
const successResponse = ({ res, status, data, message }: success): Response => {
  res.status(status);
  return res.json({
    status: 'success',
    message,
    data,
  });
};

export default successResponse;
