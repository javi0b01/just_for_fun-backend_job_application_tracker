import { Schema, Model, model } from 'mongoose';
import { IApplication } from '../interfaces/applicationInterface';

type ApplicationModel = Model<IApplication>;

const applicationSchema: Schema = new Schema<IApplication, ApplicationModel>(
  {
    userId: { type: String, require: true },
    job: {
      source: { type: String, require: true },
      uri: { type: String },
    },
    company: {
      name: { type: String, require: true },
      contact: { type: String },
      url: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    application: {
      dateApplied: { type: Date, require: true },
      response: { type: String, require: true },
      position: { type: String, require: true },
      model: { type: String, require: true },
      notes: { type: String },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IApplication, ApplicationModel>(
  'Application',
  applicationSchema
);
