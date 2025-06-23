// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
      };
    }
  }
} 