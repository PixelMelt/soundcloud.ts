export declare class API {
    static headers: {
        [key: string]: string;
    };
    clientId?: string;
    oauthToken?: string;
    proxy?: string;
    private ddCookie?;
    constructor(clientId?: string, oauthToken?: string, proxy?: string);
    get headers(): {
        [key: string]: string;
    };
    get: (endpoint: string, params?: {
        [key: string]: any;
    }) => Promise<any>;
    getV2: (endpoint: string, params?: {
        [key: string]: any;
    }) => Promise<any>;
    getWebsite: (endpoint: string, params?: {
        [key: string]: any;
    }) => Promise<any>;
    getURL: (URI: string, params?: {
        [key: string]: any;
    }) => Promise<any>;
    post: (endpoint: string, params?: {
        [key: string]: any;
    }) => Promise<any>;
    /**
     * Build request headers with DD cookie if available. No Cookie header (cross-origin SameSite=Lax).
     */
    private requestHeaders;
    /**
     * Make a fetch request using TLS-fingerprinted session (wreq-js).
     */
    private tlsFetch;
    private fetchRequest;
    private getRequest;
    getClientIdWeb: () => Promise<string>;
    getClientIdMobile: () => Promise<string>;
    getClientId: (reset?: boolean) => Promise<string>;
}
