import { Pool } from "undici";
export declare class API {
    clientId?: string;
    oauthToken?: string;
    static headers: Record<string, any>;
    api: Pool;
    apiV2: Pool;
    web: Pool;
    proxy?: Pool;
    constructor(clientId?: string, oauthToken?: string, proxy?: string);
    get headers(): Record<string, any>;
    /**
     * Gets an endpoint from the Soundcloud API.
     */
    get: (endpoint: string, params?: Record<string, any>) => Promise<unknown>;
    /**
     * Gets an endpoint from the Soundcloud V2 API.
     */
    getV2: (endpoint: string, params?: Record<string, any>) => Promise<unknown>;
    /**
     * Some endpoints use the main website as the URL.
     */
    getWebsite: (endpoint: string, params?: Record<string, any>) => Promise<unknown>;
    /**
     * Gets a URL, such as download, stream, attachment, etc.
     */
    getURL: (URI: string, params?: Record<string, any>) => Promise<unknown>;
    private readonly buildOptions;
    private readonly request;
    private readonly getRequest;
    post: (endpoint: string, params?: Record<string, any>) => Promise<unknown>;
    getClientIdWeb: () => Promise<string>;
    getClientIdMobile: () => Promise<string>;
    getClientId: (reset?: boolean) => Promise<string>;
}
