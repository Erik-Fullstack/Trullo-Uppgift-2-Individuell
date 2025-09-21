import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";

const router = Router();

router.post("/", taskController.createTask);
router.get("/:id", taskController.getTask)
router.get("/", taskController.getAll)
router.patch("/:id", taskController.updateTask)
export default router