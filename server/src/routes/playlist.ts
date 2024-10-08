import express from "express";
import { upload } from "../middlewares/multer";
import * as PlaylistController from "../controllers/playlist";

const router = express.Router();

router.post("/", upload.single("image"), PlaylistController.createPlaylist);

router.get("/allPublic", PlaylistController.getAllPublicPlaylists);

router.get("/userPrivate", PlaylistController.getUserPvtPlaylists);

router.get("/userAll", PlaylistController.getUserAllPlaylists);

router.get("/:playlistId", PlaylistController.getPlaylistById);

router.get(
  "/userPublic/:userId",
  PlaylistController.getUserPublicPlaylistById
);

router.delete("/delete/:playlistId", PlaylistController.removePlaylist);

router.post(
  "/addRemPlaylist/:playlistId",
  PlaylistController.addRemSongFromPlaylist
);

router.post("/update/:playlistId", PlaylistController.updatePlaylist);

export default router;
