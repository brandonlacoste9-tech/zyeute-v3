
import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // or string for UUIDs
      user?: any;
    }
  }
}

export {};
