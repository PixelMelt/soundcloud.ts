"use strict";
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
exports.Users = void 0;
var url_1 = require("url");
var index_1 = require("./index");
var Users = /** @class */ (function () {
    function Users(api) {
        var _this = this;
        this.api = api;
        this.resolve = new index_1.Resolve(this.api);
        /**
         * Gets a user's followers.
         */
        this.following = function (userResolvable, limit) { return __awaiter(_this, void 0, void 0, function () {
            var userID, response, followers, nextHref, _loop_1, this_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/users/".concat(userID, "/followings"), {
                                limit: 50,
                                offset: 0,
                            })];
                    case 2:
                        response = (_a.sent());
                        followers = [];
                        nextHref = response.next_href;
                        _loop_1 = function () {
                            var url, params;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        followers.push.apply(followers, response.collection);
                                        url = new url_1.URL(nextHref);
                                        params = {};
                                        url.searchParams.forEach(function (value, key) { return (params[key] = value); });
                                        return [4 /*yield*/, this_1.api.getURL(url.origin + url.pathname, params)];
                                    case 1:
                                        response = _b.sent();
                                        nextHref = response.next_href;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 3;
                    case 3:
                        if (!(nextHref && (!limit || followers.length < limit))) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, followers];
                }
            });
        }); };
        /**
         * Gets all the albums by the user using Soundcloud v2 API.
         */
        this.albums = function (userResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var userID, params, response, nextHref, _loop_2, this_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        params = {
                            limit: 10,
                            offset: 0,
                        };
                        return [4 /*yield*/, this.api.getV2("/users/".concat(userID, "/albums"), params)];
                    case 2:
                        response = (_a.sent());
                        nextHref = response.next_href;
                        _loop_2 = function () {
                            var url, params_1, nextPage;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        url = new url_1.URL(nextHref);
                                        params_1 = {};
                                        url.searchParams.forEach(function (value, key) { return (params_1[key] = value); });
                                        return [4 /*yield*/, this_2.api.getURL(url.origin + url.pathname, params_1)];
                                    case 1:
                                        nextPage = (_c.sent());
                                        (_b = response.collection).push.apply(_b, nextPage.collection);
                                        nextHref = nextPage.next_href;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _a.label = 3;
                    case 3:
                        if (!nextHref) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_2()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, response.collection];
                }
            });
        }); };
        /**
         * Searches for users using the v2 API.
         */
        this.search = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getV2("search/users", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Fetches a user from URL or ID using Soundcloud v2 API.
         */
        this.get = function (userResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var userID, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/users/".concat(userID))];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Gets all the tracks by the user using Soundcloud v2 API.
         */
        this.tracks = function (userResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var userID, response, nextHref, _loop_3, this_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/users/".concat(userID, "/tracks"))];
                    case 2:
                        response = (_a.sent());
                        nextHref = response.next_href;
                        _loop_3 = function () {
                            var url, params, nextPage;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        url = new url_1.URL(nextHref);
                                        params = {};
                                        url.searchParams.forEach(function (value, key) { return (params[key] = value); });
                                        return [4 /*yield*/, this_3.api.getURL(url.origin + url.pathname, params)];
                                    case 1:
                                        nextPage = (_c.sent());
                                        (_b = response.collection).push.apply(_b, nextPage.collection);
                                        nextHref = nextPage.next_href;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        _a.label = 3;
                    case 3:
                        if (!nextHref) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_3()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, response.collection];
                }
            });
        }); };
        /**
         * Gets all of a users liked tracks.
         */
        this.likes = function (userResolvable, limit) { return __awaiter(_this, void 0, void 0, function () {
            var userID, response, tracks, nextHref, _loop_4, this_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/users/".concat(userID, "/likes"), {
                                limit: 50,
                                offset: 0,
                            })];
                    case 2:
                        response = (_a.sent());
                        tracks = [];
                        nextHref = response.next_href;
                        _loop_4 = function () {
                            var url, params;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        tracks.push.apply(tracks, response.collection.map(function (r) { return r.track; }));
                                        url = new url_1.URL(nextHref);
                                        params = {};
                                        url.searchParams.forEach(function (value, key) { return (params[key] = value); });
                                        return [4 /*yield*/, this_4.api.getURL(url.origin + url.pathname, params)];
                                    case 1:
                                        response = _b.sent();
                                        nextHref = response.next_href;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_4 = this;
                        _a.label = 3;
                    case 3:
                        if (!(nextHref && (!limit || tracks.length < limit))) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_4()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, tracks];
                }
            });
        }); };
        /**
         * Gets all the web profiles on a users sidebar.
         */
        this.webProfiles = function (userResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var userID, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(userResolvable)];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/users/soundcloud:users:".concat(userID, "/web-profiles"))];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Searches for users (web scraping)
         */
        this.searchAlt = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var headers, html, urls, scrape, i, songHTML, json, user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = this.api.headers;
                        return [4 /*yield*/, fetch("https://soundcloud.com/search/people?q=".concat(query), { headers: headers }).then(function (r) { return r.text(); })];
                    case 1:
                        html = _b.sent();
                        urls = (_a = html
                            .match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)) === null || _a === void 0 ? void 0 : _a.map(function (u) { return "https://soundcloud.com".concat(u); });
                        if (!urls)
                            return [2 /*return*/, []];
                        scrape = [];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < urls.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, fetch(urls[i], { headers: headers }).then(function (r) { return r.text(); })];
                    case 3:
                        songHTML = _b.sent();
                        json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0]);
                        user = json[json.length - 1].data;
                        scrape.push(user);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, scrape];
                }
            });
        }); };
        /**
         * Gets a user by URL (web scraping)
         */
        this.getAlt = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var headers, songHTML, json, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!url.startsWith("https://soundcloud.com/"))
                            url = "https://soundcloud.com/".concat(url);
                        headers = this.api.headers;
                        return [4 /*yield*/, fetch(url, { headers: headers }).then(function (r) { return r.text(); })];
                    case 1:
                        songHTML = _a.sent();
                        json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0]);
                        user = json[json.length - 1].data;
                        return [2 /*return*/, user];
                }
            });
        }); };
    }
    return Users;
}());
exports.Users = Users;
