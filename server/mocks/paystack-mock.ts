/**
 * Paystack Payment Gateway Mock for Testing
 * 
 * Provides mock implementations of Paystack API endpoints for local development
 * without requiring actual API keys or network calls to Paystack servers.
 * 
 * Usage in routes:
 *   const paystackClient = process.env.NODE_ENV === 'test' 
 *     ? createMockPaystackClient() 
 *     : createRealPaystackClient();
 */

import crypto from 'crypto';

export interface PaystackMockConfig {
  autoApprove?: boolean; // Auto-approve all transactions
  failureRate?: number;  // Percentage of transactions that fail (0-100)
  delay?: number;        // Simulated network delay in ms
}

export interface PaystackTransaction {
  reference: string;
  amount: number;
  email: string;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  authorization_url?: string;
  access_code?: string;
  paid_at?: string;
  metadata?: Record<string, any>;
}

export class MockPaystackClient {
  private transactions: Map<string, PaystackTransaction> = new Map();
  private config: Required<PaystackMockConfig>;

  constructor(config: PaystackMockConfig = {}) {
    this.config = {
      autoApprove: config.autoApprove ?? true,
      failureRate: config.failureRate ?? 0,
      delay: config.delay ?? 500
    };
  }

  /**
   * Mock: Initialize Paystack transaction
   */
  async initializeTransaction(data: {
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
  }): Promise<{
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }> {
    await this.simulateDelay();

    const reference = data.reference || `MOCK-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const access_code = `MOCK-ACCESS-${crypto.randomBytes(8).toString('hex')}`;

    const transaction: PaystackTransaction = {
      reference,
      amount: data.amount,
      email: data.email,
      currency: data.currency || 'NGN',
      status: 'pending',
      authorization_url: `${data.callback_url || 'http://localhost:5000/payment/verify'}?reference=${reference}`,
      access_code,
      metadata: data.metadata
    };

    this.transactions.set(reference, transaction);

    console.log(`[MOCK PAYSTACK] Transaction initialized: ${reference} | Amount: ${data.amount / 100} ${transaction.currency}`);

    // Auto-approve after delay (simulating user payment)
    if (this.config.autoApprove) {
      setTimeout(() => {
        this.simulatePaymentCompletion(reference);
      }, this.config.delay * 2);
    }

    return {
      status: true,
      message: 'Authorization URL created (MOCK)',
      data: {
        authorization_url: transaction.authorization_url!,
        access_code: transaction.access_code!,
        reference
      }
    };
  }

  /**
   * Mock: Verify Paystack transaction
   */
  async verifyTransaction(reference: string): Promise<{
    status: boolean;
    message: string;
    data: {
      id: number;
      status: string;
      reference: string;
      amount: number;
      paid_at: string | null;
      currency: string;
      metadata: Record<string, any>;
      customer: {
        email: string;
      };
    };
  }> {
    await this.simulateDelay();

    const transaction = this.transactions.get(reference);

    if (!transaction) {
      return {
        status: false,
        message: 'Transaction not found (MOCK)',
        data: null as any
      };
    }

    const shouldFail = Math.random() * 100 < this.config.failureRate;
    const finalStatus = shouldFail ? 'failed' : transaction.status;

    console.log(`[MOCK PAYSTACK] Verifying transaction: ${reference} | Status: ${finalStatus}`);

    return {
      status: true,
      message: 'Verification successful (MOCK)',
      data: {
        id: Date.now(),
        status: finalStatus,
        reference: transaction.reference,
        amount: transaction.amount,
        paid_at: transaction.paid_at || null,
        currency: transaction.currency,
        metadata: transaction.metadata || {},
        customer: {
          email: transaction.email
        }
      }
    };
  }

  /**
   * Mock: Verify bank account number
   */
  async verifyBankAccount(data: {
    account_number: string;
    bank_code: string;
  }): Promise<{
    status: boolean;
    message: string;
    data: {
      account_number: string;
      account_name: string;
      bank_id: number;
    };
  }> {
    await this.simulateDelay();

    // Mock bank account verification
    const mockNames = [
      'John Doe',
      'Jane Smith',
      'Ahmed Ibrahim',
      'Fatima Yusuf',
      'Chioma Okonkwo',
      'Adebayo Williams'
    ];

    const accountName = mockNames[Math.floor(Math.random() * mockNames.length)];

    console.log(`[MOCK PAYSTACK] Verifying account: ${data.account_number} | Bank: ${data.bank_code} | Name: ${accountName}`);

    return {
      status: true,
      message: 'Account verification successful (MOCK)',
      data: {
        account_number: data.account_number,
        account_name: accountName,
        bank_id: parseInt(data.bank_code)
      }
    };
  }

  /**
   * Mock: List Nigerian banks
   */
  async listBanks(): Promise<{
    status: boolean;
    message: string;
    data: Array<{
      id: number;
      name: string;
      code: string;
      active: boolean;
    }>;
  }> {
    await this.simulateDelay();

    return {
      status: true,
      message: 'Banks retrieved (MOCK)',
      data: [
        { id: 1, name: 'Access Bank', code: '044', active: true },
        { id: 2, name: 'GTBank', code: '058', active: true },
        { id: 3, name: 'First Bank', code: '011', active: true },
        { id: 4, name: 'UBA', code: '033', active: true },
        { id: 5, name: 'Zenith Bank', code: '057', active: true },
        { id: 6, name: 'Polaris Bank', code: '076', active: true },
        { id: 7, name: 'Stanbic IBTC', code: '221', active: true }
      ]
    };
  }

  /**
   * Simulate payment completion (for testing)
   */
  private simulatePaymentCompletion(reference: string): void {
    const transaction = this.transactions.get(reference);
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'success';
      transaction.paid_at = new Date().toISOString();
      console.log(`[MOCK PAYSTACK] Payment completed: ${reference} ✅`);
    }
  }

  /**
   * Manual payment approval (for testing)
   */
  approvePayment(reference: string): void {
    this.simulatePaymentCompletion(reference);
  }

  /**
   * Manual payment failure (for testing)
   */
  failPayment(reference: string): void {
    const transaction = this.transactions.get(reference);
    if (transaction) {
      transaction.status = 'failed';
      console.log(`[MOCK PAYSTACK] Payment failed: ${reference} ❌`);
    }
  }

  /**
   * Get all mock transactions (for debugging)
   */
  getAllTransactions(): PaystackTransaction[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Clear all mock data
   */
  reset(): void {
    this.transactions.clear();
    console.log('[MOCK PAYSTACK] All transactions cleared');
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.config.delay));
  }
}

/**
 * Factory function for mock Paystack client
 */
export function createMockPaystackClient(config?: PaystackMockConfig): MockPaystackClient {
  return new MockPaystackClient(config);
}

/**
 * Singleton instance for test environment
 */
export const mockPaystackClient = new MockPaystackClient({
  autoApprove: true,
  failureRate: 0,
  delay: 300
});
