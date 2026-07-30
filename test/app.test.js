import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, toggleTask, deleteTask, getTaskSummary } from '../script.js';

test('addTask trims input and creates a new task', () => {
  const tasks = [];
  const nextTasks = addTask(tasks, '   Ship release demo   ');

  assert.equal(nextTasks.length, 1);
  assert.equal(nextTasks[0].text, 'Ship release demo');
  assert.equal(nextTasks[0].completed, false);
});

test('toggleTask and deleteTask update task state correctly', () => {
  const tasks = [{ text: 'Review checklist', completed: false }];
  const toggled = toggleTask(tasks, 0);
  const removed = deleteTask(tasks, 0);

  assert.equal(toggled[0].completed, true);
  assert.deepEqual(removed, []);
});

test('getTaskSummary returns totals for active and completed tasks', () => {
  const tasks = [
    { text: 'Prepare release notes', completed: false },
    { text: 'Verify onboarding', completed: true },
    { text: 'Share demo link', completed: false },
  ];

  assert.deepEqual(getTaskSummary(tasks), {
    total: 3,
    completed: 1,
    pending: 2,
  });
});
