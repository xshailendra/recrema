import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  performedBy: Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt for logs
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema, 'auditLogs');
