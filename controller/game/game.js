import express from "express";
import {
  getUserPoints,
  getRankings,
} from "./gameController.js";
import { requireSignin } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.get("/points/:id", requireSignin, getUserPoints);
router.get("/rankings", requireSignin, getRankings);

export default router;
