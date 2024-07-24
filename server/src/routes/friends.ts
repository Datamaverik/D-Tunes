import express from "express";
import * as FriendController from "../controllers/friends";

const router = express.Router();

router.get("/:userId", FriendController.getAllFriends);

router.post("/sendReq", FriendController.sendFriendReq);

router.post("/acceptReq", FriendController.acceptFriendReq);

router.post("/rejectReq", FriendController.rejectFriendReq);

router.post("/removeFriend", FriendController.removeFriend);

export default router;
