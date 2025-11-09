import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    img: [
      {
        type: String,
        trim: true,
      },
    ],
    heading: [
      {
        type: String,
        trim: true,
      },
    ],
    msg: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "vouchers",
  }
);

// ✅ Optional: Example index (you can change based on your query usage)
voucherSchema.index({ title: 1 });

export const VoucherSchema = mongoose.model("Voucher", voucherSchema);
