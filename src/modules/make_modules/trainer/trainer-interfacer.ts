
import { Types } from "mongoose"
export type TTrainer = {
    studioId: Types.ObjectId,
    firstName: string,
    lastName: string,
    studioName: string,
    neighborhood : string
    trainingType: "Heated Yoga" | "Pilates" | "Lagree" | "Boxing" | "HILT" | "other",
    isDeleted : boolean
    isApprove: boolean
}