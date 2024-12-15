import mongoose, { Schema, } from 'mongoose';



const studioApproveSchema: Schema = new Schema({
    studioId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Studio',
    },
    action: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true,
});
const trainerApproveSchema: Schema = new Schema({
    trainerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer',
    },
    action: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true,
});



export const adminStudioApproveModel = mongoose.model('adminStudioApprove', studioApproveSchema);
export const admintrainerApproveModel = mongoose.model('adminTrainerApprove', trainerApproveSchema);


