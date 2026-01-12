import { API } from "./API";
import { Comments, Playlists, Resolve, Tracks, Users, Util } from "./entities";
/**
 * The main class for interacting with the Soundcloud API.
 */
export declare class Soundcloud {
    static clientId?: string;
    static oauthToken?: string;
    static proxy?: string;
    api: API;
    comments: Comments;
    playlists: Playlists;
    resolve: Resolve;
    tracks: Tracks;
    users: Users;
    util: Util;
    constructor(clientId?: string, oauthToken?: string, options?: {
        proxy?: string;
    });
}
export * from "./entities";
export * from "./types";
export * from "./API";
export default Soundcloud;
