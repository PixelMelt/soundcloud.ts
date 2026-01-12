export declare class API {
    static headers: {
        [key: string]: string;
    };
    clientId?: string;
    oauthToken?: string;
    proxy?: string;
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
    private options;
    private fetchRequest;
    private getRequest;
    getClientIdWeb: () => Promise<string>;
    getClientIdMobile: () => Promise<string>;
    getClientId: (reset?: boolean) => Promise<string>;
}
