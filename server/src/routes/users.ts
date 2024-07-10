import express from "express";
import * as UserController from "../controllers/users";
import { auhteticateUser } from "../utils/auth";

const router = express.Router();

router.get("/", UserController.currentUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
