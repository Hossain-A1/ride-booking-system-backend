import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { DriverModel } from "../driver/driver.model";
import { UserModel } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { RideModel } from "./ride.model";
import { UserRole } from "../user/user.interface";
import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { DriverAvailabilityStatus } from "../driver/driver.interface";

const calculateDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const earthRadius = 6371; // in kilometers--- help from google

  const degToRad = (deg: number) => deg * (Math.PI / 180);

  const diffLat = degToRad(lat2 - lat1);
  const diffLon = degToRad(lon2 - lon1);

  const lat1Rad = degToRad(lat1);
  const lat2Rad = degToRad(lat2);

  const a =
    Math.sin(diffLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(diffLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return Number(distance.toFixed(2));
};

// Calculate fare based on distance
const makeTotalFare = (
  pickup: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number => {
  const distance = calculateDistanceInKm(
    pickup.lat,
    pickup.lng,
    destination.lat,
    destination.lng
  );

  const baseFare = 50;
  const ratePerKm = 15;

  const totalFare = baseFare + distance * ratePerKm;

  return parseFloat(totalFare.toFixed(2));
};

const bookRide = async (payload: IRide, decoded: JwtPayload) => {
  const rider = await UserModel.findById(decoded.userId);

  if (!rider) {
    throw new AppError(404, "Rider not found with the id");
  }
  if (rider.isBlocked) {
    throw new AppError(404, "Ride not allow for stupid people");
  }

  if (rider.role !== decoded.role) {
    throw new AppError(403, "You can not book this ride");
  }

  const driver = await DriverModel.findOne({ user: payload.driver });

  if (!driver) {
    throw new AppError(
      404,
      "Driver not found with that userModel role DRIVER id "
    );
  }

  if (driver.isOnline === DriverAvailabilityStatus.OFFLINE) {
    throw new AppError(
      400,
      "The Driver is offline right now, try to find another driver."
    );
  }
  if (driver.isSuspended) {
    throw new AppError(
      400,
      "The Driver is offline right now, try to find another driver."
    );
  }

  if (driver)
    if (!driver.isApproved) {
      throw new AppError(
        400,
        "This driver is not approved. Please try another driver to get a ride"
      );
    }

  const totalFare = makeTotalFare(payload.pickup, payload.destination);

  const newRide = {
    rider: rider._id,
    driver: driver._id,
    pickup: payload.pickup,
    destination: payload.destination,
    fare: totalFare,
  };

  const createdRide = await RideModel.create(newRide);

  return createdRide;
};

const updateRide = async (
  rideId: string,
  payload: Partial<IRide>,
  decoded: JwtPayload
) => {
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const ride = await RideModel.findById(rideId);
  if (!ride) {
    throw new AppError(404, "Ride not found");
  }

  //rider can update only status
  if (decoded.role === UserRole.RIDER && payload.status) {
    if (ride.status === RideStatus.ACCEPTED) {
      throw new AppError(
        400,
        "Sorry! You can not cancel the ride, cause this ride has been accepted."
      );
    }

    const { status } = payload;

    if (status === RideStatus.CANCELED) {
      await RideModel.findByIdAndUpdate(
        ride._id,
        { status },
        { new: true, runValidators: true }
      );
    } else {
      throw new AppError(400, "You can not update this status");
    }

    return;
  }

  // ---------------------------------//

  if (
    decoded.role === UserRole.DRIVER &&
    ride.driver.toString() !== decoded.userId
  ) {
    throw new AppError(403, "You are not authorized to update this ride");
  }
  //update driver
  if (payload.driver) {
    const driver = await DriverModel.findById(payload.driver);
    if (!driver) {
      throw new AppError(404, "Driver not found");
    }
    if (!driver.isOnline) {
      throw new AppError(400, "Driver is offline");
    }

    if (!driver.isApproved) {
      throw new AppError(400, "Driver is not approved yet.");
    }
    ride.driver = driver._id as Types.ObjectId;
  }

  if (payload.pickup) {
    ride.pickup = payload.pickup;
  }
  if (payload.destination) {
    ride.destination = payload.destination;
  }
  if (payload.pickup || payload.destination) {
    ride.fare = makeTotalFare(ride.pickup, ride.destination);
  }

  // Update status
  if (payload.status) {
    ride.status = payload.status;
    const now = new Date();
    switch (payload.status) {
      case RideStatus.ACCEPTED:
        ride.acceptedAt = now;
        break;
      case RideStatus.PICKED_UP:
        ride.pickedUpAt = now;
        break;
      case RideStatus.IN_TRANSIT:
        ride.inTransitAt = now;
        break;
      case RideStatus.COMPLETED:
        ride.completedAt = now;
        break;
      case RideStatus.CANCELED:
        ride.canceledAt = now;
        break;
    }
  }

  // jodi fare extra add kore
  if (typeof payload.fare === "number") {
    ride.fare = payload.fare;
  }

  await ride.save();

  return ride;
};

const getMyRides = async (decoded: JwtPayload,query:Record<string,string>) => {
  const userId = decoded.userId;
  const role = decoded.role;
  if (!userId || !role) {
    throw new AppError(400, "Invalid user data");
  }

  let rides;

  const queryBuilder =new QueryBuilder(RideModel.find(),query)

  if (role === UserRole.RIDER) {
    rides = await queryBuilder.filter().sort().build()
  } else if (role === UserRole.DRIVER) {
    rides = await RideModel.find({ driver: userId })
      .populate("rider", "name phone")
      .sort({ createdAt: -1 });

    const completedRides = rides.filter(
      (ride) => ride.status === RideStatus.COMPLETED
    );

    const totalEarnings = completedRides.reduce((acc, ride) => {
      const fare = typeof ride.fare === "number" ? ride.fare : 0;
      return acc + fare;
    }, 0);

    return {
      rides,
      totalEarnings,
    };
  } else {
    throw new AppError(403, "Only riders and drivers can access this");
  }

  return rides;
};

const getAllRide = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(RideModel.find(), query);

  const rides = queryBuilder.search(["status"]).filter().sort().pagenate();

  const [data, meta] = await Promise.all([
    rides.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getAllUserRides = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  const queryBuilder = new QueryBuilder(
    RideModel.find({ rider: user.userId }),
    query
  );

  const rides = queryBuilder.search(["status"]).filter().sort().pagenate();

  const [data, meta] = await Promise.all([
    rides.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const RideServices = {
  bookRide,
  updateRide,
  getMyRides,
  getAllRide,
  getAllUserRides,
};
