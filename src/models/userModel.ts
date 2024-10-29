import { Schema, Model, model } from 'mongoose';
import { IUser } from '../interfaces/userInterface';

type UserModel = Model<IUser>;

const userSchema: Schema = new Schema<IUser, UserModel>(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    image: { type: String, require: true },
    phone: { type: String, require: true },
    profile: { type: Number, require: true },
    enable: { type: Boolean, require: true },
    birthDay: { type: Date, require: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IUser, UserModel>('User', userSchema);
