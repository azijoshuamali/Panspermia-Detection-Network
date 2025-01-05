import { describe, it, expect, beforeEach } from 'vitest';

// Simulating contract state
let balances = new Map();
let totalSupply = 0;

// Simulating contract functions
function mint(amount: number, recipient: string, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const currentBalance = balances.get(recipient) || 0;
  balances.set(recipient, currentBalance + amount);
  totalSupply += amount;
}

function transfer(amount: number, sender: string, recipient: string) {
  const senderBalance = balances.get(sender) || 0;
  if (senderBalance < amount) throw new Error('Insufficient balance');
  balances.set(sender, senderBalance - amount);
  const recipientBalance = balances.get(recipient) || 0;
  balances.set(recipient, recipientBalance + amount);
}

function burn(amount: number, owner: string) {
  const currentBalance = balances.get(owner) || 0;
  if (currentBalance < amount) throw new Error('Insufficient balance');
  balances.set(owner, currentBalance - amount);
  totalSupply -= amount;
}

function getBalance(account: string) {
  return balances.get(account) || 0;
}

function getTotalSupply() {
  return totalSupply;
}

describe('Incentive Token Contract', () => {
  beforeEach(() => {
    balances.clear();
    totalSupply = 0;
  });
  
  it('should mint tokens', () => {
    mint(1000, 'user1', 'CONTRACT_OWNER');
    expect(getBalance('user1')).toBe(1000);
    expect(getTotalSupply()).toBe(1000);
  });
  
  it('should transfer tokens', () => {
    mint(1000, 'user1', 'CONTRACT_OWNER');
    transfer(500, 'user1', 'user2');
    expect(getBalance('user1')).toBe(500);
    expect(getBalance('user2')).toBe(500);
  });
  
  it('should burn tokens', () => {
    mint(1000, 'user1', 'CONTRACT_OWNER');
    burn(300, 'user1');
    expect(getBalance('user1')).toBe(700);
    expect(getTotalSupply()).toBe(700);
  });
  
  it('should not allow unauthorized minting', () => {
    expect(() => mint(1000, 'user1', 'user2')).toThrow('Not authorized');
  });
  
  it('should not allow transfers with insufficient balance', () => {
    mint(500, 'user1', 'CONTRACT_OWNER');
    expect(() => transfer(1000, 'user1', 'user2')).toThrow('Insufficient balance');
  });
  
  it('should not allow burning more than balance', () => {
    mint(500, 'user1', 'CONTRACT_OWNER');
    expect(() => burn(1000, 'user1')).toThrow('Insufficient balance');
  });
});

