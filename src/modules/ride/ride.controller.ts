/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { RideServices } from "./ride.service";

const handleBookRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const payload = req.body;
    const ride = await RideServices.bookRide(payload, decoded);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Ride Booked Successfully",
      data: ride,
    });
  }
);

const handleUpdateRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const payload = req.body;
    const decoded = req.user as JwtPayload;

    const updatedRide = await RideServices.updateRide(rideId, payload, decoded);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride updated successfully",
      data: updatedRide,
    });
  }
);

const handleGetMyRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const query = req.query as Record<string, string>;

    const rides = await RideServices.getMyRides(decoded, query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single ride return successfully",
      data: rides,
    });
  }
);

const handleGetAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const rides = await RideServices.getAllRide(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All ride return successfully",
      data: rides.data,
      meta: rides.meta,
    });
  }
);

const handleGetUserRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const user = req.user as JwtPayload;
    const rides = await RideServices.getAllUserRides(user, query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All ride return successfully",
      data: rides.data,
      meta: rides.meta,
    });
  }
);

export const RideController = {
  handleBookRide,
  handleUpdateRide,
  handleGetMyRides,
  handleGetAllRides,
  handleGetUserRides,
};
