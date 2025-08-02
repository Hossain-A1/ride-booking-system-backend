/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const handleCreateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const user = await UserServices.createUser(body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User role updated Successfully",
      data: user,
    });
  }
);

const handleUpdateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const user = await UserServices.createUser(body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User created Successfully",
      data: user,
    });
  }
);

const handleTakeAction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const id = req.params.id
     await UserServices.takeAction(id,body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Action taken Successfully",
      data: null,
    });
  }
);



const handleGetAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string,string>
    const users = await UserServices.getAllUser(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users returns Successfully",
      data: users.data,
      meta: users.meta,
    });
  }
);




export const UserController ={
  handleCreateUser,
  handleGetAllUser,handleTakeAction,handleUpdateUserRole
}