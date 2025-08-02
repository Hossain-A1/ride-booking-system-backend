"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const driver_model_1 = require("../driver/driver.model");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const user_interface_1 = require("../user/user.interface");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const driver_interface_1 = require("../driver/driver.interface");
const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // in kilometers--- help from google
    const degToRad = (deg) => deg * (Math.PI / 180);
    const diffLat = degToRad(lat2 - lat1);
    const diffLon = degToRad(lon2 - lon1);
    const lat1Rad = degToRad(lat1);
    const lat2Rad = degToRad(lat2);
    const a = Math.sin(diffLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(diffLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return Number(distance.toFixed(2));
};
// Calculate fare based on distance
const makeTotalFare = (pickup, destination) => {
    const distance = calculateDistanceInKm(pickup.lat, pickup.lng, destination.lat, destination.lng);
    const baseFare = 50;
    const ratePerKm = 15;
    const totalFare = baseFare + distance * ratePerKm;
    return parseFloat(totalFare.toFixed(2));
};
const bookRide = (payload, decoded) => __awaiter(void 0, void 0, void 0, function* () {
    const rider = yield user_model_1.UserModel.findById(decoded.userId);
    if (!rider) {
        throw new AppError_1.default(404, "Rider not found with the id");
    }
    if (rider.isBlocked) {
        throw new AppError_1.default(404, "Ride not allow for stupid people");
    }
    if (rider.role !== decoded.role) {
        throw new AppError_1.default(403, "You can not book this ride");
    }
    const driver = yield driver_model_1.DriverModel.findOne({ user: payload.driver });
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found with that userModel role DRIVER id ");
    }
    if (driver.isOnline === driver_interface_1.DriverAvailabilityStatus.OFFLINE) {
        throw new AppError_1.default(400, "The Driver is offline right now, try to find another driver.");
    }
    if (driver.isSuspended) {
        throw new AppError_1.default(400, "The Driver is offline right now, try to find another driver.");
    }
    if (driver)
        if (!driver.isApproved) {
            throw new AppError_1.default(400, "This driver is not approved. Please try another driver to get a ride");
        }
    const totalFare = makeTotalFare(payload.pickup, payload.destination);
    const newRide = {
        rider: rider._id,
        driver: driver._id,
        pickup: payload.pickup,
        destination: payload.destination,
        fare: totalFare,
    };
    const createdRide = yield ride_model_1.RideModel.create(newRide);
    return createdRide;
});
const updateRide = (rideId, payload, decoded) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(decoded.userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const ride = yield ride_model_1.RideModel.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(404, "Ride not found");
    }
    //rider can update only status
    if (decoded.role === user_interface_1.UserRole.RIDER && payload.status) {
        if (ride.status === ride_interface_1.RideStatus.ACCEPTED) {
            throw new AppError_1.default(400, "Sorry! You can not cancel the ride, cause this ride has been accepted.");
        }
        const { status } = payload;
        if (status === ride_interface_1.RideStatus.CANCELED) {
            yield ride_model_1.RideModel.findByIdAndUpdate(ride._id, { status }, { new: true, runValidators: true });
        }
        else {
            throw new AppError_1.default(400, "You can not update this status");
        }
        return;
    }
    // ---------------------------------//
    if (decoded.role === user_interface_1.UserRole.DRIVER &&
        ride.driver.toString() !== decoded.userId) {
        throw new AppError_1.default(403, "You are not authorized to update this ride");
    }
    //update driver
    if (payload.driver) {
        const driver = yield driver_model_1.DriverModel.findById(payload.driver);
        if (!driver) {
            throw new AppError_1.default(404, "Driver not found");
        }
        if (!driver.isOnline) {
            throw new AppError_1.default(400, "Driver is offline");
        }
        if (!driver.isApproved) {
            throw new AppError_1.default(400, "Driver is not approved yet.");
        }
        ride.driver = driver._id;
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
            case ride_interface_1.RideStatus.ACCEPTED:
                ride.acceptedAt = now;
                break;
            case ride_interface_1.RideStatus.PICKED_UP:
                ride.pickedUpAt = now;
                break;
            case ride_interface_1.RideStatus.IN_TRANSIT:
                ride.inTransitAt = now;
                break;
            case ride_interface_1.RideStatus.COMPLETED:
                ride.completedAt = now;
                break;
            case ride_interface_1.RideStatus.CANCELED:
                ride.canceledAt = now;
                break;
        }
    }
    // jodi fare extra add kore
    if (typeof payload.fare === "number") {
        ride.fare = payload.fare;
    }
    yield ride.save();
    return ride;
});
const getMyRides = (decoded, query) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decoded.userId;
    const role = decoded.role;
    if (!userId || !role) {
        throw new AppError_1.default(400, "Invalid user data");
    }
    let rides;
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.RideModel.find(), query);
    if (role === user_interface_1.UserRole.RIDER) {
        rides = yield queryBuilder.filter().sort().build();
    }
    else if (role === user_interface_1.UserRole.DRIVER) {
        rides = yield ride_model_1.RideModel.find({ driver: userId })
            .populate("rider", "name phone")
            .sort({ createdAt: -1 });
        const completedRides = rides.filter((ride) => ride.status === ride_interface_1.RideStatus.COMPLETED);
        const totalEarnings = completedRides.reduce((acc, ride) => {
            const fare = typeof ride.fare === "number" ? ride.fare : 0;
            return acc + fare;
        }, 0);
        return {
            rides,
            totalEarnings,
        };
    }
    else {
        throw new AppError_1.default(403, "Only riders and drivers can access this");
    }
    return rides;
});
const getAllRide = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.RideModel.find(), query);
    const rides = queryBuilder.search(["status"]).filter().sort().pagenate();
    const [data, meta] = yield Promise.all([
        rides.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getAllUserRides = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.RideModel.find({ rider: user.userId }), query);
    const rides = queryBuilder.search(["status"]).filter().sort().pagenate();
    const [data, meta] = yield Promise.all([
        rides.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
exports.RideServices = {
    bookRide,
    updateRide,
    getMyRides,
    getAllRide,
    getAllUserRides,
};
