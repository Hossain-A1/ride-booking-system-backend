import passport from "passport";
import bcryptjs from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../modules/user/user.model";
//local login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await UserModel.findOne({ email });

        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }

        // if (!isUserExist.isVerified) {
        //   return done("User is not verified");
        // }

        if (isUserExist.isBlocked) {
          return done("User is blocked");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObj) => providerObj.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(
            "You have authenticated through Google. Please login with Google!"
          );
        }

        const isPasswordMatche = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatche) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);
