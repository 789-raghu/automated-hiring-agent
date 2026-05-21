import http from "http";
import app from "../src/app";

const PORT = process.env.PORT || 3000;

app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT);

server.on("listening", () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);

    case "EADDRINUSE":
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);

    default:
      throw error;
  }
});