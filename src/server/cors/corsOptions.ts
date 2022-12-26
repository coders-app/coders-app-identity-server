import type { CorsOptions } from "cors";
import { environment } from "../../loadEnvironments";
import CustomError from "../../CustomError/CustomError";
import httpStatusCodes from "../../utils/httpStatusCodes";

const { originWhitelist } = environment;

const {
  clientErrors: { badRequestCode },
} = httpStatusCodes;

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || originWhitelist.includes(requestOrigin)) {
      callback(null, requestOrigin);
      return;
    }

    callback(
      new CustomError(
        `${requestOrigin} blocked by CORS Policy`,
        badRequestCode,
        "Blocked by CORS"
      ),
      requestOrigin
    );
  },
};

export default corsOptions;
