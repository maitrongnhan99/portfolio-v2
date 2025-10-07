import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserLegacy extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserLegacySchema = new Schema<IUserLegacy>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

// Hash password before saving
UserLegacySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Index for faster queries
// Note: Email index removed to avoid duplicate index warning with Payload CMS
// The unique: true constraint on email field still provides uniqueness
UserLegacySchema.index({ role: 1 });

const UserLegacy: Model<IUserLegacy> = 
  mongoose.models.UserLegacy || 
  mongoose.model<IUserLegacy>('UserLegacy', UserLegacySchema);

export default UserLegacy;