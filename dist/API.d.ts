export declare class API {
    static headers: {
        [key: string]: string;
    };
    clientId?: string;
    oauthToken?: string;
    proxy?: string;
    private ddCookie?;
    private ddReady;
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
    private requestHeaders;
    /**
     * TLS-fingerprinted fetch via wreq-js.
     */
    private tlsFetch;
    /**
     * Proactively solve DD before first API request.
     */
    private ensureDD;
    private fetchRequest;
    private getRequest;
    /**
     * Scrape client_id from SC website. Uses TLS session to avoid tainting IP.
     */
    getClientIdWeb: () => Promise<any>;
    getClientIdMobile: () => Promise<string>;
    getClientId: (reset?: boolean) => Promise<string>;
}
