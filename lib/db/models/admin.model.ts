import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure only one admin password document exists
AdminSchema.pre('save', async function (next) {
  const count = await mongoose.model('Admin').countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error('Only one admin password can exist');
  }
  next();
});

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
