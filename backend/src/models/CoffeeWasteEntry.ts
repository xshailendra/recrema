import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICoffeeWasteEntry extends Document {
  clientId: Types.ObjectId;
  quantityKg: number;
  wasteDate: Date;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoffeeWasteEntrySchema = new Schema<ICoffeeWasteEntry>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quantityKg: { type: Number, required: true, min: 0.0001 },
    wasteDate: { type: Date, required: true, index: true },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String, trim: true, maxlength: 1000 },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying a specific client's entries by date
CoffeeWasteEntrySchema.index({ clientId: 1, wasteDate: -1 });
// Compound index for Insights aggregation filtering
CoffeeWasteEntrySchema.index({ status: 1, wasteDate: -1 });
// Index on createdAt is often useful for sorting newest first
CoffeeWasteEntrySchema.index({ createdAt: -1 });

export const CoffeeWasteEntry = mongoose.model<ICoffeeWasteEntry>(
  'CoffeeWasteEntry',
  CoffeeWasteEntrySchema,
  'coffeeWasteEntries'
);
