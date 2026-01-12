import { API } from "../API";
export declare class Resolve {
    private readonly api;
    constructor(api: API);
    /**
     * Gets the ID from the html source.
     */
    getAlt: (resolvable: string | number) => Promise<number>;
    /**
     * Gets the ID of a user/playlist/track from the Soundcloud URL using the v2 API.
     */
    get: (resolvable: string | number, full?: boolean) => Promise<any>;
}
