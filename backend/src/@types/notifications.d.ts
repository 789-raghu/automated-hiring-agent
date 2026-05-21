import { Document } from "mongoose";

export interface INotification extends Document {
    userId: string;
    type: "application_update" | "interview" | "result";
    message: string;
    isRead: boolean;
}