import { describe, it, expect, beforeEach } from 'vitest';

// Simulating contract state
let observations = new Map();
let analysisTasks = new Map();
let nextObservationId = 0;
let nextTaskId = 0;

// Simulating contract functions
function submitObservation(data: string, sender: string) {
  const id = nextObservationId++;
  observations.set(id, { observer: sender, timestamp: Date.now(), data, status: 'pending' });
  return id;
}

function createAnalysisTask(observationId: number, analyst: string) {
  if (!observations.has(observationId)) throw new Error('Invalid observation ID');
  const id = nextTaskId++;
  analysisTasks.set(id, { analyst, observationId, status: 'assigned' });
  return id;
}

function updateObservationStatus(id: number, newStatus: string, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  if (!observations.has(id)) throw new Error('Invalid observation ID');
  const observation = observations.get(id);
  observation.status = newStatus;
  observations.set(id, observation);
}

function updateTaskStatus(id: number, newStatus: string, sender: string) {
  if (!analysisTasks.has(id)) throw new Error('Invalid task ID');
  const task = analysisTasks.get(id);
  if (sender !== task.analyst && sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  task.status = newStatus;
  analysisTasks.set(id, task);
}

describe('Observation Data Management Contract', () => {
  beforeEach(() => {
    observations.clear();
    analysisTasks.clear();
    nextObservationId = 0;
    nextTaskId = 0;
  });
  
  it('should submit an observation', () => {
    const id = submitObservation('Test observation data', 'user1');
    expect(id).toBe(0);
    expect(observations.get(0).data).toBe('Test observation data');
    expect(observations.get(0).status).toBe('pending');
  });
  
  it('should create an analysis task', () => {
    submitObservation('Test observation data', 'user1');
    const taskId = createAnalysisTask(0, 'analyst1');
    expect(taskId).toBe(0);
    expect(analysisTasks.get(0).analyst).toBe('analyst1');
    expect(analysisTasks.get(0).status).toBe('assigned');
  });
  
  it('should update observation status', () => {
    submitObservation('Test observation data', 'user1');
    updateObservationStatus(0, 'analyzed', 'CONTRACT_OWNER');
    expect(observations.get(0).status).toBe('analyzed');
  });
  
  it('should update task status', () => {
    submitObservation('Test observation data', 'user1');
    createAnalysisTask(0, 'analyst1');
    updateTaskStatus(0, 'completed', 'analyst1');
    expect(analysisTasks.get(0).status).toBe('completed');
  });
  
  it('should not allow unauthorized status updates', () => {
    submitObservation('Test observation data', 'user1');
    expect(() => updateObservationStatus(0, 'analyzed', 'user2')).toThrow('Not authorized');
  });
});

