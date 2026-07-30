const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('ketryx-tasks') || '[]');

function saveTasks() {
  localStorage.setItem('ketryx-tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No tasks yet. Add one above.';
    empty.style.justifyContent = 'center';
    list.appendChild(empty);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = task.completed ? 'completed' : '';

    const text = document.createElement('span');
    text.textContent = task.text;

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.5rem';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.textContent = task.completed ? 'Undo' : 'Done';
    toggleButton.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    actions.appendChild(toggleButton);
    actions.appendChild(deleteButton);
    item.appendChild(text);
    item.appendChild(actions);
    list.appendChild(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) return;

  tasks.unshift({ text, completed: false });
  input.value = '';
  saveTasks();
  renderTasks();
});

renderTasks();
