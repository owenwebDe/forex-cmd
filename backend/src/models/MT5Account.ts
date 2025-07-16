import mongoose, { Document, Schema } from 'mongoose';

// Interface for MT5Account document
export interface IMT5Account extends Document {
  _id: mongoose.Types.ObjectId;
  login: number; // MT5 login ID
  userId: mongoose.Types.ObjectId; // Reference to User
  name: string;
  email: string;
  server: string;
  group: string;
  leverage: number;
  accountType: 'demo' | 'live';
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
}

// MT5Account schema
const MT5AccountSchema: Schema<IMT5Account> = new Schema({
  login: {
    type: Number,
    required: [true, 'MT5 login ID is required'],
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  server: {
    type: String,
    required: [true, 'Server is required'],
    trim: true
  },
  group: {
    type: String,
    required: [true, 'Group is required'],
    trim: true
  },
  leverage: {
    type: Number,
    required: [true, 'Leverage is required'],
    min: [1, 'Leverage must be at least 1'],
    max: [1000, 'Leverage cannot exceed 1000']
  },
  accountType: {
    type: String,
    enum: ['demo', 'live'],
    required: [true, 'Account type is required'],
    default: 'demo'
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required'],
    default: 0,
    get: (v: number) => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  equity: {
    type: Number,
    required: [true, 'Equity is required'],
    default: 0,
    get: (v: number) => Math.round(v * 100) / 100
  },
  margin: {
    type: Number,
    required: [true, 'Margin is required'],
    default: 0,
    get: (v: number) => Math.round(v * 100) / 100
  },
  freeMargin: {
    type: Number,
    required: [true, 'Free margin is required'],
    default: 0,
    get: (v: number) => Math.round(v * 100) / 100
  },
  marginLevel: {
    type: Number,
    required: [true, 'Margin level is required'],
    default: 0,
    get: (v: number) => Math.round(v * 100) / 100
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true,
    trim: true,
    maxlength: [3, 'Currency code must be 3 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSyncAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Indexes for better performance
MT5AccountSchema.index({ login: 1 });
MT5AccountSchema.index({ userId: 1 });
MT5AccountSchema.index({ accountType: 1 });
MT5AccountSchema.index({ isActive: 1 });
MT5AccountSchema.index({ createdAt: -1 });

// Virtual fields
MT5AccountSchema.virtual('profitLoss').get(function(this: IMT5Account) {
  return this.equity - this.balance;
});

MT5AccountSchema.virtual('profitLossPercentage').get(function(this: IMT5Account) {
  if (this.balance === 0) return 0;
  return ((this.equity - this.balance) / this.balance) * 100;
});

// Static methods
MT5AccountSchema.statics.findByLogin = function(login: number) {
  return this.findOne({ login });
};

MT5AccountSchema.statics.findByUser = function(userId: mongoose.Types.ObjectId) {
  return this.find({ userId, isActive: true });
};

MT5AccountSchema.statics.findActiveAccounts = function() {
  return this.find({ isActive: true }).populate('userId', 'firstName lastName email');
};

// Instance methods
MT5AccountSchema.methods.updateBalance = function(balance: number, equity: number, margin: number, freeMargin: number, marginLevel: number) {
  this.balance = balance;
  this.equity = equity;
  this.margin = margin;
  this.freeMargin = freeMargin;
  this.marginLevel = marginLevel;
  this.lastSyncAt = new Date();
  return this.save();
};

MT5AccountSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Pre-save middleware
MT5AccountSchema.pre('save', function(next) {
  // Update lastSyncAt when balance fields are modified
  if (this.isModified(['balance', 'equity', 'margin', 'freeMargin', 'marginLevel'])) {
    this.lastSyncAt = new Date();
  }
  next();
});

// Export the model
export const MT5Account = mongoose.model<IMT5Account>('MT5Account', MT5AccountSchema);

export default MT5Account;