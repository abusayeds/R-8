import { Types } from "mongoose"

export type TStudioReview = {
    userId: Types.ObjectId,
    studioId: Types.ObjectId,
    reputation: number
    price: number
    location: number
    parking: number
    socks: boolean
    validateParking: boolean
    atmosphere: number
    availability: number
    cleanliness: number
    equipment: number
    gracePeriod: number
    writeReview?: string
}