import { mongoUrl, port } from "./loadEnvironments.js";
import debugCreator from "debug";
import chalk from "chalk";
import { mongo } from "mongoose";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

const debug = debugCreator("users:root");

// eslint-disable-next-line @typescript-eslint/naming-convention
const { MongoServerError } = mongo;

try {
  await startServer(+port);
  debug(chalk.blue(`Server listening on port ${port}`));
  await connectDatabase(mongoUrl);
  debug(chalk.blue("Connected to database"));
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database ${(error as Error).message}`)
    );
  } else {
    debug(chalk.red(`Error with the server ${(error as Error).message}`));
  }
}
