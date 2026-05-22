import express, { Response, Request } from "express";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {});

router.post("/login", (req: Request, res: Response) => {});

router.post("/logout", (req: Request, res: Response) => {});

export default router;
