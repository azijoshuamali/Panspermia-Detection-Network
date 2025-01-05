import { describe, it, expect, beforeEach } from 'vitest';

// Simulating contract state
let telescopes = new Map();
let telescopeData = new Map();
let nextTelescopeId = 0;

// Simulating contract functions
function registerTelescope(name: string, location: string, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const id = nextTelescopeId++;
  telescopes.set(id, { name, location, status: 'active' });
  return id;
}

function submitTelescopeData(telescopeId: number, data: string) {
  if (!telescopes.has(telescopeId)) throw new Error('Invalid telescope ID');
  const telescope = telescopes.get(telescopeId);
  if (telescope.status !== 'active') throw new Error('Telescope is not active');
  const timestamp = Date.now();
  telescopeData.set(`${telescopeId}-${timestamp}`, { data });
}

function updateTelescopeStatus(telescopeId: number, newStatus: string, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  if (!telescopes.has(telescopeId)) throw new Error('Invalid telescope ID');
  const telescope = telescopes.get(telescopeId);
  telescope.status = newStatus;
  telescopes.set(telescopeId, telescope);
}

function getTelescope(id: number) {
  return telescopes.get(id);
}

function getTelescopeData(telescopeId: number, timestamp: number) {
  return telescopeData.get(`${telescopeId}-${timestamp}`);
}

describe('Space Telescope Integration Contract', () => {
  beforeEach(() => {
    telescopes.clear();
    telescopeData.clear();
    nextTelescopeId = 0;
  });
  
  it('should register a telescope', () => {
    const id = registerTelescope('Hubble', 'Low Earth Orbit', 'CONTRACT_OWNER');
    expect(id).toBe(0);
    expect(telescopes.get(0).name).toBe('Hubble');
    expect(telescopes.get(0).status).toBe('active');
  });
  
  it('should submit telescope data', () => {
    const id = registerTelescope('Hubble', 'Low Earth Orbit', 'CONTRACT_OWNER');
    const timestamp = Date.now();
    submitTelescopeData(id, 'Sample telescope data');
    expect(telescopeData.get(`${id}-${timestamp}`).data).toBe('Sample telescope data');
  });
  
  it('should update telescope status', () => {
    const id = registerTelescope('Hubble', 'Low Earth Orbit', 'CONTRACT_OWNER');
    updateTelescopeStatus(id, 'maintenance', 'CONTRACT_OWNER');
    expect(telescopes.get(id).status).toBe('maintenance');
  });
  
  it('should not allow unauthorized telescope registration', () => {
    expect(() => registerTelescope('Fake Telescope', 'Unknown', 'hacker1')).toThrow('Not authorized');
  });
  
  it('should not allow data submission for inactive telescopes', () => {
    const id = registerTelescope('Hubble', 'Low Earth Orbit', 'CONTRACT_OWNER');
    updateTelescopeStatus(id, 'inactive', 'CONTRACT_OWNER');
    expect(() => submitTelescopeData(id, 'Sample data')).toThrow('Telescope is not active');
  });
  
  it('should retrieve telescope information', () => {
    const id = registerTelescope('James Webb', 'L2 Orbit', 'CONTRACT_OWNER');
    const telescope = getTelescope(id);
    expect(telescope.name).toBe('James Webb');
    expect(telescope.location).toBe('L2 Orbit');
  });
  
  it('should retrieve telescope data', () => {
    const id = registerTelescope('Hubble', 'Low Earth Orbit', 'CONTRACT_OWNER');
    const timestamp = Date.now();
    submitTelescopeData(id, 'Sample telescope data');
    const data = getTelescopeData(id, timestamp);
    expect(data.data).toBe('Sample telescope data');
  });
});

