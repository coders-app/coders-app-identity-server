const httpStatusCodes = {
  successCodes: {
    okCode: 200,
    createdCode: 201,
  },

  clientErrors: {
    notFoundCode: 404,
    badRequestCode: 400,
  },

  serverErrors: {
    internalServerErrorCode: 500,
  },
};

export default httpStatusCodes;
