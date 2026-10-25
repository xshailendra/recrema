import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'client' | 'admin';
  clientCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    clientCode: { type: String, unique: true, sparse: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Exclude passwordHash from JSON responses by default when using toJSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete (ret as any).passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema, 'users');
