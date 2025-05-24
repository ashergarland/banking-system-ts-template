// Stage 4: Scheduled Transfers
// Overview:
// This stage extends the transfer system with support for scheduling a transfer to be created at a future time.
//
// A scheduled transfer is a plan to initiate a normal transfer (as defined in Stage 3) at a specific future time.
// The transfer does not exist or affect balances until the scheduled time is reached and the system is explicitly told to process it.
//
// This simulates real-world automation, payroll, or recurring payment use cases.
//
// Requirements:
// - When a scheduled transfer is created, it is stored as a pending job.
// - At or after the `scheduledFor` time, it must be processed manually via `processScheduledTransfers(...)`.
// - Processing the transfer behaves like `createTransfer(...)` (Stage 3), including withdrawal, TTL, and transfer ID assignment.
// - Scheduled transfers that fail to process (e.g., sender has insufficient funds) are discarded silently.
// - Each scheduled transfer must be uniquely identifiable by an ID string.
// - Scheduled transfers are not counted toward history or transaction volume unless they successfully become accepted transfers.
//
// Notes:
// - Processing scheduled transfers should be idempotent: if a transfer is already processed, it should not repeat or error.
// - The system does not auto-run anything — processing is explicitly triggered.

import { Stage3 } from './stage3';

export interface Stage4 extends Stage3 {
  /**
   * Schedules a future transfer between two accounts.
   * The actual transfer will not occur until the specified `scheduledFor` time is reached and `processScheduledTransfers(...)` is called.
   *
   * @param fromAccountId - The ID of the account to send from.
   * @param toAccountId - The ID of the account to receive the funds.
   * @param amount - A positive integer amount to transfer.
   * @param scheduledFor - The Unix timestamp (in ms) when the transfer should be processed.
   * @param timeToLiveMs - How long (after creation) the transfer is valid before it expires (same TTL logic as Stage 3).
   * @returns A unique scheduled transfer ID string, or null if validation fails (e.g. invalid inputs or unknown accounts).
   */
  scheduleTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    scheduledFor: number,
    timeToLiveMs: number
  ): string | null;

  /**
   * Manually processes all scheduled transfers whose scheduled time is at or before the given `currentTime`.
   * Each successful transfer becomes a real transfer and receives a new transfer ID.
   * Transfers that cannot be created (e.g., insufficient funds) are skipped and discarded silently.
   *
   * @param currentTime - The current Unix timestamp (in ms).
   * @returns An array of successful transfer IDs created during this processing run.
   */
  processScheduledTransfers(currentTime: number): string[];

  /**
   * Returns a list of all scheduled (not yet processed) transfers for a given account.
   *
   * @param accountId - The account that initiated the scheduled transfers.
   * @returns An array of transfer ID strings, or null if the account does not exist.
   */
  getScheduledTransferIds(accountId: string): string[] | null;
}
