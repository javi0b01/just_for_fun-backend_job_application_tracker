import { Schema, Model, model } from 'mongoose';
import { IRecord } from '../interfaces/recordInterface';

type RecordModel = Model<IRecord>;

const recordSchema: Schema = new Schema<IRecord, RecordModel>(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: Number, require: true },
    enable: { type: Boolean, require: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IRecord, RecordModel>('Record', recordSchema);
