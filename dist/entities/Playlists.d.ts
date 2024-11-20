import type { SoundcloudPlaylistFilter, SoundcloudPlaylistSearch, SoundcloudPlaylist } from "../types";
import { API } from "../API";
export declare class Playlists {
    private readonly api;
    private readonly tracks;
    private readonly resolve;
    constructor(api: API);
    /**
     * Return playlist with all tracks fetched.
     */
    fetch: (playlist: SoundcloudPlaylist) => Promise<SoundcloudPlaylist>;
    /**
     * Searches for playlists using the v2 API.
     */
    search: (params?: SoundcloudPlaylistFilter) => Promise<SoundcloudPlaylistSearch>;
    /**
     * Fetches a playlist from URL or ID using Soundcloud v2 API.
     */
    get: (playlistResolvable: string | number) => Promise<SoundcloudPlaylist>;
    /**
     * Searches for playlists (web scraping)
     */
    searchAlt: (query: string) => Promise<SoundcloudPlaylist[]>;
    /**
     * Gets a playlist by URL (web scraping)
     */
    getAlt: (url: string) => Promise<SoundcloudPlaylist>;
}
