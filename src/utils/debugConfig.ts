import configureDebug from "debug";
import { environment } from "../loadEnvironments.js";

const debugCreator = () => configureDebug(environment.appName);

const debugConfig = debugCreator();

const localDebug = debugConfig.extend("debug-creator");
localDebug("Debug created");

export default debugConfig;
