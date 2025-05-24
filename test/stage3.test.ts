// stage3.test.ts
import { expect } from 'chai';
import { BankingSystem } from '../src/bankingSystem';

describe('Stage 3 - Inter-Account Transfers (Pending / Accept / Expire)', () => {
  let bank: BankingSystem;

  beforeEach(() => {
    bank = new BankingSystem();
  });

  it('should create a valid transfer between two accounts', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 1000);
    expect(transferId).to.be.a('string');
  });

  it('should return null if sender does not exist', () => {
    bank.createAccount('bob');
    const transferId = bank.createTransfer('unknown', 'bob', 50, 1000, 1000);
    expect(transferId).to.be.null;
  });

  it('should return null if recipient does not exist', () => {
    bank.createAccount('alice');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'unknown', 50, 1000, 1000);
    expect(transferId).to.be.null;
  });

  it('should return null if amount is invalid', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 0, 1000, 1000);
    expect(transferId).to.be.null;
  });

  it('should return null if sender has insufficient funds', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 10, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 1000, 1000);
    expect(transferId).to.be.null;
  });

  it('should mark transfer as pending immediately after creation', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 5000);
    expect(bank.getTransferStatus(transferId!, 2000)).to.equal('pending');
  });

  it('should mark transfer as accepted when accepted within TTL', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 5000);
    const accepted = bank.acceptTransfer(transferId!, 6000);
    expect(accepted).to.be.true;
    expect(bank.getTransferStatus(transferId!, 6000)).to.equal('accepted');
  });

  it('should deposit into recipient balance when accepted', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 5000);
    bank.acceptTransfer(transferId!, 6000);
    expect(bank.getBalance('bob')).to.equal(50);
  });

  it('should mark transfer as expired if TTL elapsed', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 1000);
    expect(bank.getTransferStatus(transferId!, 4000)).to.equal('expired');
  });

  it('should refund sender on expired transfer', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 1000);
    // Expired at 3000
    expect(bank.getBalance('alice')).to.equal(50); // Held funds
    expect(bank.getTransferStatus(transferId!, 4000)).to.equal('expired');
    expect(bank.getBalance('alice')).to.equal(100); // Refunded after expiration
  });

  it('should not accept expired transfers', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 1000);
    const accepted = bank.acceptTransfer(transferId!, 4000);
    expect(accepted).to.be.false;
  });

  it('should not allow accepting the same transfer twice', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 50, 2000, 5000);
    bank.acceptTransfer(transferId!, 3000);
    const secondAttempt = bank.acceptTransfer(transferId!, 4000);
    expect(secondAttempt).to.be.false;
  });

  it('should hold funds during pending transfer', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 100, 1000);
    const transferId = bank.createTransfer('alice', 'bob', 70, 2000, 5000);
    expect(bank.getBalance('alice')).to.equal(30); // Held 70
  });
});
