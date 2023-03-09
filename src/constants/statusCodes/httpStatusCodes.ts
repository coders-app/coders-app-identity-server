const httpStatusCodes = {
  successCodes: {
    okCode: 200,
    createdCode: 201,
    noContentSuccessCode: 204,
  },

  clientErrors: {
    badRequestCode: 400,
    unauthorizedCode: 401,
    notFoundCode: 404,
    conflictCode: 409,
  },

  serverErrors: {
    internalServerErrorCode: 500,
  },
};

export default httpStatusCodes;
