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
exports.Playlists = void 0;
var index_1 = require("./index");
var Playlists = /** @class */ (function () {
    function Playlists(api) {
        var _this = this;
        this.api = api;
        this.tracks = new index_1.Tracks(this.api);
        this.resolve = new index_1.Resolve(this.api);
        /**
         * Return playlist with all tracks fetched.
         */
        this.fetch = function (playlist) { return __awaiter(_this, void 0, void 0, function () {
            var unresolvedTracks, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        unresolvedTracks = playlist.tracks.splice(playlist.tracks.findIndex(function (t) { return !t.title; })).map(function (t) { return t.id; });
                        if (unresolvedTracks.length === 0)
                            return [2 /*return*/, playlist];
                        _a = playlist;
                        _c = (_b = playlist.tracks).concat;
                        return [4 /*yield*/, this.tracks.getArray(unresolvedTracks, true)];
                    case 1:
                        _a.tracks = _c.apply(_b, [_d.sent()]);
                        return [2 /*return*/, playlist];
                }
            });
        }); };
        /**
         * Searches for playlists using the v2 API.
         */
        this.search = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getV2("search/playlists", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Fetches a playlist from URL or ID using Soundcloud v2 API.
         */
        this.get = function (playlistResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var playlistID, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.get(playlistResolvable)];
                    case 1:
                        playlistID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/playlists/".concat(playlistID))];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, this.fetch(response)];
                }
            });
        }); };
        /**
         * Searches for playlists (web scraping)
         */
        this.searchAlt = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var headers, html, urls, scrape, i, songHTML, json, playlist;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = this.api.headers;
                        return [4 /*yield*/, fetch("https://soundcloud.com/search/sets?q=".concat(query), { headers: headers }).then(function (r) { return r.text(); })];
                    case 1:
                        html = _b.sent();
                        urls = (_a = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)) === null || _a === void 0 ? void 0 : _a.map(function (u) { return "https://soundcloud.com".concat(u); });
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
                        playlist = json[json.length - 1].data;
                        scrape.push(playlist);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, scrape];
                }
            });
        }); };
        /**
         * Gets a playlist by URL (web scraping)
         */
        this.getAlt = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var headers, songHTML, json, playlist;
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
                        playlist = json[json.length - 1].data;
                        return [2 /*return*/, this.fetch(playlist)];
                }
            });
        }); };
    }
    return Playlists;
}());
exports.Playlists = Playlists;
