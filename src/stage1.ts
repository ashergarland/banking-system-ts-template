// Stage 1: Basic Account Management
// Overview:
// In this stage, you will implement core account operations for a banking system,
// including account creation, deposits, withdrawals, and balance inquiries.
// This stage focuses on correct state management, input validation, and failure handling.

// Requirements:
// - Each account has a unique string ID and a non-negative integer balance (starting at 0).
// - Deposits and withdrawals require a Unix timestamp (milliseconds since epoch).
// - Deposit and withdrawal amounts must be strictly positive integers.
// - Withdrawals must fail if the account lacks sufficient funds.

export interface Stage1 {
    /**
     * Creates a new account with the given ID.
     *
     * @param accountId - A unique string identifier for the account.
     * @returns true if the account was created successfully, or false if the account already exists.
     */
    createAccount(accountId: string): boolean;
  
    /**
     * Deposits the specified amount into the given account at the specified time.
     *
     * @param accountId - The ID of the account to deposit into.
     * @param amount - A positive integer amount to deposit (must be > 0).
     * @param timestamp - A Unix timestamp (milliseconds since epoch) representing when the deposit occurred.
     * @returns true if the deposit succeeded, or false if the account does not exist or the amount is invalid.
     */
    deposit(accountId: string, amount: number, timestamp: number): boolean;
  
    /**
     * Withdraws the specified amount from the given account at the specified time.
     *
     * @param accountId - The ID of the account to withdraw from.
     * @param amount - A positive integer amount to withdraw (must be > 0 and ≤ current balance).
     * @param timestamp - A Unix timestamp (milliseconds since epoch) representing when the withdrawal occurred.
     * @returns true if the withdrawal succeeded, or false if the account does not exist, the amount is invalid, or the balance is insufficient.
     */
    withdraw(accountId: string, amount: number, timestamp: number): boolean;
  
    /**
     * Gets the current balance of the specified account.
     *
     * @param accountId - The ID of the account to query.
     * @returns The current balance as a non-negative integer, or null if the account does not exist.
     */
    getBalance(accountId: string): number | null;
  }
  