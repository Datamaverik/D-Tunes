declare module "genius-lyrics-api" {
  interface Options {
    apiKey: string;
    title: string;
    artist: string;
    optimizeQuery?: boolean;
  }

  interface Song {
    id: number;
    title: string;
    url: string;
    albumArt: string;
    lyrics: string;
  }

  export function getSong(options: Options): Promise<Song>;
  export function getLyrics(options: Options): Promise<string>;
}
