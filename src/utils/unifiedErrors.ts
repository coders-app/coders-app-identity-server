import CustomError from "../CustomError/CustomError";
import httpStatusCodes from "./httpStatusCodes";

const {
  clientErrors: { conflictCode, unauthorizedCode },
  serverErrors: { internalServerErrorCode },
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
export const registerErrors = {
  duplicateKeyError: new CustomError(
    "Duplicate key",
    conflictCode,
    "User already exists"
  ),
  registerGeneralError: new CustomError(
    "Server user error",
    internalServerErrorCode,
    "Error creating a new user"
  ),
  alreadyRegisteredError: new CustomError(
    "Existing user",
    conflictCode,
    "That username is taken"
  ),
  invalidPasswordError: new CustomError(
    "Password invalid",
    conflictCode,
    "The password should have at least 8 characters"
  ),
};
