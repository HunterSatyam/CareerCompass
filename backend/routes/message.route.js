import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessages, sendMessage, editMessage, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getMessages);
router.route("/send").post(isAuthenticated, sendMessage);
router.route("/:id").put(isAuthenticated, editMessage);
router.route("/:id").delete(isAuthenticated, deleteMessage);

export default router;
