import mongoose, { Schema, } from 'mongoose'
import { TStudio } from './studio-interfacer';

const studioSchema = new Schema<TStudio>({
    studioName: { type: String, required: true },
    neighborhood: { type: String, required: true },
    studioCity: { type: String, required: true },
    isDeleted : {
        type : Boolean, 
        required : true,
        default : false
    },
    isApprove: { type: Boolean, default: false },
}, { timestamps: true });


const studioModel = mongoose.model<TStudio>('Studio', studioSchema);

export default studioModel;
