import { Document } from "mongoose";

export type IPendingUser = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
} & Document;

export type IUser = {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  image?: {
    publicFileURL: string;
    path: string;
  };
  role: "admin" | "user";
  isblock: boolean
  report: number
  isDeleted: boolean;
} & Document;

export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;
