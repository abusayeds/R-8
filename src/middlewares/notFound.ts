/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response) => {
  throw new AppError(httpStatus.NOT_FOUND, `Route Not Found for ${req.originalUrl}`)
  
};

export default notFound;
