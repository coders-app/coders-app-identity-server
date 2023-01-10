const publicErrorMessages = {
  publicSuccessMessages: {
    okMessage: "OK",
    createdMessage: "Created",
  },

  publicClientErrors: {
    publicBadRequestMessage: "blocked by CORS policy",
    publicNotTokenMessage: "No Token provided",
    publicMissingBearerMessage: "Missing Bearer in token",
    publicUnauthorizedMessage: "Unauthorized",
    publicIncorrectPasswordMessage: "Incorrect password",
    publicIncorrectEmailOrPassword: "Incorrect email or password",
    publicUserNotFoundMessage: "User not found",
    publicExistingUserMessage: "User already exists",
    publicInactiveUserMessage: "User is inactive",
    publicEmptyNameMessage: "Name shouldn't be empty",
    publicEmptyEmailMessage: "Email shouldn't be empty",
    publicNotFoundMessage: "Not found",
    publicDuplicateKeyMessage: "Duplicate key",
    publicUnknownEndpointMessage: "Unknown endpoint",
  },

  publicServerErrors: {
    publicInternalServerErrorMessage: "Internal Server Error",
  },
};

export default publicErrorMessages;
