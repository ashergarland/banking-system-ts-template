// stage1.test.ts
import { expect } from 'chai';
import { BankingSystem } from '../src/bankingSystem';

describe('Stage 1 - Basic Account Management', () => {
  let bank: BankingSystem;

  const now = Date.now();

  beforeEach(() => {
    bank = new BankingSystem();
  });

  it('should create a new account and initialize with zero balance', () => {
    expect(bank.createAccount('user1')).to.equal(true);
    expect(bank.getBalance('user1')).to.equal(0);
  });

  it('should return false when creating an already existing account', () => {
    bank.createAccount('user1');
    expect(bank.createAccount('user1')).to.equal(false);
  });

  it('should deposit funds correctly and update balance', () => {
    bank.createAccount('user1');
    const result = bank.deposit('user1', 100, now);
    expect(result).to.equal(true);
    expect(bank.getBalance('user1')).to.equal(100);
  });

  it('should return false for deposit into unknown account', () => {
    expect(bank.deposit('ghost', 100, now)).to.equal(false);
  });

  it('should return false for deposit with zero or negative amount', () => {
    bank.createAccount('user1');
    expect(bank.deposit('user1', 0, now)).to.equal(false);
    expect(bank.deposit('user1', -50, now)).to.equal(false);
  });

  it('should withdraw funds correctly and update balance', () => {
    bank.createAccount('user1');
    bank.deposit('user1', 200, now);
    const result = bank.withdraw('user1', 150, now);
    expect(result).to.equal(true);
    expect(bank.getBalance('user1')).to.equal(50);
  });

  it('should return false for withdrawal from unknown account', () => {
    expect(bank.withdraw('ghost', 50, now)).to.equal(false);
  });

  it('should return false for withdrawal with zero or negative amount', () => {
    bank.createAccount('user1');
    bank.deposit('user1', 100, now);
    expect(bank.withdraw('user1', 0, now)).to.equal(false);
    expect(bank.withdraw('user1', -20, now)).to.equal(false);
  });

  it('should return false for withdrawal exceeding balance', () => {
    bank.createAccount('user1');
    bank.deposit('user1', 100, now);
    expect(bank.withdraw('user1', 200, now)).to.equal(false);
  });

  it('should isolate balances between multiple accounts', () => {
    bank.createAccount('alice');
    bank.createAccount('bob');
    bank.deposit('alice', 150, now);
    bank.deposit('bob', 300, now);
    bank.withdraw('bob', 100, now);

    expect(bank.getBalance('alice')).to.equal(150);
    expect(bank.getBalance('bob')).to.equal(200);
  });

  it('should support long and unusual account IDs', () => {
    const id = 'very-long-user-id__WITH_CAPS_&_symbols-1234567890';
    expect(bank.createAccount(id)).to.equal(true);
    expect(bank.deposit(id, 1000, now)).to.equal(true);
    expect(bank.getBalance(id)).to.equal(1000);
  });

  it('should return null when getting balance for unknown account', () => {
    expect(bank.getBalance('not-found')).to.equal(null);
  });

  it('should handle multiple deposits and withdrawals cumulatively', () => {
    bank.createAccount('user1');
    bank.deposit('user1', 100, now);
    bank.deposit('user1', 50, now);
    bank.withdraw('user1', 30, now);
    bank.withdraw('user1', 20, now);
    expect(bank.getBalance('user1')).to.equal(100);
  });
});
