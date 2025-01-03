"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioReviewModel = void 0;
const mongoose_1 = require("mongoose");
const TStudioReviewSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    studioId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Studio' },
    reputation: { type: Number, required: true, min: 1, max: 5 },
    price: { type: Number, required: true, min: 1, max: 5 },
    location: { type: Number, required: true, min: 1, max: 5 },
    parking: { type: Number, required: true, min: 1, max: 5 },
    socks: { type: Boolean, required: true },
    validateParking: { type: Boolean, required: true },
    atmosphere: { type: Number, required: true, min: 1, max: 5 },
    availability: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, required: true, min: 1, max: 5 },
    equipment: { type: Number, required: true, min: 1, max: 5 },
    gracePeriod: { type: Number, required: true, min: 0 },
    writeReview: { type: String, required: false }
}, {
    timestamps: true,
});
exports.studioReviewModel = (0, mongoose_1.model)('StudioReview', TStudioReviewSchema);
