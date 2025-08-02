import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { UserRole } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { IDriver } from "./driver.interface";
import { DriverModel } from "./driver.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const requestDriver = async (payload: IDriver, decoded: JwtPayload) => {
  const rider = await UserModel.findById(decoded.userId);

  if (decoded.role !== UserRole.RIDER) {
    throw new AppError(400, "Only user can request");
  }

  if (!rider) {
    throw new AppError(404, "User Not Found with the userId!");
  }

  if (rider.isBlocked) {
    throw new AppError(400, "Blocked user can not be a driver!");
  }

  const isExistDriver = await DriverModel.exists({ user: decoded.userId });

  if (isExistDriver) {
    throw new AppError(400, "You already requested for this role");
  }

  const drData: Partial<IDriver> = {
    ...payload,
    user: decoded.userId,
  };

  const driver = await DriverModel.create(drData);

  return driver;
};

const updateDriver = async (
  payload: IDriver,
  decoded: JwtPayload,
  id: string
) => {
  const driver = await DriverModel.findById(id);

  if (!driver) {
    throw new AppError(404, "Driver not found with the id");
  }

  if (decoded.role === UserRole.RIDER && payload.vehicleInfo) {
    await DriverModel.findByIdAndUpdate(
      driver._id,
      { vehicleInfo: payload.vehicleInfo },
      { new: true, runValidators: true }
    );
    return;
  }

  if (
    decoded.role === UserRole.DRIVER &&
    (payload.isOnline || payload.vehicleInfo)
  ) {
    await DriverModel.findByIdAndUpdate(
      driver._id,
      { isOnline: payload.isOnline, vehicleInfo: payload.vehicleInfo },
      { new: true, runValidators: true }
    );
    return;
  }

  if (decoded.role !== UserRole.ADMIN) {
    throw new AppError(
      403,
      "You are not authorozed person. Only admin can perform this action lol"
    );
  }

  const updatedDr = await DriverModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (driver.isApproved) {
    await UserModel.findByIdAndUpdate(updatedDr?.user, {
      role: UserRole.DRIVER,
    });
  }

  return updatedDr;
};

const getAllDriver = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(DriverModel.find(), query);

  const drivers = queryBuilder.search(["isOnline"]).filter().sort().pagenate();

  const [data, meta] = await Promise.all([
    drivers.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const DriverServices = {
  requestDriver,
  updateDriver,
  getAllDriver,
};
