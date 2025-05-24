// stage4.test.ts
import { expect } from 'chai';
import { BankingSystem } from '../src/bankingSystem';

describe('Stage 4 - Scheduled Transfers', () => {
  let bank: BankingSystem;

  beforeEach(() => {
    bank = new BankingSystem();
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 1000, 1000);
  });

  it('should schedule a transfer successfully', () => {
    const scheduledId = bank.scheduleTransfer('alice', 'bob', 500, 5000, 1000);
    expect(scheduledId).to.be.a('string');
  });

  it('should return null for invalid scheduled transfer (unknown account)', () => {
    const id = bank.scheduleTransfer('unknown', 'bob', 100, 5000, 1000);
    expect(id).to.be.null;
  });

  it('should return null for invalid amount or time', () => {
    expect(bank.scheduleTransfer('alice', 'bob', 0, 5000, 1000)).to.be.null;
    expect(bank.scheduleTransfer('alice', 'bob', 100, 0, 1000)).to.be.null;
    expect(bank.scheduleTransfer('alice', 'bob', 100, 5000, -1)).to.be.null;
  });

  it('should process scheduled transfers at or after scheduled time', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 200, 3000, 2000);
    const processed = bank.processScheduledTransfers(3000);
    expect(processed).to.include(id);
    expect(bank.getTransferStatus(processed[0], 4000)).to.equal('pending');
  });

  it('should ignore transfers scheduled for the future', () => {
    bank.scheduleTransfer('alice', 'bob', 100, 6000, 1000);
    const processed = bank.processScheduledTransfers(5000);
    expect(processed).to.be.empty;
  });

  it('should reflect transfer in pending state after processing', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 300, 2500, 2000);
    expect(id).to.not.be.null;
    bank.processScheduledTransfers(2500);
    const status = bank.getTransferStatus(id!, 2600);
    expect(status).to.equal('pending');
  });

  it('should accept a scheduled transfer after processing', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 150, 2000, 1000);
    expect(id).to.not.be.null;
    bank.processScheduledTransfers(2000);
    const accepted = bank.acceptTransfer(id!, 2500);
    expect(accepted).to.be.true;
    expect(bank.getTransferStatus(id!, 2500)).to.equal('accepted');
  });

  it('should expire a scheduled transfer that is not accepted in TTL', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 200, 2000, 1000);
    expect(id).to.not.be.null;
    bank.processScheduledTransfers(2000);
    expect(bank.getTransferStatus(id!, 3100)).to.equal('expired');
  });

  it('should skip processing if sender lacks funds at execution time', () => {
    bank.withdraw('alice', 900, 1100); // leave only 100
    bank.scheduleTransfer('alice', 'bob', 200, 3000, 1000);
    const result = bank.processScheduledTransfers(3000);
    expect(result).to.be.empty;
  });

  it('should list scheduled transfer IDs for an account', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 100, 5000, 1000);
    const list = bank.getScheduledTransferIds('alice');
    expect(list).to.include(id);
  });

  it('should return null for getScheduledTransferIds on unknown account', () => {
    expect(bank.getScheduledTransferIds('ghost')).to.be.null;
  });

  it('should not reprocess the same scheduled transfer', () => {
    const id = bank.scheduleTransfer('alice', 'bob', 100, 3000, 1000);
    const first = bank.processScheduledTransfers(3000);
    const second = bank.processScheduledTransfers(3500);
    expect(second).to.not.include(id);
  });

  it('should clean up discarded transfers that fail validation at runtime', () => {
    bank.withdraw('alice', 1000, 2000); // drain funds
    const id = bank.scheduleTransfer('alice', 'bob', 100, 3000, 1000);
    bank.processScheduledTransfers(3000);
    expect(bank.getTransferStatus(id!, 4000)).to.be.null;
  });

  it('should handle multiple scheduled transfers in batch', () => {
    const id1 = bank.scheduleTransfer('alice', 'bob', 100, 3000, 1000);
    const id2 = bank.scheduleTransfer('alice', 'bob', 100, 3000, 1000);
    const processed = bank.processScheduledTransfers(3000);
    expect(processed).to.include.members([id1, id2]);
  });
});
