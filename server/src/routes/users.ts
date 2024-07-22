import express from "express";
import { upload } from "../middlewares/multer";
import * as UserController from "../controllers/users";

const router = express.Router();

router.get("/", UserController.currentUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/toggleLike", UserController.toggleLike);

router.get("/likedSongs", UserController.fetchLikedSongs);

router.get("/search", UserController.searchUsers);

router.post(
  "/update/:userId",
  upload.single("image"),
  UserController.updateUser
);

router.delete("/delete/:userId", UserController.deleteUser);

export default router;
