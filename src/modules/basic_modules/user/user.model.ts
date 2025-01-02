import mongoose, { Schema } from "mongoose";
import { IPendingUser, IUser, IOTP } from "./user.interface";

const PendingUserSchema = new Schema<IPendingUser>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    fristName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    confirmPassword: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
  },
  { timestamps: true },
);


export const PendingUserModel = mongoose.model<IPendingUser>(
  "PendingUser",
  PendingUserSchema,
);


const UserSchema = new Schema<IUser>(
  {
    fristName: { type: String,  trim: true },
    lastName: { type: String,  trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, trim: true },
    confirmPassword: { type: String, trim: true },
    address: { type: String, trim: true },
    image: {
      type: {
        publicFileURL: { type: String, trim: true },
        path: { type: String, trim: true },
      },
      required: false,
      default: {
        publicFileURL: "/images/user.png",
        path: "public\\images\\user.png",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isblock: {
      type: Boolean,
      default: false,
    },
     report: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true },
});

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
