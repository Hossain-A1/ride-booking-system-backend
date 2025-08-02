# Ride Booking API

## Project Overview

This is a backend API for a ride booking system (like Uber/Pathao).  
There are three roles: **rider**, **driver**, and **admin**.  
Each role has its own permissions:

- Riders can request and cancel rides and view their ride history.
- Drivers can request to become drivers, set availability, accept rides, update ride status, and view earnings.
- Admins can view all users, approve/suspend drivers, block/unblock users, and see all rides.

Built with **Express.js**, **MongoDB (Mongoose)**, **JWT**, and **passport** (local strategy).

---

## How to Run

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd ride-booking-api
   npm install
   ```

2. **Create a `.env` file** with values like:

   ```env
   PORT=5000
   DB_URL=your_mongodb_connection_string
   NODE_ENV=development

   JWT_ACCESS_SECRET=your_access_secret
   JWT_ACCESS_EXPIRES=1d
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_REFRESH_EXPIRES=30d

   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Admin123!!
   ADMIN_PHONE=+8801XXXXXXXXX

   BCRYPT_SALT_ROUND=10
   EXPRESS_SESSION_SECRET=your_session_secret
   ```

3. **Start the server**

   ```bash
   npm run dev
   ```

   Base API URL: `http://localhost:5000/api/v1`

---

## Authentication & Authorization

- Login uses `passport` local strategy.
- On successful login, access and refresh tokens are issued and set via cookies.
- Protected routes require a valid JWT.
- Role-based access is enforced with middleware like `checkIsAuthorized(UserRole.ADMIN)`.

---

## Routes

### Auth

| Method | Endpoint                     | Description                                       |
| ------ | ---------------------------- | ------------------------------------------------- |
| POST   | `/api/v1/auth/login`         | Login with email/password, sets tokens in cookies |
| POST   | `/api/v1/auth/refresh-token` | Get a new access token using refresh token cookie |

### Users (admin)

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| POST   | `/api/v1/users/register`  | Create a user (with role if needed)     |
| PATCH  | `/api/v1/users/block/:id` | Block or unblock a user (admin only)    |
| GET    | `/api/v1/users`           | List all users (with pagination/filter) |

### Drivers

| Method | Endpoint              | Description                                          |
| ------ | --------------------- | ---------------------------------------------------- |
| POST   | `/api/v1/drivers`     | Request to become a driver (rider submits request)   |
| PATCH  | `/api/v1/drivers/:id` | Update driver (vehicle info, availability, approval) |
| GET    | `/api/v1/drivers`     | List all drivers (search/filter/paginate)            |

### Rides

| Method | Endpoint            | Description                                            |
| ------ | ------------------- | ------------------------------------------------------ |
| POST   | `/api/v1/rides`     | Book a ride                                            |
| PATCH  | `/api/v1/rides/:id` | Update ride (status, cancel, change route/driver/fare) |
| GET    | `/api/v1/rides/me`  | Get current user's rides (rider or driver)             |
| GET    | `/api/v1/rides`     | List all rides (admin or authorized)                   |

---

## Business Logic Summary

### Users

- Roles: `rider`, `driver`, `admin`.
- Admins can block/unblock users.
- Role checks prevent unauthorized access.

### Drivers

- Only a rider can request driver role.
- Driver requests create a driver record; admin approval can change user role to `DRIVER`.
- Drivers can update their online status and vehicle info.
- Suspended, offline, or unapproved drivers cannot be assigned to rides.

### Rides

- Fare is calculated using pickup and destination coordinates (distance formula) with base fare + per-km rate.
- Rider must not be blocked and role must match to book.
- Assigned driver must exist, be online, approved, and not suspended.
- Ride status flow: `ACCEPTED` → `PICKED_UP` → `IN_TRANSIT` → `COMPLETED` / `CANCELED`.
- Riders can cancel only before acceptance.
- Drivers can update only their assigned rides.
- Timestamps are tracked for status changes.
- Completed rides contribute to driver earnings (sum of fares).

### Listing & Filters

- List endpoints use `QueryBuilder` for filtering, sorting, search, and pagination.
- Response includes `meta` with paging info.

---

## Response Format Example

```json
{
  "success": true,
  "message": "Driver returns Successfully",
  "data": [
    /* items */
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

## Error Handling

- `400` – Bad request / invalid input
- `403` – Forbidden (role or permission issue)
- `404` – Not found
- `500` – Server error

Errors are thrown using a centralized `AppError` pattern with clear messages.

---

---

## Scripts

```bash
npm run dev    # development mode
npm start      # production start
```

---

## Notes

- Passwords are hashed with bcrypt.
- JWT access and refresh tokens used; refresh endpoint provides new access token.
- Do not commit the `.env` file; add it to `.gitignore`.
