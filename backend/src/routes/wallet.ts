import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { MT5Service } from '../services/mt5Service';

const router = Router();

// Apply auth middleware to all wallet routes
router.use(authMiddleware);

// Get wallet balance
router.get('/balance', async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return wallet balance
    const walletBalance = {
      available: user.walletBalance || 0,
      pending: user.pendingBalance || 0,
      total: (user.walletBalance || 0) + (user.pendingBalance || 0),
      currency: 'USD'
    };

    res.json(walletBalance);
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get MT5 accounts for wallet operations
router.get('/mt5-accounts', async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get MT5 accounts from MT5 service
    const mt5Service = new MT5Service();
    const accounts = await mt5Service.getUserAccounts(user.email);
    
    res.json(accounts);
  } catch (error) {
    console.error('Get MT5 accounts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Transfer from wallet to MT5
router.post('/transfer-to-mt5', [
  body('mt5Login').isNumeric().withMessage('MT5 login must be a number'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('description').optional().isString().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mt5Login, amount, description } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check wallet balance
    if ((user.walletBalance || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Calculate transfer fee (0.5% or minimum $1)
    const feeRate = 0.005;
    const fee = Math.max(amount * feeRate, 1);
    const totalDeduction = amount + fee;

    if ((user.walletBalance || 0) < totalDeduction) {
      return res.status(400).json({ message: 'Insufficient balance including fees' });
    }

    try {
      // Process transfer through MT5 service
      const mt5Service = new MT5Service();
      const transferResult = await mt5Service.depositToAccount(mt5Login, amount);

      if (!transferResult.success) {
        return res.status(400).json({ message: 'MT5 transfer failed', details: transferResult.error });
      }

      // Update user wallet balance
      user.walletBalance = (user.walletBalance || 0) - totalDeduction;
      await user.save();

      // Create transaction record
      const transaction = {
        id: `wallet_txn_${Date.now()}`,
        type: 'wallet_to_mt5',
        amount: amount,
        fee: fee,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: description || `Transfer to MT5 Account #${mt5Login}`,
        reference: `TXN${Date.now()}`,
        fromAccount: 'My Wallet',
        toAccount: `MT5 #${mt5Login}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 12)}...`,
        notes: description
      };

      // Add to user's transaction history
      if (!user.walletTransactions) {
        user.walletTransactions = [];
      }
      user.walletTransactions.unshift(transaction);
      await user.save();

      res.json({
        success: true,
        message: 'Transfer completed successfully',
        transaction,
        newBalance: user.walletBalance
      });

    } catch (mt5Error) {
      console.error('MT5 transfer error:', mt5Error);
      res.status(500).json({ message: 'MT5 service error', details: mt5Error.message });
    }

  } catch (error) {
    console.error('Wallet to MT5 transfer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Transfer from MT5 to wallet
router.post('/transfer-from-mt5', [
  body('mt5Login').isNumeric().withMessage('MT5 login must be a number'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('description').optional().isString().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mt5Login, amount, description } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      // Process withdrawal from MT5 service
      const mt5Service = new MT5Service();
      const withdrawalResult = await mt5Service.withdrawFromAccount(mt5Login, amount);

      if (!withdrawalResult.success) {
        return res.status(400).json({ message: 'MT5 withdrawal failed', details: withdrawalResult.error });
      }

      // Calculate transfer fee (0.5% or minimum $1)
      const feeRate = 0.005;
      const fee = Math.max(amount * feeRate, 1);
      const netAmount = amount - fee;

      // Update user wallet balance
      user.walletBalance = (user.walletBalance || 0) + netAmount;
      await user.save();

      // Create transaction record
      const transaction = {
        id: `wallet_txn_${Date.now()}`,
        type: 'mt5_to_wallet',
        amount: amount,
        fee: fee,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: description || `Transfer from MT5 Account #${mt5Login}`,
        reference: `TXN${Date.now()}`,
        fromAccount: `MT5 #${mt5Login}`,
        toAccount: 'My Wallet',
        transactionHash: `0x${Math.random().toString(16).substr(2, 12)}...`,
        notes: description
      };

      // Add to user's transaction history
      if (!user.walletTransactions) {
        user.walletTransactions = [];
      }
      user.walletTransactions.unshift(transaction);
      await user.save();

      res.json({
        success: true,
        message: 'Transfer completed successfully',
        transaction,
        newBalance: user.walletBalance,
        netReceived: netAmount
      });

    } catch (mt5Error) {
      console.error('MT5 withdrawal error:', mt5Error);
      res.status(500).json({ message: 'MT5 service error', details: mt5Error.message });
    }

  } catch (error) {
    console.error('MT5 to wallet transfer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get wallet transaction history
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, search } = req.query;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let transactions = user.walletTransactions || [];

    // Apply filters
    if (type && type !== 'all') {
      transactions = transactions.filter(txn => txn.type === type);
    }

    if (status && status !== 'all') {
      transactions = transactions.filter(txn => txn.status === status);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      transactions = transactions.filter(txn => 
        txn.description.toLowerCase().includes(searchTerm) ||
        txn.reference.toLowerCase().includes(searchTerm) ||
        txn.fromAccount?.toLowerCase().includes(searchTerm) ||
        txn.toAccount?.toLowerCase().includes(searchTerm) ||
        txn.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Calculate summary statistics
    const summary = {
      total: transactions.length,
      totalInflow: transactions
        .filter(txn => ['deposit', 'transfer_in', 'mt5_to_wallet'].includes(txn.type))
        .filter(txn => txn.status === 'completed')
        .reduce((sum, txn) => sum + txn.amount, 0),
      totalOutflow: transactions
        .filter(txn => ['withdrawal', 'transfer_out', 'wallet_to_mt5'].includes(txn.type))
        .filter(txn => txn.status === 'completed')
        .reduce((sum, txn) => sum + txn.amount, 0),
      totalFees: transactions
        .filter(txn => txn.status === 'completed')
        .reduce((sum, txn) => sum + (txn.fee || 0), 0),
      pendingCount: transactions.filter(txn => txn.status === 'pending').length
    };

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(transactions.length / limitNum),
        totalItems: transactions.length,
        hasNext: endIndex < transactions.length,
        hasPrev: pageNum > 1
      },
      summary
    });

  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Deposit to wallet (external funding)
router.post('/deposit', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('method').isIn(['bank_transfer', 'credit_card', 'crypto']).withMessage('Invalid payment method'),
  body('description').optional().isString().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, description } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate deposit fee based on method
    let fee = 0;
    switch (method) {
      case 'bank_transfer':
        fee = Math.max(amount * 0.001, 5); // 0.1% or min $5
        break;
      case 'credit_card':
        fee = amount * 0.029; // 2.9%
        break;
      case 'crypto':
        fee = 0; // No fee for crypto
        break;
    }

    // For demo purposes, instantly approve the deposit
    // In real implementation, this would be pending until payment is confirmed
    const netAmount = amount - fee;
    user.walletBalance = (user.walletBalance || 0) + netAmount;

    // Create transaction record
    const transaction = {
      id: `wallet_txn_${Date.now()}`,
      type: 'deposit',
      amount: amount,
      fee: fee,
      status: 'completed', // In real app, this would be 'pending' initially
      timestamp: new Date().toISOString(),
      description: description || `${method} deposit`,
      reference: `DEP${Date.now()}`,
      toAccount: 'My Wallet',
      transactionHash: method === 'crypto' ? `0x${Math.random().toString(16).substr(2, 12)}...` : undefined,
      notes: description
    };

    // Add to user's transaction history
    if (!user.walletTransactions) {
      user.walletTransactions = [];
    }
    user.walletTransactions.unshift(transaction);
    await user.save();

    res.json({
      success: true,
      message: 'Deposit processed successfully',
      transaction,
      newBalance: user.walletBalance,
      netReceived: netAmount
    });

  } catch (error) {
    console.error('Wallet deposit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Withdraw from wallet (external withdrawal)
router.post('/withdraw', [
  body('amount').isFloat({ min: 10 }).withMessage('Minimum withdrawal amount is $10'),
  body('method').isIn(['bank_transfer', 'crypto']).withMessage('Invalid withdrawal method'),
  body('description').optional().isString().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, description } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate withdrawal fee based on method
    let fee = 0;
    switch (method) {
      case 'bank_transfer':
        fee = Math.max(amount * 0.002, 10); // 0.2% or min $10
        break;
      case 'crypto':
        fee = 5; // Flat $5 for crypto
        break;
    }

    const totalDeduction = amount + fee;

    // Check wallet balance
    if ((user.walletBalance || 0) < totalDeduction) {
      return res.status(400).json({ message: 'Insufficient wallet balance including fees' });
    }

    // Process withdrawal
    user.walletBalance = (user.walletBalance || 0) - totalDeduction;

    // Create transaction record
    const transaction = {
      id: `wallet_txn_${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      fee: fee,
      status: 'pending', // Withdrawals typically need approval
      timestamp: new Date().toISOString(),
      description: description || `${method} withdrawal`,
      reference: `WTH${Date.now()}`,
      fromAccount: 'My Wallet',
      transactionHash: method === 'crypto' ? `0x${Math.random().toString(16).substr(2, 12)}...` : undefined,
      notes: description
    };

    // Add to user's transaction history
    if (!user.walletTransactions) {
      user.walletTransactions = [];
    }
    user.walletTransactions.unshift(transaction);
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transaction,
      newBalance: user.walletBalance
    });

  } catch (error) {
    console.error('Wallet withdrawal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;