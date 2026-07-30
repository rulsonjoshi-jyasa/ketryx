const STORAGE_KEY = 'ketryx-release-tasks';

function addTask(tasks, text) {
  const normalizedText = text.trim();
  if (!normalizedText) return tasks;

  return [{ text: normalizedText, completed: false }, ...tasks];
}

function toggleTask(tasks, index) {
  return tasks.map((task, taskIndex) =>
    taskIndex === index ? { ...task, completed: !task.completed } : task
  );
}

function deleteTask(tasks, index) {
  return tasks.filter((_, taskIndex) => taskIndex !== index);
}

function getTaskSummary(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
  };
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function createTaskElement(task, index, onToggle, onDelete) {
  const item = document.createElement('li');
  item.className = task.completed ? 'completed' : '';

  const text = document.createElement('span');
  text.textContent = task.text;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.textContent = task.completed ? 'Undo' : 'Done';
  toggleButton.onclick = () => onToggle(index);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Remove';
  deleteButton.onclick = () => onDelete(index);

  actions.appendChild(toggleButton);
  actions.appendChild(deleteButton);
  item.appendChild(text);
  item.appendChild(actions);
  return item;
}

function initApp() {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const summary = document.getElementById('task-summary');

  if (!form || !input || !list || !summary) return;

  let tasks = loadTasks();

  function renderTasks() {
    list.innerHTML = '';
    const taskSummary = getTaskSummary(tasks);
    summary.innerHTML = `
      <strong>${taskSummary.total}</strong> total •
      <strong>${taskSummary.completed}</strong> complete •
      <strong>${taskSummary.pending}</strong> pending
    `;

    if (tasks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-state';
      empty.textContent = 'Nothing here yet. Add the next release item above.';
      list.appendChild(empty);
      return;
    }

    tasks.forEach((task, index) => {
      list.appendChild(createTaskElement(task, index, (taskIndex) => {
        tasks = toggleTask(tasks, taskIndex);
        saveTasks(tasks);
        renderTasks();
      }, (taskIndex) => {
        tasks = deleteTask(tasks, taskIndex);
        saveTasks(tasks);
        renderTasks();
      }));
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    tasks = addTask(tasks, input.value);
    input.value = '';
    saveTasks(tasks);
    renderTasks();
  });

  renderTasks();
}

if (typeof document !== 'undefined') {
  initApp();
}

export { addTask, toggleTask, deleteTask, getTaskSummary };
