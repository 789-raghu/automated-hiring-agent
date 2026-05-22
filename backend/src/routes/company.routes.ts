import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {});

router.post("/create-company", (req: Request, res: Response) => {});

router.post("/update-company", (req: Request, res: Response) => {});

router.delete("/delete-company", (req: Request, res: Response) => {});

export default router;
