"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conn_1 = __importDefault(require("../db/conn"));
const mongoose_1 = require("mongoose");
// Schema para UserDetails
const UserDetailsSchema = new mongoose_1.Schema({
    userName: { type: String, default: null },
    userId: { type: String, required: true },
    primaryPresence: [{
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            systemPresence: { type: String, required: true },
            organizationPresenceId: { type: String, required: true }
        }]
});
// Modelo para UserDetails
const Requests = conn_1.default.model('Requests', UserDetailsSchema);
exports.default = Requests;
//# sourceMappingURL=Requests.js.map