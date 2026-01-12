import type { SoundcloudTrack, SoundcloudUserFilter, SoundcloudUserSearch, SoundcloudUser, SoundcloudWebProfile, SoundcloudPlaylist } from "../types";
import { API } from "../API";
export declare class Users {
    private readonly api;
    private readonly resolve;
    constructor(api: API);
    /**
     * Searches for users using the v2 API.
     */
    search: (params?: SoundcloudUserFilter) => Promise<SoundcloudUserSearch>;
    /**
     * Fetches a user from URL or ID using Soundcloud v2 API.
     */
    get: (userResolvable: string | number) => Promise<SoundcloudUser>;
    /**
     * Gets all the tracks by the user using Soundcloud v2 API.
     */
    tracks: (userResolvable: string | number) => Promise<SoundcloudTrack[]>;
    /**
     * Gets all of a users liked tracks.
     */
    likes: (userResolvable: string | number, limit?: number) => Promise<SoundcloudTrack[]>;
    /**
     * Gets all the playlists by the user using Soundcloud v2 API.
     */
    playlists: (userResolvable: string | number) => Promise<SoundcloudPlaylist[]>;
    /**
     * Gets all the albums by the user using Soundcloud v2 API.
     */
    albums: (userResolvable: string | number) => Promise<SoundcloudTrack[]>;
    /**
     * Gets a user's following list.
     */
    following: (userResolvable: string | number, limit?: number) => Promise<SoundcloudUser[]>;
    /**
     * Gets all the web profiles on a users sidebar.
     */
    webProfiles: (userResolvable: string | number) => Promise<SoundcloudWebProfile[]>;
    /**
     * Searches for users (web scraping)
     */
    searchAlt: (query: string) => Promise<SoundcloudUser[]>;
    /**
     * Gets a user by URL (web scraping)
     */
    getAlt: (url: string) => Promise<SoundcloudUser>;
}
