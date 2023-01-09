const httpErrorMessages = {
  successMessages: {
    okMsg: "OK",
    createdMsg: "Created",
  },

  clientErrors: {
    badRequestMsg: "Bad Request",
    notTokenMsg: "No Token provided",
    missingBearerMsg: "Missing Bearer in token",
    unauthorizedMsg: "Unauthorized",
    incorrectPasswordMsg: "Incorrect password",
    incorrectEmailOrPassword: "Incorrect email or password",
    userNotFoundMsg: "User not found",
    existingUserMsg: "User already exists",
    inactiveUserMsg: "User is inactive",
    emptyNameMsg: "Name shouldn't be empty",
    emptyEmailMsg: "Email shouldn't be empty",
    notFoundMsg: "Not found",
    duplicateKeyMsg: "Duplicate key",
    unknownEndpointMsg: "Unknown endpoint",
  },

  serverErrors: {
    internalServerErrorMsg: "Internal Server Error",
  },
};

export default httpErrorMessages;
