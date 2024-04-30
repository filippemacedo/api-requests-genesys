import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../utils/customErrors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  console.log(err)

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  if (err instanceof BadRequestError) {
    statusCode = StatusCodes.BAD_REQUEST
  }

  if (err instanceof NotFoundError) {
    statusCode = StatusCodes.NOT_FOUND
  }

  res.status(statusCode).json({
    message: err.message
  })

}