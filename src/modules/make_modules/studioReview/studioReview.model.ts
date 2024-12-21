import { model, Schema, } from "mongoose";
import { TStudioReview } from './studioReview.interface';


const TStudioReviewSchema = new Schema<TStudioReview>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    studioId: { type: Schema.Types.ObjectId, required: true, ref: 'Studio' },
    reputation: { type: Number, required: true, min: 1, max: 5 },
    price: { type: Number, required: true, min: 1, max: 5 },
    location: { type: Number, required: true, min: 1, max: 5 },
    parking: { type: Number, required: true, min: 1, max: 5 },
    socks: { type: Boolean, required: true },
    validateParking: { type: Boolean, required: true },
    atmosphere: { type: Number, required: true, min: 1, max: 5 },
    availability: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, required: true, min: 1, max: 5 },
    equipment: { type: Number, required: true, min: 1, max: 5 },
    gracePeriod: { type: Number, required: true, min: 0 },
    writeReview: { type: String, required: false }
}, {
    timestamps: true,
}
);

export const studioReviewModel = model<TStudioReview>('StudioReview', TStudioReviewSchema);


