import express from "express";
import { upload } from "../middlewares/multer";
import * as trackController from "../controllers/tracks";
import {getSongLyrics} from '../controllers/genius'

const router = express.Router();

const cpUpload = upload.fields([{ name: "image" }, { name: "song" }]);

router.post("/", cpUpload, trackController.saveTrack);

router.delete("/delete/:trackId", trackController.removeTrack);

router.get("/allPublished/:artistId", trackController.getPublishedTracks);

router.get("/published/:trackId", trackController.getTrackByID);

router.get("/tracksByUser/:userId", trackController.getTracksByUser);

router.get("/search", trackController.getTracksByName);

router.post('/lyrics',getSongLyrics);

export default router;
