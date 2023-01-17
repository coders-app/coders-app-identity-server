import CustomError from "../CustomError/CustomError";
import httpStatusCodes from "./httpStatusCodes";

const {
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

export const loginErrors = {
  userNotFoundError: new CustomError(
    "User not found",
    unauthorizedCode,
    "your email or password is incorrect, please try again"
  ),

  incorrectPasswordError: new CustomError(
    "Incorrect password",
    unauthorizedCode,
    "your email or password is incorrect, please try again"
  ),
  inactiveUserError: new CustomError(
    "User is inactive",
    unauthorizedCode,
    "User is inactive, contact your administrator if you think this is a mistake"
  ),
};
