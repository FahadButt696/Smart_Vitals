import express from "express";
import { 
  addSleep, 
  getSleep, 
  getSleepStats, 
  updateSleep, 
  deleteSleep 
} from "../controllers/sleepController.js";

const router = express.Router();

// Sleep log routes
router.post("/", addSleep);                    // POST /api/sleep
router.get("/", getSleep);                     // GET /api/sleep?userId=...
router.get("/stats", getSleepStats);           // GET /api/sleep/stats?userId=...
router.put("/:id", updateSleep);               // PUT /api/sleep/:id
router.delete("/:id", deleteSleep);            // DELETE /api/sleep/:id

export default router;
