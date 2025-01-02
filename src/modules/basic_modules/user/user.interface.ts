import { Document } from "mongoose";

export type IPendingUser = {
  email: string;
  fristName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
} & Document;

export type IUser = {
  fristName: string;
  lastName: string;
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
