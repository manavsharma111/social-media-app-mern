import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0 // Document will automatically delete at `expiresAt`
    }
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
