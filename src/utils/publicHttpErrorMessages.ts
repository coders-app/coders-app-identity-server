const publicHttpErrorMessages = {
  publicSuccessMessages: {
    okMsg: "OK",
    createdMsg: "Created",
  },

  publicClientErrors: {
    publicBadRequestMsg: "blocked by CORS policy",
    publicNotTokenMsg: "No Token provided",
    publicMissingBearerMsg: "Missing Bearer in token",
    publicUnauthorizedMsg: "Unauthorized",
    publicIncorrectPasswordMsg: "Incorrect password",
    publicIncorrectEmailOrPassword: "Incorrect email or password",
    publicUserNotFoundMsg: "User not found",
    publicExistingUserMsg: "User already exists",
    publicInactiveUserMsg: "User is inactive",
    publicEmptyNameMsg: "Name shouldn't be empty",
    publicEmptyEmailMsg: "Email shouldn't be empty",
    publicNotFoundMsg: "Not found",
    publicDuplicateKeyMsg: "Duplicate key",
    publicUnknownEndpointMsg: "Unknown endpoint",
  },

  publicServerErrors: {
    publicInternalServerErrorMsg: "Internal Server Error",
  },
};

export default publicHttpErrorMessages;
