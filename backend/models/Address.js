import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    line1: {
      type: String,
      required: [true, "Address line 1 is required"],
    },
    line2: String,
    city: {
      type: String,
      required: [true, "City is required"],
    },
    province: {
      type: String,
      required: [true, "Province is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
    country: {
      type: String,
      default: "Sri Lanka",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    type: {
      type: String,
      enum: {
        values: ["home", "work"],
        message: "Address type must be either 'home' or 'work'"
      },
      required: [true, "Address type is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

addressSchema.index({ userId: 1, type: 1 }, { unique: true });

addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
      },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const UserAddress = mongoose.model('UserAddress', addressSchema);
export default UserAddress;