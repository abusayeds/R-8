import { Types } from "mongoose"

export type TReport  = {
    reportUser : Types.ObjectId
    reviewId : string
    userId : string
    write: string
    isDeleted : boolean
   
}