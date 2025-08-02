import bcrypt from "bcryptjs";
import { ENV } from "../../config/env.config";
import { IAuthProvider, IUser} from "./user.interface";
import { UserModel } from "./user.model";
import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";

//create user service
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(ENV.BCRYPT_SALT_ROUND)
  );

  const authsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await UserModel.create({
    email,
    password: hashPassword,
    auths: [authsProvider],
    ...rest,
  });

  return user;
};

const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(UserModel.find(), query);

  const users = queryBuilder.search(["name", "role"]).filter().sort().pagenate();

  const [data, meta] = await Promise.all([
    users.build().select("-password"),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const takeAction = async (id: string, payload: Partial<IUser>) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(404, "User not found with the id");
  }

  if (!payload.isBlocked) {
    throw new AppError(400, "Please provide isBlocked field ");
  }

   await UserModel.findByIdAndUpdate(
    id,
    { isBlocked: payload.isBlocked },
    { new: true }
  );

};

export const UserServices = {
  createUser,
  getAllUser,
  takeAction,
};
