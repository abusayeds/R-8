"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAverages = exports.calculateReviewQuality2 = exports.calculateReviewQuality = exports.studioSearchbleField = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
exports.studioSearchbleField = ["studioName", "studioCity", "neighborhood"];
const calculateReviewQuality = (reviewData) => {
    const fieldsToSum = [
        reviewData.reputation,
        reviewData.price,
        reviewData.location,
        reviewData.parking,
        reviewData.atmosphere,
        reviewData.availability,
        reviewData.cleanliness,
        reviewData.equipment,
        reviewData.gracePeriod
    ];
    const total = fieldsToSum.reduce((acc, val) => acc + val, 0);
    const quality = total / fieldsToSum.length;
    return Object.assign(Object.assign({}, reviewData), { quality: quality.toFixed(1) });
};
exports.calculateReviewQuality = calculateReviewQuality;
const calculateReviewQuality2 = (reviewData) => {
    const fieldsToSum = [
        reviewData.reputation,
        reviewData.price,
        reviewData.location,
        reviewData.parking,
        reviewData.atmosphere,
        reviewData.availability,
        reviewData.cleanliness,
        reviewData.equipment,
        reviewData.gracePeriod
    ];
    const total = fieldsToSum.reduce((acc, val) => acc + val, 0);
    const quality = total / fieldsToSum.length;
    return { quality: quality.toFixed(1) };
};
exports.calculateReviewQuality2 = calculateReviewQuality2;
// Define default averages
exports.defaultAverages = {
    avgReputation: 0,
    avgLocation: 0,
    avgParking: 0,
    avgAtmosphere: 0,
    avgAvailability: 0,
    avgCleanliness: 0,
    avgEquipment: 0,
    avgGracePeriod: 0,
    avgShock: false,
    avgValidateParking: false,
};
