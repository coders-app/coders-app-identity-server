import configureDebug from "debug";
import { environment } from "../../loadEnvironments.js";

const debugConfig = configureDebug(environment.appName);

const debug = debugConfig.extend("debug-creator");
debug("Debug created");

export default debugConfig;
