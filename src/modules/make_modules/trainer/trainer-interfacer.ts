
import { Types } from "mongoose"
import { allowedTags } from "./traner-constant"

export type TTrainer = {
    studioId: Types.ObjectId,
    firstName: string,
    lastName: string,
    studioName: string,
    trainingType: "Heated Yoga" | "Pilates" | "Lagree" | "Boxing" | "HILT" | "Other",
    rating: Record<"1" | "2" | "3" | "4" | "5", number>,
    diffcultTrainer: number
    takeClass: number,
    topTags : typeof allowedTags[]
    isDeleted : boolean
    isApprove: boolean
}