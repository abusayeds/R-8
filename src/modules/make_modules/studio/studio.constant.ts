/* eslint-disable @typescript-eslint/no-explicit-any */
export const studioSearchbleField = [ "studioName", ]

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
