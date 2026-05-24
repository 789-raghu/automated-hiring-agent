import { Document } from "mongoose";
import { NotificationType } from "./enums";

export interface INotification extends Document {
  userId:  string;
  type:    NotificationType;
  message: string;
  isRead:  boolean;
}
