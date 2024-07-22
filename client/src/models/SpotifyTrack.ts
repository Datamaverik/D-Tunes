import { Albums } from "./albums";

interface artist{
  name:string;
}

export interface Track {
  id: string;
  name: string;
  preview_url: string;
  duration_ms: number;
  album: Albums;
  artists:artist[]
}
