import type { SoundcloudComment } from "../types";
import { API } from "../API";
export declare class Comments {
    private readonly api;
    constructor(api: API);
    /**
     * Gets a comment from its ID, using the Soundcloud v2 API.
     */
    get: (commentID: number) => Promise<SoundcloudComment>;
}
