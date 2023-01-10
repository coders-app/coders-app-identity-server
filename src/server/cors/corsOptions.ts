import type { CorsOptions } from "cors";
import { environment } from "../../loadEnvironments.js";
import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../../utils/httpStatusCodes.js";
import errorMessages from "../../utils/errorMessages.js";
import publicErrorMessages from "../../utils/publicErrorMessages.js";

const { originWhitelist } = environment;

const {
  clientErrors: { badRequestCode },
} = httpStatusCodes;
const {
  clientErrors: { badRequestMessage },
} = errorMessages;
const {
  publicClientErrors: { publicBadRequestMessage },
} = publicErrorMessages;

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || originWhitelist.includes(requestOrigin)) {
      callback(null, requestOrigin);
      return;
    }

    callback(
      new CustomError(
        badRequestMessage,
        badRequestCode,
        requestOrigin + publicBadRequestMessage
      ),
      requestOrigin
    );
  },
};

export default corsOptions;
