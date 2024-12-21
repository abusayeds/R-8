import mongoose, { Schema } from "mongoose";
import { TVisitor } from "./admin-interface";

const studioApproveSchema: Schema = new Schema(
  {
    studioId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Studio",
    },
    action: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const trainerApproveSchema: Schema = new Schema(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Trainer",
    },
    action: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



const userVisitSchema = new Schema<TVisitor>({
  count: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export const userVisitModel = mongoose.model<TVisitor>("UserVisit", userVisitSchema);


export const adminStudioApproveModel = mongoose.model(
  "adminStudioApprove",
  studioApproveSchema
);
export const admintrainerApproveModel = mongoose.model(
  "adminTrainerApprove",
  trainerApproveSchema
);
