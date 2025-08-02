/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { DriverServices } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";

const handleRequestDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    const decodedUser = req.user as JwtPayload;
    const driver = await DriverServices.requestDriver(user, decodedUser);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Driver request sent Successfully",
      data: driver,
    });
  }
);
const handleUpdateDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.body;
    const decodedUser = req.user as JwtPayload;
    const driver = await DriverServices.updateDriver(user, decodedUser, id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver updated Successfully",
      data: driver,
    });
  }
);
const handleGetAllDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const drivers = await DriverServices.getAllDriver(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver returns Successfully",
      data: drivers.data,
      meta: drivers.meta,
    });
  }
);

export const DriverController = {
  handleRequestDriver,
  handleUpdateDriver,
  handleGetAllDriver,
};
