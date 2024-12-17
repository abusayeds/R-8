import mongoose, { Schema } from "mongoose";

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

interface IUserVisit extends Document {
  date: string; // Date of the visit
  deviceName: string; // Device name or user agent
  count: number; // Count for the specific device
}

const userVisitSchema = new Schema<IUserVisit>({
  date: { type: String, required: true },
  deviceName: { type: String, required: true },
  count: { type: Number, default: 1 },
});

const UserVisit = mongoose.model<IUserVisit>("UserVisit", userVisitSchema);
export default UserVisit;

export const adminStudioApproveModel = mongoose.model(
  "adminStudioApprove",
  studioApproveSchema
);
export const admintrainerApproveModel = mongoose.model(
  "adminTrainerApprove",
  trainerApproveSchema
);
