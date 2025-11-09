// models/admin.model.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
    collection: "admin",
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password; // remove password from JSON responses
      },
    },
  }
);

// ✅ Virtual ID field
adminSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const AdminSchema = mongoose.model("Admin", adminSchema);
