import type { SoundcloudTrackFilter, SoundcloudTrackSearch, SoundcloudTrack, SoundcloudComment } from "../types";
import { API } from "../API";
export declare class Tracks {
    private readonly api;
    private readonly resolve;
    constructor(api: API);
    /**
     * Searches for tracks using the v2 API.
     */
    search: (params?: SoundcloudTrackFilter) => Promise<SoundcloudTrackSearch>;
    /**
     * Fetches a track from URL or ID using Soundcloud v2 API.
     */
    get: (trackResolvable: string | number) => Promise<SoundcloudTrack>;
    /**
     * Fetches tracks from an array of ID using Soundcloud v2 API.
     */
    getArray: (trackIds: number[], keepOrder?: boolean) => Promise<SoundcloudTrack[]>;
    /**
     * Fetches comments from a track by ID using the Soundcloud V2 API
     */
    comments: (trackResolvable: string | number) => Promise<SoundcloudComment[]>;
    /**
     * Searches for tracks (web scraping)
     */
    searchAlt: (query: string) => Promise<SoundcloudTrack[]>;
    /**
     * Gets a track by URL (web scraping)
     */
    getAlt: (url: string) => Promise<SoundcloudTrack>;
    /**
     * Gets all related tracks of a track using the v2 API.
     */
    related: (trackResolvable: string | number, limit?: number) => Promise<SoundcloudTrackSearch>;
}
