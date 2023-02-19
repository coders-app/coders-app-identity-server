import { environment } from "./loadEnvironments.js";
import debugConfig from "./utils/debugConfig/debugConfig.js";
import chalk from "chalk";
import { mongo } from "mongoose";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";
import type CustomError from "./CustomError/CustomError.js";

const debug = debugConfig.extend("root");

// eslint-disable-next-line @typescript-eslint/naming-convention
const { MongoServerError } = mongo;

const { port, mongoDbUrl } = environment;

try {
  await startServer(port);
  debug(chalk.blue(`Server listening on port ${port}`));

  await connectDatabase(mongoDbUrl);
  debug(chalk.blue("Connected to database"));
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database: ${(error as Error).message}`)
    );
    process.exit(1);
  }

  if ((error as CustomError).code === "EADDRINUSE") {
    debug(chalk.red(`Error with the server: port ${port} in use`));
    process.exit(1);
  }

  debug(chalk.red(`Error with the server: ${(error as Error).message}`));
  process.exit(1);
}
