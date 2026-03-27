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
exports.solveDataDome = exports.resetTlsSession = exports.getTlsSession = void 0;
var child_process_1 = require("child_process");
var path = require("path");
var wreq_js_1 = require("wreq-js");
// __dirname is dist/entities/ at runtime, go up two levels to package root
var SOLVER_BIN = path.join(__dirname, '..', '..', 'bin', 'datadome-solver');
var DDK = '7FC6D561817844F25B65CDD97F28A1';
var DD_ENDPOINT = 'https://dwt.soundcloud.com/js/';
var DDV = '5.5.1';
var UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';
var CH_UA = '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"';
function generatePayload(cid, bpc) {
    var args = [DDK, cid, String(bpc)];
    if (bpc >= 2)
        args.push('--interaction');
    var result = (0, child_process_1.execFileSync)(SOLVER_BIN, args, { encoding: 'utf-8', timeout: 5000 });
    return JSON.parse(result.trim());
}
/**
 * TLS-fingerprinted session. Recreated after each DD solve to clear the cookie jar.
 */
var _session = null;
function getTlsSession() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!_session) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, wreq_js_1.createSession)({ browser: 'chrome_145' })];
                case 1:
                    _session = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, _session];
            }
        });
    });
}
exports.getTlsSession = getTlsSession;
function resetTlsSession() {
    if (_session) {
        try {
            _session.close();
        }
        catch (_a) { }
    }
    _session = null;
}
exports.resetTlsSession = resetTlsSession;
/**
 * POST to the DD endpoint using a separate session (no stale cookies).
 */
function ddPost(session, cid, bpc) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, body, res, dd, newCid;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = generatePayload(cid, bpc);
                    body = new URLSearchParams({
                        jspl: payload.jspl,
                        eventCounters: payload.eventCounters,
                        jsType: payload.jsType,
                        cid: cid,
                        ddk: DDK,
                        Referer: encodeURIComponent('https://soundcloud.com/discover'),
                        request: encodeURIComponent('/discover'),
                        responsePage: 'origin',
                        ddv: DDV,
                    });
                    return [4 /*yield*/, session.fetch(DD_ENDPOINT, {
                            method: 'POST',
                            headers: {
                                'sec-ch-ua-platform': '"Linux"',
                                'User-Agent': UA,
                                'sec-ch-ua': CH_UA,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'sec-ch-ua-mobile': '?0',
                                Accept: '*/*',
                                Origin: 'https://soundcloud.com',
                                'Sec-Fetch-Site': 'same-site',
                                'Sec-Fetch-Mode': 'cors',
                                'Sec-Fetch-Dest': 'empty',
                                Referer: 'https://soundcloud.com/',
                                'Accept-Encoding': 'gzip, deflate, br, zstd',
                                'Accept-Language': 'en-US,en;q=0.9',
                            },
                            body: body.toString(),
                        })];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    dd = _b.sent();
                    newCid = ((_a = (dd.cookie || '').match(/datadome=([^;]+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
                    return [2 /*return*/, newCid || cid];
            }
        });
    });
}
/**
 * Solve a DataDome challenge: bpc=1 → bpc=2 → bpc=1.
 * Uses a dedicated session for the solve, then resets the main session
 * so the API retry uses a clean cookie jar with only x-datadome-clientid.
 */
function solveDataDome(initialCid) {
    return __awaiter(this, void 0, void 0, function () {
        var solveSession, cid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, wreq_js_1.createSession)({ browser: 'chrome_145' })];
                case 1:
                    solveSession = _a.sent();
                    cid = initialCid || '.keep';
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 8, 9]);
                    return [4 /*yield*/, ddPost(solveSession, cid, 1)];
                case 3:
                    cid = _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 800 + Math.random() * 500); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, ddPost(solveSession, cid, 2)];
                case 5:
                    cid = _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1500 + Math.random() * 1000); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, ddPost(solveSession, cid, 1)];
                case 7:
                    cid = _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        solveSession.close();
                    }
                    catch (_b) { }
                    return [7 /*endfinally*/];
                case 9:
                    // Reset the main API session so the retry starts with a clean cookie jar
                    resetTlsSession();
                    return [2 /*return*/, cid];
            }
        });
    });
}
exports.solveDataDome = solveDataDome;
