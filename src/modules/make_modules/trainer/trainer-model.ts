import mongoose, { Schema, } from 'mongoose'
import { TTrainer } from './trainer-interfacer';




const trainerSchema = new Schema<TTrainer>({
    studioId: { type: Schema.Types.ObjectId, required: true, ref: 'Studio' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    studioName: { type: String, required: true },
    neighborhood : { type: String, required: true },
    trainingType: {
        type: String,
        enum: ["Heated Yoga", "Pilates", "Lagree", "Boxing", "HILT", "Other"],
        required: true
    }
    , 
    isDeleted : {
        type : Boolean, 
        required : true,
        default : false
    },
    isApprove: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true });


export const trainerModel = mongoose.model<TTrainer>('Trainer', trainerSchema);

