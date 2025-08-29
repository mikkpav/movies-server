import type { Request, Response } from 'express';

export const getHealthStatus = (_: Request, response: Response) => {
  response.sendStatus(200);
};
