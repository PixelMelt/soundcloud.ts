/// <reference types="mocha" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { SoundcloudTrack } from '../types';
import { API } from '../API';
export declare class Util {
    private readonly api;
    private readonly tracks;
    private readonly users;
    private readonly playlists;
    constructor(api: API);
    private readonly resolveTrack;
    private readonly sortTranscodings;
    private readonly getStreamLink;
    /**
     * Gets the direct streaming link of a track.
     */
    streamLink: (trackResolvable: string | SoundcloudTrack, protocol?: 'progressive' | 'hls') => Promise<any>;
    private readonly mergeFiles;
    private readonly checkFFmpeg;
    private readonly spawnFFmpeg;
    /**
     * Readable stream of m3u playlists.
     */
    private readonly m3uReadableStream;
    /**
     * Downloads the mp3 stream of a track.
     */
    private readonly downloadTrackStream;
    /**
     * Downloads a track on Soundcloud.
     */
    downloadTrack: (trackResolvable: string | SoundcloudTrack, dest?: string) => Promise<string>;
    /**
     * Downloads an array of tracks.
     */
    downloadTracks: (tracks: SoundcloudTrack[] | string[], dest?: string, limit?: number) => Promise<string[]>;
    /**
     * Downloads all the tracks from the search query.
     */
    downloadSearch: (query: string, dest?: string, limit?: number) => Promise<string[]>;
    /**
     * Download all liked tracks by a user.
     */
    downloadLikes: (userResolvable: string | number, dest?: string, limit?: number) => Promise<string[]>;
    /**
     * Downloads all the tracks in a playlist.
     */
    downloadPlaylist: (playlistResolvable: string, dest?: string, limit?: number) => Promise<string[]>;
    /**
     * Returns a readable stream to the track.
     */
    streamTrack: (trackResolvable: string | SoundcloudTrack) => Promise<NodeJS.ReadableStream>;
    /**
     * Downloads a track's song cover.
     */
    downloadSongCover: (trackResolvable: string | SoundcloudTrack, dest?: string, noDL?: boolean) => Promise<string>;
    private static readonly removeDirectory;
}
