import { TStudio } from "./studio-interfacer";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const studioSearchbleField: Array<keyof TStudio>  = [ "studioName", "studioCity" , "neighborhood" ]

export const calculateReviewQuality = (reviewData: any) => {
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
    
    return { ...reviewData, quality: quality.toFixed(1) };
};
export const calculateReviewQuality2 = (reviewData: any) => {
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
    
    return {  quality: quality.toFixed(1) };
};



    // Define default averages
   export const defaultAverages = {
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