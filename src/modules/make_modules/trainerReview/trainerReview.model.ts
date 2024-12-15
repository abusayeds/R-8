import mongoose, { Schema, } from 'mongoose';
import { TTrainerReview } from './trainerReview.interface';
import { allowedTags } from '../trainer/traner-constant';


const trainerReviewSchema: Schema = new Schema<TTrainerReview>({
    trainerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer',
    },
    trainerRate: {
        type: Number,
        required: true,
    },
    diffcultTrainer: {
        type: Number,
        required: true,
    },
    takeClass: {
        type: Boolean,
        required: true,
    },
    freeClass: {
        type: Boolean,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
        enum: allowedTags,
    },
    musicChoice: {
        type: Number,
        required: true,
    },
    writeReview: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});



export const trainerReviewModal = mongoose.model<TTrainerReview>('TrainerReview', trainerReviewSchema);


