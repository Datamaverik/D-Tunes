import express from "express";
import * as SpotifyController from "../controllers/spotify";
import { checkToken } from "../middlewares/checkToken";

const router = express.Router();

router.get('/genres',checkToken,SpotifyController.getSpotifyGenres);
router.get('/genres/:genreId',checkToken,SpotifyController.getPlaylistsByGenre);
router.get("/playlists/:playlistId",checkToken,SpotifyController.getTracksOfPlaylist);
router.get('/playlist/:trackId',checkToken,SpotifyController.getTrack);

export default router;