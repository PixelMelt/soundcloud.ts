import type { SoundcloudApp } from "../types";
import { API } from "../API";
export declare class Apps {
    private readonly api;
    constructor(api: API);
    /**
     * Gets Soundcloud apps, using the Soundcloud v2 API.
     */
    get: () => Promise<SoundcloudApp>;
}
