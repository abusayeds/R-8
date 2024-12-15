import { Document,  } from "mongoose";

export type ISubscription = {
  name: string;
  price: string;
  duration: string;
  isDeleted: boolean;
} & Document;
