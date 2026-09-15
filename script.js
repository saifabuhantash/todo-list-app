let todos = [];
let currentFilter = 'all';

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    todos = saved ? JSON.parse(saved) : [];
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateLastUpdated();
}

// Add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('prioritySelect').value;
    const text = input.value.trim();

    if (text === '') {
        input.focus();
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(newTodo);
    saveTodos();
    input.value = '';
    input.focus();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
    }
}

// Delete a todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
    }
}

// Clear all completed todos
function clearAllCompleted() {
    if (confirm('Delete all completed tasks?')) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTodos();
}

// Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    let filtered = todos;

    if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'high') {
        filtered = todos.filter(t => t.priority === 'high');
    }

    if (filtered.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✨</div>
                <div class="empty-state-text">No tasks found</div>
            </div>
        `;
    } else {
        todoList.innerHTML = filtered.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <div class="todo-text">${escapeHtml(todo.text)}</div>
                <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `).join('');
    }

    updateStats();
    updateClearButton();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;
}

// Update clear button visibility
function updateClearButton() {
    const clearBtn = document.getElementById('clearBtn');
    const hasCompleted = todos.some(t => t.completed);
    clearBtn.style.display = hasCompleted ? 'block' : 'none';
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = timeString;
}

// Escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add todo on Enter key
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    loadTodos();
    updateLastUpdated();
});