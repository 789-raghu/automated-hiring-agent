import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users.routes";
import { loggerMiddleware } from "./middleware/logger.middleware";

const app = express();
const baseUrl = "/api/v1";

app.use(logger("dev"));

app.use(loggerMiddleware);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

app.use(`${baseUrl}/`, indexRouter);

app.use(`${baseUrl}/users`, usersRouter);

export default app;
