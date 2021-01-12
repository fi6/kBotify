"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentionById = void 0;
function mentionById(id, preSpace = false, postSpace = true) {
    return ''.concat(preSpace ? ' ' : '', `(met)${id}(met)`, postSpace ? ' ' : '');
}
exports.mentionById = mentionById;
//# sourceMappingURL=mention-by-id.js.map