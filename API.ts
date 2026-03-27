import { solveDataDome, getTlsSession, resetTlsSession } from "./entities/DataDome"

const apiURL = "https://api.soundcloud.com"
const apiV2URL = "https://api-v2.soundcloud.com"
const webURL = "https://soundcloud.com"

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
const CH_UA = '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"'

export class API {
    public static headers: {[key: string]: string} = {
        "User-Agent": UA,
        "sec-ch-ua": CH_UA,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "Origin": "https://soundcloud.com",
        "Referer": "https://soundcloud.com/",
        "Accept": "application/json, text/javascript, */*; q=0.1",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
    }
    public clientId?: string
    public oauthToken?: string
    public proxy?: string
    private ddCookie?: string
    private ddReady = false

    public constructor(clientId?: string, oauthToken?: string, proxy?: string) {
        this.clientId = clientId
        this.oauthToken = oauthToken
        this.proxy = proxy
        if (oauthToken) API.headers.Authorization = `OAuth ${oauthToken}`
    }

    public get headers() {
        return API.headers
    }

    public get = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(apiURL, endpoint, params)
    public getV2 = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(apiV2URL, endpoint, params)
    public getWebsite = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(webURL, endpoint, params)
    public getURL = (URI: string, params?: {[key: string]: any}) => this.fetchRequest(URI, "GET", params)
    public post = (endpoint: string, params?: {[key: string]: any}) => this.fetchRequest(`${apiURL}/${endpoint}`, "POST", params)

    private requestHeaders = (method: string) => {
        const headers: {[key: string]: string} = {...API.headers}
        if (this.ddCookie) headers["x-datadome-clientid"] = this.ddCookie
        return headers
    }

    /**
     * TLS-fingerprinted fetch via wreq-js.
     */
    private tlsFetch = async (url: string, init: RequestInit): Promise<Response> => {
        try {
            const session = await getTlsSession()
            return await session.fetch(url, init)
        } catch {
            return await fetch(url, init)
        }
    }

    /**
     * Proactively solve DD before first API request.
     */
    private ensureDD = async () => {
        if (this.ddReady) return
        this.ddReady = true
        try {
            console.log("[DataDome] Proactive solve...")
            this.ddCookie = await solveDataDome()
            console.log("[DataDome] Ready, cookie:", this.ddCookie?.slice(0, 40) + "...")
        } catch (e) {
            console.error("[DataDome] Proactive solve failed:", e)
        }
    }

    private fetchRequest = async (url: string, method: string, params?: {[key: string]: any}) => {
        if (!params) params = {}
        if (!this.clientId) await this.getClientId()
        params.client_id = this.clientId
        if (this.oauthToken) params.oauth_token = this.oauthToken

        // Solve DD before first real API request
        await this.ensureDD()

        const query = params ? "?" + new URLSearchParams(params).toString() : ""
        let fullUrl = url + query
        if (this.proxy) fullUrl = this.proxy + fullUrl

        const headers = this.requestHeaders(method)
        const options: RequestInit = { method, headers, redirect: "follow" }
        if (method === "POST" && params) options.body = JSON.stringify(params)

        let response = await this.tlsFetch(fullUrl, options)

        // DD challenge — solve and retry once
        const isDD = response.status === 403 && (
            response.headers.get("x-datadome") ||
            (response.headers.get("set-cookie") || "").includes("datadome=")
        )
        if (isDD) {
            const setCookie = response.headers.get("set-cookie") || ""
            const initialCid = setCookie.match(/datadome=([^;]+)/)?.[1] || this.ddCookie
            try {
                console.log("[DataDome] Challenge on", method, url.replace(apiV2URL, "").replace(apiURL, "").split("?")[0])
                resetTlsSession()
                this.ddCookie = await solveDataDome(initialCid)
                console.log("[DataDome] Solved, cookie:", this.ddCookie?.slice(0, 40) + "...")
                const retryHeaders = this.requestHeaders(method)
                const retryOptions: RequestInit = { method, headers: retryHeaders, redirect: "follow" }
                if (method === "POST" && params) retryOptions.body = JSON.stringify(params)
                response = await this.tlsFetch(fullUrl, retryOptions)
                console.log("[DataDome] Retry:", response.status)
            } catch (e) {
                console.error("[DataDome] Solve failed:", e)
            }
        }

        if (!response.ok) throw new Error(`Status code ${response.status}`)
        const contentType = response.headers.get("content-type")
        return contentType && contentType.includes("application/json") ? response.json() : response.text()
    }

    private getRequest = async (origin: string, endpoint: string, params?: {[key: string]: any}) => {
        if (!params) params = {}
        if (!this.clientId) await this.getClientId()
        params.client_id = this.clientId
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        return this.fetchRequest(`${origin}/${endpoint}`, "GET", params)
    }

    /**
     * Scrape client_id from SC website. Uses TLS session to avoid tainting IP.
     */
    public getClientIdWeb = async () => {
        const session = await getTlsSession()
        const response = await session.fetch(webURL, {
            headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "en-US,en;q=0.9" }
        }).then((r: any) => r.text())
        if (!response || typeof response !== "string") throw new Error("Could not find client ID")
        const urls = response.match(/https?:\/\/[^\s"]+\.js/g)
        if (!urls) throw new Error("Could not find script URLs")
        for (const scriptURL of urls) {
            const script = await session.fetch(scriptURL, {
                headers: { "User-Agent": UA, "Accept": "*/*", "Referer": "https://soundcloud.com/" }
            }).then((r: any) => r.text())
            const clientId = script.match(/[{,]client_id:"(\w+)"/)?.[1]
            if (clientId) return clientId
        }
        throw new Error("Could not find client ID in script URLs")
    }

    public getClientIdMobile = async () => {
        const response = await fetch("https://m.soundcloud.com/", {
            headers: {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.47 Mobile/15E148 Safari/604.1"}
        }).then(r => r.text())
        const clientId = response.match(/"clientId":"(\w+?)"/)?.[1]
        if (clientId) return clientId
        throw new Error("Could not find client ID")
    }

    public getClientId = async (reset?: boolean) => {
        if (!this.oauthToken && (!this.clientId || reset)) {
            try {
                this.clientId = await this.getClientIdWeb()
            } catch (webError) {
                console.log("Web fetch error:", webError)
                try {
                    this.clientId = await this.getClientIdMobile()
                } catch (mobileError) {
                    console.log("Mobile fetch error:", mobileError)
                    throw new Error(`Could not find client ID. Provide one in the constructor.\nWeb error: ${webError}\nMobile error: ${mobileError}`)
                }
            }
        }
        return this.clientId
    }
}
