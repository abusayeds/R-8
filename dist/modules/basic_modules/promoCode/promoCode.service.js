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
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoCodeRestore = exports.promoCodeDelete = exports.promoCodeUpdate = exports.findPromoCodeById = exports.promoCodesList = exports.promoCodeCreate = exports.findPromoCodeByCode = void 0;
const promoCode_model_1 = require("./promoCode.model");
const findPromoCodeByCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promoCode_model_1.PromoCodeModel.findOne({ code });
});
exports.findPromoCodeByCode = findPromoCodeByCode;
const promoCodeCreate = (promoCodeData) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCode = yield promoCode_model_1.PromoCodeModel.create(promoCodeData);
    return promoCode.toObject(); // Convert to plain object
});
exports.promoCodeCreate = promoCodeCreate;
// export const promoCodesList = async (
//   page: number = 1,
//   limit: number = 10,
//   date?: string,
//   duration?: string
// ): Promise<{ promoCodes: IPromoCode[], totalPromoCodes: number, totalPages: number }> => {
//   const skip = (page - 1) * limit;
//   const query: any = { isDeleted: { $ne: true } }; // Filter out promo codes where isDeleted is true
//   if (duration) {
//     query.duration = duration; // Add duration to the query
//   }
//   // Date filtering logic
//   if (date) {
//     // Parse the input date (DD-MM-YYYY)
//     const [day, month, year] = date.split("-").map(Number);
//     // Create start and end Date objects
//     const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Start of the day (00:00:00 UTC)
//     const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1)); // End of the day (23:59:59 UTC)
//     // Add date filter to query
//     query.createdAt = { $gte: startDate, $lte: endDate };
//   }
//   // Query for promo codes with pagination and filtering
//   const promoCodes = await PromoCodeModel.aggregate<IPromoCode>([
//     { $match: query },
//     {
//       $setWindowFields: {
//         sortBy: { createdAt: -1 },
//         output: {
//           serial: {
//             $documentNumber: {}
//           }
//         }
//       }
//     },
//     {
//       $addFields: {
//         numericDuration: { $toInt: "$duration" } // Convert string to integer directly
//       }
//     },
//     {
//       $addFields: {
//         formattedDuration: {
//           $cond: {
//             if: { $lte: ['$numericDuration', 12] },
//             then: {
//               $concat: [
//                 { $toString: '$numericDuration' }, ' ',
//                 { $cond: { if: { $eq: ['$numericDuration', 1] }, then: 'month', else: 'months' } }
//               ]
//             },
//             else: {
//               $let: {
//                 vars: {
//                   years: { $floor: { $divide: ['$numericDuration', 12] } },
//                   months: { $mod: ['$numericDuration', 12] }
//                 },
//                 in: {
//                   $concat: [
//                     { $toString: '$$years' }, ' year', { $cond: { if: { $eq: ['$$years', 1] }, then: '', else: 's' } },
//                     { $cond: { if: { $gt: ['$$months', 0] }, then: { $concat: [' ', { $toString: '$$months' }, ' month', { $cond: { if: { $eq: ['$$months', 1] }, then: '', else: 's' } }] }, else: '' } }
//                   ]
//                 }
//               }
//             }
//           }
//         }
//       }
//     },
//     {
//       $project: {
//         serial: 1,         // Include the serial field
//         code: 1,           // Include coupon code
//         status: 1,
//         subscription: 1,
//         duration: "$formattedDuration", // Use formattedDuration as duration
//         createdAt: 1,
//         activeDate: 1,
//         expiryDate:1// Include createdAt field
//       }
//     },
//     { $skip: skip },     // Skipping records for pagination
//     { $limit: limit },   // Limiting the number of records per page
//   ]);
//   // Get the total number of promo codes for calculating total pages
//   const totalPromoCodes = await PromoCodeModel.countDocuments(query);
//   const totalPages = Math.ceil(totalPromoCodes / limit);
//   return { promoCodes, totalPromoCodes, totalPages };
// };
//with out spanish language
// export const promoCodesList = async (
//   page: number = 1,
//   limit: number = 10,
//   date?: string,
//   duration?: string,
// ): Promise<{
//   promoCodes: IPromoCode[];
//   totalPromoCodes: number;
//   totalPages: number;
// }> => {
//   const skip = (page - 1) * limit;
//   const query: any = { isDeleted: { $ne: true } }; // Filter out promo codes where isDeleted is true
//   if (duration) {
//     query.duration = duration; // Add duration to the query
//   }
//   // Date filtering logic
//   if (date) {
//     // Parse the input date (DD-MM-YYYY)
//     const [day, month, year] = date.split("-").map(Number);
//     // Create start and end Date objects
//     const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Start of the day (00:00:00 UTC)
//     const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1)); // End of the day (23:59:59 UTC)
//     // Add date filter to query
//     query.createdAt = { $gte: startDate, $lte: endDate };
//   }
//   // Query for promo codes with pagination and filtering
//   const promoCodes = await PromoCodeModel.aggregate<IPromoCode>([
//     { $match: query },
//     {
//       $setWindowFields: {
//         sortBy: { createdAt: -1 },
//         output: {
//           serial: {
//             $documentNumber: {},
//           },
//         },
//       },
//     },
//     {
//       $addFields: {
//         numericDuration: { $toInt: "$duration" }, // Convert string to integer directly
//       },
//     },
//     {
//       $addFields: {
//         formattedDuration: {
//           $cond: {
//             if: { $lte: ["$numericDuration", 12] },
//             then: {
//               $concat: [
//                 { $toString: "$numericDuration" },
//                 " ",
//                 {
//                   $cond: {
//                     if: { $eq: ["$numericDuration", 1] },
//                     then: "month",
//                     else: "months",
//                   },
//                 },
//               ],
//             },
//             else: {
//               $let: {
//                 vars: {
//                   years: { $floor: { $divide: ["$numericDuration", 12] } },
//                   months: { $mod: ["$numericDuration", 12] },
//                 },
//                 in: {
//                   $concat: [
//                     { $toString: "$$years" },
//                     " year",
//                     {
//                       $cond: {
//                         if: { $eq: ["$$years", 1] },
//                         then: "",
//                         else: "s",
//                       },
//                     },
//                     {
//                       $cond: {
//                         if: { $gt: ["$$months", 0] },
//                         then: {
//                           $concat: [
//                             " ",
//                             { $toString: "$$months" },
//                             " month",
//                             {
//                               $cond: {
//                                 if: { $eq: ["$$months", 1] },
//                                 then: "",
//                                 else: "s",
//                               },
//                             },
//                           ],
//                         },
//                         else: "",
//                       },
//                     },
//                   ],
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         serial: 1, // Include the serial field
//         code: 1, // Include coupon code
//         status: 1,
//         subscription: 1,
//         duration: "$formattedDuration", // Use formattedDuration as duration
//         createdAt: {
//           $dateToString: {
//             format: "%d %B %Y",
//             date: "$createdAt",
//             timezone: "UTC",
//           },
//         }, // Format createdAt
//         activeDate: {
//           $cond: {
//             if: { $not: [{ $ifNull: ["$activeDate", false] }] }, // Check if activeDate exists
//             then: null,
//             else: {
//               $dateToString: {
//                 format: "%d %B %Y",
//                 date: "$activeDate",
//                 timezone: "UTC",
//               },
//             },
//           },
//         },
//         expiryDate: {
//           $cond: {
//             if: { $not: [{ $ifNull: ["$expiryDate", false] }] }, // Check if expiryDate exists
//             then: null,
//             else: {
//               $dateToString: {
//                 format: "%d %B %Y",
//                 date: "$expiryDate",
//                 timezone: "UTC",
//               },
//             },
//           },
//         },
//       },
//     },
//     { $skip: skip }, // Skipping records for pagination
//     { $limit: limit }, // Limiting the number of records per page
//   ]);
//   // Get the total number of promo codes for calculating total pages
//   const totalPromoCodes = await PromoCodeModel.countDocuments(query);
//   const totalPages = Math.ceil(totalPromoCodes / limit);
//   return { promoCodes, totalPromoCodes, totalPages };
// };
//with spanish language
const promoCodesList = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, date, duration) {
    const skip = (page - 1) * limit;
    const query = { isDeleted: { $ne: true } }; // Filter out promo codes where isDeleted is true
    if (duration) {
        query.duration = duration; // Add duration to the query
    }
    // Date filtering logic
    if (date) {
        // Parse the input date (DD-MM-YYYY)
        const [day, month, year] = date.split("-").map(Number);
        // Create start and end Date objects
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Start of the day (00:00:00 UTC)
        const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1)); // End of the day (23:59:59 UTC)
        // Add date filter to query
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    // Query for promo codes with pagination and filtering
    const promoCodes = yield promoCode_model_1.PromoCodeModel.aggregate([
        { $match: query },
        {
            $setWindowFields: {
                sortBy: { createdAt: -1 },
                output: {
                    serial: {
                        $documentNumber: {},
                    },
                },
            },
        },
        {
            $addFields: {
                numericDuration: { $toInt: "$duration" }, // Convert string to integer directly
            },
        },
        {
            $addFields: {
                formattedDuration: {
                    $cond: {
                        if: { $lte: ["$numericDuration", 12] },
                        then: {
                            $concat: [
                                { $toString: "$numericDuration" },
                                " ",
                                {
                                    $cond: {
                                        if: { $eq: ["$numericDuration", 1] },
                                        then: "month",
                                        else: "months",
                                    },
                                },
                            ],
                        },
                        else: {
                            $let: {
                                vars: {
                                    years: { $floor: { $divide: ["$numericDuration", 12] } },
                                    months: { $mod: ["$numericDuration", 12] },
                                },
                                in: {
                                    $concat: [
                                        { $toString: "$$years" },
                                        " ",
                                        {
                                            $cond: {
                                                if: { $eq: ["$$years", 1] },
                                                then: "year",
                                                else: "years",
                                            },
                                        },
                                        {
                                            $cond: {
                                                if: { $gt: ["$$months", 0] },
                                                then: {
                                                    $concat: [
                                                        " ",
                                                        { $toString: "$$months" },
                                                        " ",
                                                        {
                                                            $cond: {
                                                                if: { $eq: ["$$months", 1] },
                                                                then: "month",
                                                                else: "months",
                                                            },
                                                        },
                                                    ],
                                                },
                                                else: "",
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                serial: 1, // Include the serial field
                code: 1, // Include coupon code
                status: 1,
                subscription: 1,
                duration: "$formattedDuration", // Use formattedDuration as duration
                createdAt: {
                    $dateToString: {
                        format: "%d %B %Y",
                        date: "$createdAt",
                        timezone: "UTC",
                    },
                }, // Format createdAt
                activeDate: {
                    $cond: {
                        if: { $not: [{ $ifNull: ["$activeDate", false] }] }, // Check if activeDate exists
                        then: null,
                        else: {
                            $dateToString: {
                                format: "%d %B %Y",
                                date: "$activeDate",
                                timezone: "UTC",
                            },
                        },
                    },
                },
                expiryDate: {
                    $cond: {
                        if: { $not: [{ $ifNull: ["$expiryDate", false] }] }, // Check if expiryDate exists
                        then: null,
                        else: {
                            $dateToString: {
                                format: "%d %B %Y",
                                date: "$expiryDate",
                                timezone: "UTC",
                            },
                        },
                    },
                },
            },
        },
        { $skip: skip }, // Skipping records for pagination
        { $limit: limit }, // Limiting the number of records per page
    ]);
    // Get the total number of promo codes for calculating total pages
    const totalPromoCodes = yield promoCode_model_1.PromoCodeModel.countDocuments(query);
    const totalPages = Math.ceil(totalPromoCodes / limit);
    return { promoCodes, totalPromoCodes, totalPages };
});
exports.promoCodesList = promoCodesList;
const findPromoCodeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCode = yield promoCode_model_1.PromoCodeModel.findById(id);
    return promoCode ? promoCode.toObject() : null; // Convert to plain object
});
exports.findPromoCodeById = findPromoCodeById;
const promoCodeUpdate = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPromoCode = yield promoCode_model_1.PromoCodeModel.findByIdAndUpdate(id, updateData, { new: true });
    return updatedPromoCode ? updatedPromoCode.toObject() : null; // Convert to plain object
});
exports.promoCodeUpdate = promoCodeUpdate;
const promoCodeDelete = (promoId) => __awaiter(void 0, void 0, void 0, function* () {
    yield promoCode_model_1.PromoCodeModel.findByIdAndUpdate(promoId, { isDeleted: true });
});
exports.promoCodeDelete = promoCodeDelete;
const promoCodeRestore = (promoId) => __awaiter(void 0, void 0, void 0, function* () {
    yield promoCode_model_1.PromoCodeModel.findByIdAndUpdate(promoId, { isDeleted: false });
});
exports.promoCodeRestore = promoCodeRestore;
