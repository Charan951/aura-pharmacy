import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageData: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminComment: {
      type: String,
      trim: true,
    },
    decidedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;

