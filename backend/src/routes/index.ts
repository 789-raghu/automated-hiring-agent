import express, { Request, Response, NextFunction } from "express";
import userRouter from "./users";

const router = express.Router();

router.use("/", userRouter);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("index", { title: "Express" });
});

export default router;