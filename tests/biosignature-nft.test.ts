import { describe, it, expect, beforeEach } from 'vitest';

// Simulating contract state
let biosignatures = new Map();
let biosignatureOwners = new Map();
let nextBiosignatureId = 0;

// Simulating contract functions
function mintBiosignature(name: string, description: string, sender: string) {
  const id = nextBiosignatureId++;
  biosignatures.set(id, { name, description, discoverer: sender, timestamp: Date.now() });
  biosignatureOwners.set(id, sender);
  return id;
}

function transferBiosignature(id: number, sender: string, recipient: string) {
  if (!biosignatureOwners.has(id)) throw new Error('Invalid biosignature ID');
  if (biosignatureOwners.get(id) !== sender) throw new Error('Not authorized');
  biosignatureOwners.set(id, recipient);
}

function getBiosignatureData(id: number) {
  return biosignatures.get(id);
}

function getBiosignatureOwner(id: number) {
  return biosignatureOwners.get(id);
}

describe('Biosignature NFT Contract', () => {
  beforeEach(() => {
    biosignatures.clear();
    biosignatureOwners.clear();
    nextBiosignatureId = 0;
  });
  
  it('should mint a biosignature NFT', () => {
    const id = mintBiosignature('Alien DNA', 'Potential extraterrestrial genetic material', 'discoverer1');
    expect(id).toBe(0);
    expect(biosignatures.get(0).name).toBe('Alien DNA');
    expect(biosignatureOwners.get(0)).toBe('discoverer1');
  });
  
  it('should transfer a biosignature NFT', () => {
    const id = mintBiosignature('Alien DNA', 'Potential extraterrestrial genetic material', 'discoverer1');
    transferBiosignature(id, 'discoverer1', 'collector1');
    expect(biosignatureOwners.get(id)).toBe('collector1');
  });
  
  it('should not allow unauthorized transfers', () => {
    const id = mintBiosignature('Alien DNA', 'Potential extraterrestrial genetic material', 'discoverer1');
    expect(() => transferBiosignature(id, 'hacker1', 'collector1')).toThrow('Not authorized');
  });
  
  it('should retrieve biosignature data', () => {
    const id = mintBiosignature('Alien DNA', 'Potential extraterrestrial genetic material', 'discoverer1');
    const data = getBiosignatureData(id);
    expect(data.name).toBe('Alien DNA');
    expect(data.discoverer).toBe('discoverer1');
  });
  
  it('should retrieve biosignature owner', () => {
    const id = mintBiosignature('Alien DNA', 'Potential extraterrestrial genetic material', 'discoverer1');
    const owner = getBiosignatureOwner(id);
    expect(owner).toBe('discoverer1');
  });
});

