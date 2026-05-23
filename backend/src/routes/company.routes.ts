import express from "express";
import {
  getCompanyById,
  getComapanies,
  createCompany,
  deleteCompany,
  updateCompany,
} from "../controllers/company.controller";

const router = express.Router();

router.get("/", getComapanies);

router.get("/:id", getCompanyById);

router.post("/create-company", createCompany);

router.patch("/update-company", updateCompany);

router.delete("/delete-company", deleteCompany);

export default router;
