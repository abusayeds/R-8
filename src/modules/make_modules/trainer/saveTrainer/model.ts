import mongoose, { Schema, Types } from "mongoose";
 
export type  TSaveTrainer = {
        userId : Types.ObjectId
        trainerId: Types.ObjectId,
}

const savedTrainerSchema = new Schema<TSaveTrainer >({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    trainerId: { type: Schema.Types.ObjectId, required: true, ref: 'Trainer' },

}, { timestamps: true });
export const savedTrainerModel = mongoose.model<TSaveTrainer>('savedTrainer', savedTrainerSchema);
