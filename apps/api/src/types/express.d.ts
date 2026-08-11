import "express";

declare module "express" {
  interface user {
    sub: string;
    email: string;
    role: string;
    classId?: string;
  }

  interface Request {
    user: user;
  }
}