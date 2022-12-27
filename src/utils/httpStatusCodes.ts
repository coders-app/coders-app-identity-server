const httpStatusCodes = {
  successCodes: {
    okCode: 200,
    createdCode: 201,
  },

  clientErrors: {
    badRequestCode: 400,
    notFoundCode: 404,
    conflictCode: 409,
  },

  serverErrors: {
    internalServerErrorCode: 500,
  },
};

export default httpStatusCodes;
