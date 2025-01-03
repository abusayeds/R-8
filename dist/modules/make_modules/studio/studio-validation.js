"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudioValidation = void 0;
const zod_1 = require("zod");
exports.createStudioValidation = zod_1.z.object({
    body: zod_1.z.object({
        studioName: zod_1.z.string().min(1, { message: "Studio name is required" }),
        neighborhood: zod_1.z.string().min(1, { message: "Neighborhood is required" }),
        studioCity: zod_1.z.string().min(1, { message: "Studio city is required" }),
    })
});
