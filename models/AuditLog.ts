import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'logout'],
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
  },
  details: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, action: 1 });

const AuditLog: Model<IAuditLog> = 
  mongoose.models.AuditLog || 
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;