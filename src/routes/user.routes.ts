import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUser)
router.get("/", userController.getAll)
router.patch("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)
export default router