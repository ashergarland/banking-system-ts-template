// bankingSystem.ts
// This is the main class you will implement step-by-step through each stage.
// Begin by implementing Stage1 interface.

import { Stage1 } from './stage1';
import { Stage2 } from './stage2';
import { Stage3 } from './stage3';
import { Stage4 } from './stage4';

export class BankingSystem implements Stage1 {
    constructor() {

    }
    createAccount(accountId: string): boolean {
        throw new Error('Method not implemented.');
    }
    deposit(accountId: string, amount: number, timestamp: number): boolean {
        throw new Error('Method not implemented.');
    }
    withdraw(accountId: string, amount: number, timestamp: number): boolean {
        throw new Error('Method not implemented.');
    }
    getBalance(accountId: string): number | null {
        throw new Error('Method not implemented.');
    }
}
