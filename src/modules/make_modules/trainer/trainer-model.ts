import mongoose, { Schema, } from 'mongoose'
import { TTrainer } from './trainer-interfacer';
import { allowedTags } from './traner-constant';



const trainerSchema = new Schema<TTrainer>({
    studioId: { type: Schema.Types.ObjectId, required: true, ref: 'Studio' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    studioName: { type: String, required: true },
    trainingType: {
        type: String,
        enum: ["Heated Yoga", "Pilates", "Lagree", "Boxing", "HILT", "Other"],
        required: true
    }
    , rating: {
        type: Map,
        of: Number,
        default: () => ({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 })
    },
    diffcultTrainer: {
        type: Number,
        default: 0,
        required: true
    },
    takeClass: {
        type: Number,
        default: 0,
        required: true
    },
    topTags: {
        type: [String],
        required: true,
        enum: allowedTags,
    },
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

