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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.Util = void 0;
var fs = require("fs");
var path = require("path");
var index_1 = require("./index");
var undici_1 = require("undici");
var stream_1 = require("stream");
var child_process_1 = require("child_process");
var temp = 0;
var FFMPEG = { checked: false, path: "" };
var SOURCES = [
    function () {
        var _a;
        var ffmpeg = require("ffmpeg-static");
        return (_a = ffmpeg === null || ffmpeg === void 0 ? void 0 : ffmpeg.path) !== null && _a !== void 0 ? _a : ffmpeg;
    },
    function () { return "ffmpeg"; },
    function () { return "./ffmpeg"; },
];
var Util = /** @class */ (function () {
    function Util(api) {
        var _this = this;
        this.api = api;
        this.tracks = new index_1.Tracks(this.api);
        this.users = new index_1.Users(this.api);
        this.playlists = new index_1.Playlists(this.api);
        this.resolveTrack = function (trackResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof trackResolvable === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.tracks.get(trackResolvable)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = trackResolvable;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        }); };
        this.sortTranscodings = function (trackResolvable, protocol) { return __awaiter(_this, void 0, void 0, function () {
            var track, transcodings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _a.sent();
                        transcodings = track.media.transcodings.sort(function (t) { return (t.quality === "hq" ? -1 : 1); });
                        if (!protocol)
                            return [2 /*return*/, transcodings];
                        return [2 /*return*/, transcodings.filter(function (t) { return t.format.protocol === protocol; })];
                }
            });
        }); };
        this.getStreamLink = function (transcoding) { return __awaiter(_this, void 0, void 0, function () {
            var url, client_id, headers, connect, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(transcoding === null || transcoding === void 0 ? void 0 : transcoding.url))
                            return [2 /*return*/, null];
                        url = transcoding.url;
                        return [4 /*yield*/, this.api.getClientId()];
                    case 1:
                        client_id = _c.sent();
                        headers = this.api.headers;
                        connect = url.includes("?") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 10]);
                        return [4 /*yield*/, (0, undici_1.request)(url + connect, { headers: headers })
                                .then(function (r) { return r.body.json(); })
                                .then(function (r) { return r.url; })];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4:
                        _a = _c.sent();
                        return [4 /*yield*/, this.api.getClientId(true)];
                    case 5:
                        client_id = _c.sent();
                        connect = url.includes("?") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, undici_1.request)(url + connect, { headers: headers })
                                .then(function (r) { return r.body.json(); })
                                .then(function (r) { return r.url; })];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8:
                        _b = _c.sent();
                        return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Gets the direct streaming link of a track.
         */
        this.streamLink = function (trackResolvable, protocol) { return __awaiter(_this, void 0, void 0, function () {
            var track, transcodings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _a.sent();
                        return [4 /*yield*/, this.sortTranscodings(track, protocol)];
                    case 2:
                        transcodings = _a.sent();
                        if (!transcodings.length)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.getStreamLink(transcodings[0])];
                }
            });
        }); };
        this.mergeFiles = function (files, outputFile) { return __awaiter(_this, void 0, void 0, function () {
            var outStream, ret, _loop_1, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outStream = fs.createWriteStream(outputFile);
                        ret = new Promise(function (resolve, reject) {
                            outStream.on("finish", resolve);
                            outStream.on("error", reject);
                        });
                        _loop_1 = function (file) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            fs.createReadStream(file).on("error", reject).on("end", resolve).pipe(outStream, { end: false });
                                        })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 4];
                        file = files_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        outStream.end();
                        return [2 /*return*/, ret];
                }
            });
        }); };
        this.checkFFmpeg = function () {
            var _a;
            if (FFMPEG.checked)
                return true;
            for (var _i = 0, SOURCES_1 = SOURCES; _i < SOURCES_1.length; _i++) {
                var fn = SOURCES_1[_i];
                try {
                    var command = fn();
                    var result = (0, child_process_1.spawnSync)(command, ["-h"], { windowsHide: true, shell: true, encoding: "utf-8" });
                    if (result.error)
                        throw result.error;
                    if (result.stderr && !result.stdout)
                        throw new Error(result.stderr);
                    var output = result.output.filter(Boolean).join("\n");
                    var version = (_a = /version (.+) Copyright/im.exec(output)) === null || _a === void 0 ? void 0 : _a[1];
                    if (!version)
                        throw new Error("Malformed FFmpeg command using ".concat(command));
                    FFMPEG.path = command;
                }
                catch (_b) { }
            }
            FFMPEG.checked = true;
            if (!FFMPEG.path) {
                console.warn("FFmpeg not found, please install ffmpeg-static or add ffmpeg to your PATH.");
                console.warn("Download m4a (hq) is disabled, use mp3 (sq) instead.");
            }
            return true;
        };
        this.spawnFFmpeg = function (argss) {
            try {
                (0, child_process_1.spawnSync)(FFMPEG.path, argss, { windowsHide: true, shell: false });
            }
            catch (e) {
                console.error(e);
                throw "FFmpeg error";
            }
        };
        /**
         * Readable stream of m3u playlists.
         */
        this.m3uReadableStream = function (trackResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var track, transcodings, transcoding, _i, transcodings_1, t, headers, client_id, connect, m3uLink, destDir, output, m3u, urls, chunks, i, arrayBuffer, chunkPath, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _a.sent();
                        return [4 /*yield*/, this.sortTranscodings(track, "hls")];
                    case 2:
                        transcodings = _a.sent();
                        if (!transcodings.length)
                            throw "No transcodings found";
                        for (_i = 0, transcodings_1 = transcodings; _i < transcodings_1.length; _i++) {
                            t = transcodings_1[_i];
                            if (t.format.mime_type.startsWith('audio/mp4; codecs="mp4a') && this.checkFFmpeg()) {
                                transcoding = { url: t.url, type: "m4a" };
                                break;
                            }
                            if (t.format.mime_type.startsWith("audio/mpeg")) {
                                transcoding = { url: t.url, type: "mp3" };
                                break;
                            }
                        }
                        if (!transcoding) {
                            console.log("Support for this track is not yet implemented, please open an issue on GitHub.\n\n            URL: ".concat(track.permalink_url, ".\n\n            Type: ").concat(track.media.transcodings.map(function (t) { return t.format.mime_type; }).join(" | ")));
                            throw "No supported transcodings found";
                        }
                        headers = this.api.headers;
                        return [4 /*yield*/, this.api.getClientId()];
                    case 3:
                        client_id = _a.sent();
                        connect = transcoding.url.includes("?") ? "&client_id=".concat(client_id) : "?client_id=".concat(client_id);
                        return [4 /*yield*/, (0, undici_1.request)(transcoding.url + connect, { headers: this.api.headers })
                                .then(function (r) { return r.body.json(); })
                                .then(function (r) { return r.url; })];
                    case 4:
                        m3uLink = _a.sent();
                        destDir = path.join(__dirname, "tmp_".concat(temp++));
                        if (!fs.existsSync(destDir))
                            fs.mkdirSync(destDir, { recursive: true });
                        output = path.join(destDir, "out.".concat(transcoding.type));
                        if (!(transcoding.type === "m4a")) return [3 /*break*/, 5];
                        try {
                            this.spawnFFmpeg(["-y", "-loglevel", "warning", "-i", m3uLink, "-bsf:a", "aac_adtstoasc", "-vcodec", "copy", "-c", "copy", "-crf", "50", output]);
                        }
                        catch (_b) {
                            console.warn("Failed to transmux to m4a (hq), download as mp3 (hq) instead.");
                            FFMPEG.path = null;
                            return [2 /*return*/, this.m3uReadableStream(trackResolvable)];
                        }
                        return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, (0, undici_1.request)(m3uLink, { headers: headers }).then(function (r) { return r.body.text(); })];
                    case 6:
                        m3u = _a.sent();
                        urls = m3u.match(/(http).*?(?=\s)/gm);
                        chunks = [];
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < urls.length)) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, undici_1.request)(urls[i], { headers: headers }).then(function (r) { return r.body.arrayBuffer(); })];
                    case 8:
                        arrayBuffer = _a.sent();
                        chunkPath = path.join(destDir, "".concat(i, ".").concat(transcoding.type));
                        fs.writeFileSync(chunkPath, Buffer.from(arrayBuffer));
                        chunks.push(chunkPath);
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.mergeFiles(chunks, output)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        stream = stream_1.Readable.from(fs.readFileSync(output));
                        Util.removeDirectory(destDir);
                        return [2 /*return*/, { stream: stream, type: transcoding.type }];
                }
            });
        }); };
        /**
         * Downloads the mp3 stream of a track.
         */
        this.downloadTrackStream = function (trackResolvable, title, dest) { return __awaiter(_this, void 0, void 0, function () {
            var result, track, transcodings, transcoding, url, headers, stream_2, type, stream, fileName, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _a.sent();
                        return [4 /*yield*/, this.sortTranscodings(track, "progressive")];
                    case 2:
                        transcodings = _a.sent();
                        if (!!transcodings.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.m3uReadableStream(trackResolvable)];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        transcoding = transcodings[0];
                        return [4 /*yield*/, this.getStreamLink(transcoding)];
                    case 5:
                        url = _a.sent();
                        headers = this.api.headers;
                        return [4 /*yield*/, (0, undici_1.request)(url, { headers: headers }).then(function (r) { return r.body; })];
                    case 6:
                        stream_2 = _a.sent();
                        type = transcoding.format.mime_type.startsWith('audio/mp4; codecs="mp4a') ? "m4a" : "mp3";
                        result = { stream: stream_2, type: type };
                        _a.label = 7;
                    case 7:
                        stream = result.stream;
                        fileName = path.extname(dest) ? dest : path.join(dest, "".concat(title, ".").concat(result.type));
                        writeStream = fs.createWriteStream(fileName);
                        stream.pipe(writeStream);
                        return [4 /*yield*/, new Promise(function (resolve) { return stream.on("end", function () { return resolve(); }); })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, fileName];
                }
            });
        }); };
        /**
         * Downloads a track on Soundcloud.
         */
        this.downloadTrack = function (trackResolvable, dest) { return __awaiter(_this, void 0, void 0, function () {
            var disallowedCharactersRegex, track, downloadObj, result, arrayBuffer, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        disallowedCharactersRegex = /[\\/:*?\"\'\`<>|%$!#]/g;
                        if (!dest)
                            dest = "./";
                        if (!fs.existsSync(dest))
                            fs.mkdirSync(dest, { recursive: true });
                        return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _b.sent();
                        if (!(track.downloadable === true)) return [3 /*break*/, 8];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.api.getV2("/tracks/".concat(track.id, "/download"))];
                    case 3:
                        downloadObj = _b.sent();
                        return [4 /*yield*/, (0, undici_1.request)(downloadObj.redirectUri)];
                    case 4:
                        result = _b.sent();
                        dest = path.extname(dest) ? dest : path.join(dest, "".concat(track.title.replace(disallowedCharactersRegex, ""), ".").concat(result.headers["x-amz-meta-file-type"]));
                        return [4 /*yield*/, result.body.arrayBuffer()];
                    case 5:
                        arrayBuffer = _b.sent();
                        fs.writeFileSync(dest, Buffer.from(arrayBuffer, "binary"));
                        return [2 /*return*/, dest];
                    case 6:
                        _a = _b.sent();
                        return [2 /*return*/, this.downloadTrackStream(track, track.title.replace(disallowedCharactersRegex, ""), dest)];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, this.downloadTrackStream(track, track.title.replace(disallowedCharactersRegex, ""), dest)];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Downloads an array of tracks.
         */
        this.downloadTracks = function (tracks, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var resultArray, i, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!limit)
                            limit = tracks.length;
                        resultArray = [];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < limit)) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.downloadTrack(tracks[i], dest)];
                    case 3:
                        result = _b.sent();
                        resultArray.push(result);
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, resultArray];
                }
            });
        }); };
        /**
         * Downloads all the tracks from the search query.
         */
        this.downloadSearch = function (query, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var tracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tracks.search({ q: query })];
                    case 1:
                        tracks = _a.sent();
                        return [2 /*return*/, this.downloadTracks(tracks.collection, dest, limit)];
                }
            });
        }); };
        /**
         * Download all liked tracks by a user.
         */
        this.downloadLikes = function (userResolvable, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var tracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.users.likes(userResolvable, limit)];
                    case 1:
                        tracks = _a.sent();
                        return [2 /*return*/, this.downloadTracks(tracks, dest, limit)];
                }
            });
        }); };
        /**
         * Downloads all the tracks in a playlist.
         */
        this.downloadPlaylist = function (playlistResolvable, dest, limit) { return __awaiter(_this, void 0, void 0, function () {
            var playlist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.playlists.get(playlistResolvable)];
                    case 1:
                        playlist = _a.sent();
                        return [2 /*return*/, this.downloadTracks(playlist.tracks, dest, limit)];
                }
            });
        }); };
        /**
         * Returns a readable stream to the track.
         */
        this.streamTrack = function (trackResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var url, readable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamLink(trackResolvable, "progressive")];
                    case 1:
                        url = _a.sent();
                        if (!url)
                            return [2 /*return*/, this.m3uReadableStream(trackResolvable).then(function (r) { return r.stream; })];
                        return [4 /*yield*/, (0, undici_1.request)(url, { headers: this.api.headers }).then(function (r) { return r.body; })];
                    case 2:
                        readable = _a.sent();
                        return [2 /*return*/, readable];
                }
            });
        }); };
        /**
         * Downloads a track's song cover.
         */
        this.downloadSongCover = function (trackResolvable, dest, noDL) { return __awaiter(_this, void 0, void 0, function () {
            var disallowedCharactersRegex, folder, track, artwork, title, client_id, url, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        disallowedCharactersRegex = /[\\/:*?\"\'\`<>|%$!#]/g;
                        if (!dest)
                            dest = "./";
                        folder = dest;
                        if (!fs.existsSync(folder))
                            fs.mkdirSync(folder, { recursive: true });
                        return [4 /*yield*/, this.resolveTrack(trackResolvable)];
                    case 1:
                        track = _a.sent();
                        artwork = (track.artwork_url ? track.artwork_url : track.user.avatar_url).replace(".jpg", ".png").replace("-large", "-t500x500");
                        title = track.title.replace(disallowedCharactersRegex, "");
                        dest = path.extname(dest) ? dest : path.join(folder, "".concat(title, ".png"));
                        return [4 /*yield*/, this.api.getClientId()];
                    case 2:
                        client_id = _a.sent();
                        url = "".concat(artwork, "?client_id=").concat(client_id);
                        if (noDL)
                            return [2 /*return*/, url];
                        return [4 /*yield*/, (0, undici_1.request)(url).then(function (r) { return r.body.arrayBuffer(); })];
                    case 3:
                        arrayBuffer = _a.sent();
                        fs.writeFileSync(dest, Buffer.from(arrayBuffer));
                        return [2 /*return*/, dest];
                }
            });
        }); };
    }
    Util.removeDirectory = function (dir) {
        if (!fs.existsSync(dir))
            return;
        fs.readdirSync(dir).forEach(function (file) {
            var current = path.join(dir, file);
            if (fs.lstatSync(current).isDirectory()) {
                Util.removeDirectory(current);
            }
            else {
                fs.unlinkSync(current);
            }
        });
        try {
            fs.rmdirSync(dir);
        }
        catch (error) {
            console.error(error);
        }
    };
    return Util;
}());
exports.Util = Util;
