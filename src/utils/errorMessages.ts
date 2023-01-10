const errorMessages = {
  successMessages: {
    okMessage: "OK",
    createdMessage: "Created",
  },

  clientErrors: {
    badRequestMessage: "Bad Request",
    notTokenMessage: "No Token provided",
    missingBearerMessage: "Missing Bearer in token",
    unauthorizedMessage: "Unauthorized",
    incorrectPasswordMessage: "Incorrect password",
    incorrectEmailOrPasswordMessage: "Incorrect email or password",
    userNotFoundMessage: "User not found",
    existingUserMessage: "User already exists",
    inactiveUserMessage: "User is inactive",
    emptyNameMessage: "Name shouldn't be empty",
    emptyEmailMessage: "Email shouldn't be empty",
    notFoundMessage: "Not found",
    duplicateKeyMessage: "Duplicate key",
    unknownEndpointMessage: "Unknown endpoint",
  },

  serverErrors: {
    internalServerErrorMessage: "Internal Server Error",
  },
};

export default errorMessages;
