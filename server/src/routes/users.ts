import express from "express";
import * as UserController from "../controllers/users";

const router = express.Router();

router.get("/", UserController.currentUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/toggleLike", UserController.toggleLike);

router.get("/likedSongs", UserController.fetchLikedSongs);

router.get("/search", UserController.searchUsers);

export default router;
