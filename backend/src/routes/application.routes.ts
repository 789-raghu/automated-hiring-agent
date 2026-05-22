import express, { Response, Request } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {});

router.post("/create-application", (req: Request, res: Response) => {});

router.put("/update-application", (req: Request, res: Response) => {});

router.get("/delete-application", (req: Request, res: Response) => {});
