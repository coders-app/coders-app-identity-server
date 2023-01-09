import type { CorsOptions } from "cors";
import { environment } from "../../loadEnvironments.js";
import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../../utils/httpStatusCodes.js";
import httpErrorMessages from "../../utils/httpErrorMessages.js";
import publicHttpErrorMessages from "../../utils/publicHttpErrorMessages.js";

const { originWhitelist } = environment;

const {
  clientErrors: { badRequestCode },
} = httpStatusCodes;
const {
  clientErrors: { badRequestMsg },
} = httpErrorMessages;
const {
  publicClientErrors: { publicBadRequestMsg },
} = publicHttpErrorMessages;

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || originWhitelist.includes(requestOrigin)) {
      callback(null, requestOrigin);
      return;
    }

    callback(
      new CustomError(
        badRequestMsg,
        badRequestCode,
        requestOrigin + publicBadRequestMsg
      ),
      requestOrigin
    );
  },
};

export default corsOptions;
