import { Response, Request, NextFunction } from "express";

export interface ControllerRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: "get" | "post" | "delete" | "patch" | "put";
}
