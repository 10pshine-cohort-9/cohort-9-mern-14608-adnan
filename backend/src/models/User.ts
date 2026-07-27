import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err instanceof Error ? err : new Error("Password hashing failed");
  }
});

userSchema.method("comparePassword", async function (candidate: string) {
  try {
    return await bcrypt.compare(candidate, this.password);
  } catch (err) {
    throw err instanceof Error ? err : new Error("Password comparison failed");
  }
});
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
