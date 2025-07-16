import mongoose, { Document, Schema } from 'mongoose';

// Interface for wallet transaction
export interface IWalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 'mt5_to_wallet' | 'wallet_to_mt5';
  amount: number;
  fee?: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  timestamp: string;
  description: string;
  reference: string;
  fromAccount?: string;
  toAccount?: string;
  transactionHash?: string;
  notes?: string;
}

// Interface for User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'manager';
  isActive: boolean;
  loginId?: number; // MT5 login ID when linked
  mt5Accounts: number[]; // Array of MT5 account logins
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Wallet fields
  walletBalance?: number;
  pendingBalance?: number;
  walletTransactions?: IWalletTransaction[];
  
  // Virtual fields
  fullName: string;
}

// User schema
const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginId: {
    type: Number,
    sparse: true, // Allows multiple null values but unique non-null values
    index: true
  },
  mt5Accounts: [{
    type: Number,
    index: true
  }],
  lastLoginAt: {
    type: Date
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  pendingBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  walletTransactions: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'mt5_to_wallet', 'wallet_to_mt5'],
      required: true 
    },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, min: 0 },
    status: { 
      type: String, 
      enum: ['completed', 'pending', 'failed', 'cancelled'],
      default: 'pending'
    },
    timestamp: { type: String, required: true },
    description: { type: String, required: true },
    reference: { type: String, required: true },
    fromAccount: String,
    toAccount: String,
    transactionHash: String,
    notes: String
  }]
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ mt5Accounts: 1 });
UserSchema.index({ createdAt: -1 });

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByMT5Account = function(loginId: number) {
  return this.findOne({ mt5Accounts: loginId });
};

// Instance methods
UserSchema.methods.addMT5Account = function(loginId: number) {
  if (!this.mt5Accounts.includes(loginId)) {
    this.mt5Accounts.push(loginId);
  }
  return this.save();
};

UserSchema.methods.removeMT5Account = function(loginId: number) {
  this.mt5Accounts = this.mt5Accounts.filter((id: number) => id !== loginId);
  return this.save();
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Pre-save middleware
UserSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Export the model
export const User = mongoose.model<IUser>('User', UserSchema);

export default User;