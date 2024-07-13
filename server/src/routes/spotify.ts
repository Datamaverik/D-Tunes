
import * as SpotifyController from "../controllers/spotify";
import { checkToken } from "../middlewares/checkToken";

import * as express from "express";

export class Context {
  constructor(public someContextVariable: any) {}

  log(message: string) {
    console.log(this.someContextVariable, { message });
  }
}

declare global {
  namespace Express {
    interface Request {
      accessToken: string;
    }
  }
}

const router = express.Router();

router.get('/genres',checkToken,SpotifyController.getSpotifyGenres);
router.get('/genres/:genreId',checkToken,SpotifyController.getPlaylistsByGenre);
router.get("/playlists/:playlistId",checkToken,SpotifyController.getTracksOfPlaylist);
router.get('/playlist/:trackId',checkToken,SpotifyController.getTrack);
router.get("/access-token", checkToken, (req, res) => {
  res.json({ accessToken: req.accessToken });
});
router.get('/search',checkToken,SpotifyController.searchSpotify);

export default router;