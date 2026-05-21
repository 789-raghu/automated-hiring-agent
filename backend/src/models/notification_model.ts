import mongoose, { Schema } from "mongoose";
import { INotification } from "../@types/notifications";

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true },
        type: {
            type: String,
            enum: ["application_update", "interview", "result"],
            required: true,
        },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
