import "../loadEnvironments.js";
import app from "./app.js";

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (error) => {
      reject(error);
    });
  });

export default startServer;
