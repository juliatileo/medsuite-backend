import { NextFunction, Request, Response } from "express";

import { HttpError } from "@core/types/error";

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const admin = req.session?.admin;

  if (!admin) {
    throw new HttpError("User is not admin", 400);
  }

  return next();
}
