import express, { Response, Request } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {});

router.post("/create-job", (req: Request, res: Response) => {});

router.put("/update-job", (req: Request, res: Response) => {});

router.delete("/delete-job", (req: Request, res: Response) => {});

export default router;
