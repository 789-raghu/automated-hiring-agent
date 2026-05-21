import http from "http";
import app from "../src/app";
import DBConnect from "../src/config/database";
import logger from "../src/config/logger";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT);

server.on("listening", async () => {
  await DBConnect();
  logger.info(`Server running on port ${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      logger.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);

    case "EADDRINUSE":
      logger.error(`Port ${PORT} is already in use`);
      process.exit(1);

    default:
      throw error;
  }
});