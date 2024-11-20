import type { SoundcloudUser } from "../types";
import { API } from "../API";
export declare class Me {
    private readonly api;
    constructor(api: API);
    /**
     * Gets your own profile, using the Soundcloud v2 API.
     */
    get: () => Promise<SoundcloudUser>;
}
