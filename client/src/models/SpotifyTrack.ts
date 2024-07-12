import { Albums } from "./albums"

export interface Track{
    id:string,
    name:string,
    preview_url:string,
    duration_ms:number
    album:Albums
}