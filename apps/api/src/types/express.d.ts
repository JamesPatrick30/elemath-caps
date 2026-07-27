import "express";

declare module "express" {
  interface user {
    sub: string;
    email: string;
    role: string;
  }

  interface Request {
    user?: User;
  }
}