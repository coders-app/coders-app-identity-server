import CustomError from "../CustomError/CustomError.js";
import httpStatusCodes from "./httpStatusCodes.js";

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
    "duplicate key",
    conflictCode,
    "User already exists"
  ),
  registerGeneralError: new CustomError(
    "Server user error",
    internalServerErrorCode,
    "Error creating a new user"
  ),
  alreadyRegisteredError: new CustomError(
    "User already exists",
    conflictCode,
    "That username is taken"
  ),
  invalidPasswordError: new CustomError(
    "Password invalid",
    conflictCode,
    "The password should have at least 8 characters"
  ),
};
export const userAuthenticationErrors = {
  noTokenError: new CustomError(
    "No Token provided",
    unauthorizedCode,
    "No Token provided"
  ),
  missingBearerError: new CustomError(
    "Missing Bearer in token",
    unauthorizedCode,
    "Missing Bearer in token"
  ),
};
