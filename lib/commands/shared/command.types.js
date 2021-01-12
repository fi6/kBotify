"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultTypes = exports.CommandTypes = void 0;
var CommandTypes;
(function (CommandTypes) {
    CommandTypes["MENU"] = "MENU";
    CommandTypes["HELP"] = "HELP";
    CommandTypes["APP"] = "FUNCTION";
})(CommandTypes = exports.CommandTypes || (exports.CommandTypes = {}));
var ResultTypes;
(function (ResultTypes) {
    ResultTypes["PENDING"] = "PENDING";
    ResultTypes["SUCCESS"] = "SUCCESS";
    ResultTypes["FAIL"] = "FAIL";
    ResultTypes["ERROR"] = "ERROR";
    ResultTypes["HELP"] = "HELP";
    ResultTypes["WRONG_ARGS"] = "WRONG_ARGS";
})(ResultTypes = exports.ResultTypes || (exports.ResultTypes = {}));
//# sourceMappingURL=command.types.js.map