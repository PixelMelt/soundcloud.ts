"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
var apiURL = "https://api.soundcloud.com";
var apiV2URL = "https://api-v2.soundcloud.com";
var webURL = "https://soundcloud.com";
var API = /** @class */ (function () {
    function API(clientId, oauthToken, proxy) {
        var _this = this;
        this.get = function (endpoint, params) { return _this.getRequest(apiURL, endpoint, params); };
        this.getV2 = function (endpoint, params) { return _this.getRequest(apiV2URL, endpoint, params); };
        this.getWebsite = function (endpoint, params) { return _this.getRequest(webURL, endpoint, params); };
        this.getURL = function (URI, params) { return _this.fetchRequest(URI, "GET", params); };
        this.post = function (endpoint, params) { return _this.fetchRequest("".concat(apiURL, "/").concat(endpoint), "POST", params); };
        this.options = function (method, params) {
            var options = {
                method: method,
                headers: __assign({}, API.headers),
                redirect: "follow"
            };
            if (method === "POST" && params)
                options.body = JSON.stringify(params);
            return options;
        };
        this.fetchRequest = function (url, method, params) { return __awaiter(_this, void 0, void 0, function () {
            var query, response, contentType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params)
                            params = {};
                        if (!!this.clientId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getClientId()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        params.client_id = this.clientId;
                        if (this.oauthToken)
                            params.oauth_token = this.oauthToken;
                        query = params ? "?" + new URLSearchParams(params).toString() : "";
                        url += query;
                        if (this.proxy)
                            url = this.proxy + url;
                        return [4 /*yield*/, fetch(url, this.options(method, params))];
                    case 3:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Status code ".concat(response.status));
                        contentType = response.headers.get("content-type");
                        return [2 /*return*/, contentType && contentType.includes("application/json") ? response.json() : response.text()];
                }
            });
        }); };
        this.getRequest = function (origin, endpoint, params) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params)
                            params = {};
                        if (!!this.clientId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getClientId()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        params.client_id = this.clientId;
                        if (endpoint.startsWith("/"))
                            endpoint = endpoint.slice(1);
                        return [2 /*return*/, this.fetchRequest("".concat(origin, "/").concat(endpoint), "GET", params)];
                }
            });
        }); };
        this.getClientIdWeb = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, urls, _i, urls_1, scriptURL, script, clientId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(webURL).then(function (r) { return r.text(); })];
                    case 1:
                        response = _b.sent();
                        if (!response || typeof response !== "string")
                            throw new Error("Could not find client ID");
                        urls = response.match(/https?:\/\/[^\s"]+\.js/g);
                        if (!urls)
                            throw new Error("Could not find script URLs");
                        _i = 0, urls_1 = urls;
                        _b.label = 2;
                    case 2:
                        if (!(_i < urls_1.length)) return [3 /*break*/, 5];
                        scriptURL = urls_1[_i];
                        return [4 /*yield*/, fetch(scriptURL).then(function (r) { return r.text(); })];
                    case 3:
                        script = _b.sent();
                        clientId = (_a = script.match(/[{,]client_id:"(\w+)"/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (clientId)
                            return [2 /*return*/, clientId];
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: throw new Error("Could not find client ID in script URLs");
                }
            });
        }); };
        this.getClientIdMobile = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, clientId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("https://m.soundcloud.com/", {
                            headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.47 Mobile/15E148 Safari/604.1" }
                        }).then(function (r) { return r.text(); })];
                    case 1:
                        response = _b.sent();
                        clientId = (_a = response.match(/"clientId":"(\w+?)"/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (clientId)
                            return [2 /*return*/, clientId];
                        throw new Error("Could not find client ID");
                }
            });
        }); };
        this.getClientId = function (reset) { return __awaiter(_this, void 0, void 0, function () {
            var _a, webError_1, _b, mobileError_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(!this.oauthToken && (!this.clientId || reset))) return [3 /*break*/, 8];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 8]);
                        _a = this;
                        return [4 /*yield*/, this.getClientIdWeb()];
                    case 2:
                        _a.clientId = _c.sent();
                        return [3 /*break*/, 8];
                    case 3:
                        webError_1 = _c.sent();
                        console.log("Web fetch error:", webError_1);
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        _b = this;
                        return [4 /*yield*/, this.getClientIdMobile()];
                    case 5:
                        _b.clientId = _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        mobileError_1 = _c.sent();
                        console.log("Mobile fetch error:", mobileError_1);
                        throw new Error("Could not find client ID. Provide one in the constructor.\nWeb error: ".concat(webError_1, "\nMobile error: ").concat(mobileError_1));
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, this.clientId];
                }
            });
        }); };
        this.clientId = clientId;
        this.oauthToken = oauthToken;
        this.proxy = proxy;
        if (oauthToken)
            API.headers.Authorization = "OAuth ".concat(oauthToken);
    }
    Object.defineProperty(API.prototype, "headers", {
        get: function () {
            return API.headers;
        },
        enumerable: false,
        configurable: true
    });
    API.headers = {
        Origin: "https://soundcloud.com",
        Referer: "https://soundcloud.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67"
    };
    return API;
}());
exports.API = API;
