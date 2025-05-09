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
exports.Resolve = void 0;
var Resolve = /** @class */ (function () {
    function Resolve(api) {
        var _this = this;
        this.api = api;
        /**
         * Gets the ID from the html source.
         */
        this.getAlt = function (resolvable) { return __awaiter(_this, void 0, void 0, function () {
            var id, html, data;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!String(resolvable).match(/\d{8,}/) &&
                            !String(resolvable).includes("soundcloud")) {
                            resolvable = "https://soundcloud.com/".concat(resolvable);
                        }
                        id = resolvable;
                        if (!String(resolvable).includes("soundcloud")) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(String(resolvable), {
                                headers: this.api.headers,
                            }).then(function (r) { return r.text(); })];
                    case 1:
                        html = _e.sent();
                        data = JSON.parse((_a = html.match(/(\[{"id")(.*?)(?=\);)/)) === null || _a === void 0 ? void 0 : _a[0]);
                        id = ((_d = (_c = (_b = data[data.length - 1]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.id)
                            ? data[data.length - 1].data[0].id
                            : data[data.length - 2].data[0].id;
                        _e.label = 2;
                    case 2: return [2 /*return*/, id];
                }
            });
        }); };
        /**
         * Gets the ID of a user/playlist/track from the Soundcloud URL using the v2 API.
         */
        this.get = function (resolvable, full) { return __awaiter(_this, void 0, void 0, function () {
            var isNumericId, id, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isNumericId = String(resolvable).match(/^\d+$/);
                        // If it's not a pure numeric ID and doesn't include soundcloud URL, prepend the soundcloud URL
                        if (!isNumericId && !String(resolvable).includes("soundcloud")) {
                            resolvable = "https://soundcloud.com/".concat(resolvable);
                        }
                        id = resolvable;
                        if (!String(resolvable).includes("soundcloud")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.getV2("resolve", { url: resolvable })];
                    case 1:
                        resolved = (_a.sent());
                        if (full)
                            return [2 /*return*/, resolved];
                        id = resolved.id;
                        _a.label = 2;
                    case 2: return [2 /*return*/, id];
                }
            });
        }); };
    }
    return Resolve;
}());
exports.Resolve = Resolve;
