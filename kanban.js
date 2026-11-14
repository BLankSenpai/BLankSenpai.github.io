const STORAGE_KEY = 'portfolio_kanban_tasks_v1';
const COLUMNS = ['do', 'doing', 'done'];

const DEFAULT_TASKS = [
    { id: 't1', text: 'Outline upcoming portfolio project ideas', column: 'do' },
    { id: 't2', text: 'Review mobile responsiveness across pages', column: 'do' },
    { id: 't3', text: 'Build minimalist Kanban board foundation', column: 'doing' },
    { id: 't4', text: 'Refine Recipe Simplifier URL scanner', column: 'done' },
    { id: 't5', text: 'Deploy OBS F-150 interactive diagram', column: 'done' }
];

let tasks = loadTasks();
let draggedTaskId = null;

const addTaskForm = document.getElementById('addTaskForm');
const taskInput = document.getElementById('taskInput');
const columnSelect = document.getElementById('columnSelect');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const resetBoardBtn = document.getElementById('resetBoardBtn');

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {
        // Fallback to default tasks if storage is unavailable
    }
    return DEFAULT_TASKS.map(t => ({ ...t }));
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        // Ignore storage write errors
    }
}

function renderBoard() {
    COLUMNS.forEach(col => {
        const listEl = document.getElementById(`list-${col}`);
        const countEl = document.getElementById(`count-${col}`);
        if (!listEl || !countEl) return;

        const colTasks = tasks.filter(t => t.column === col);
        countEl.textContent = String(colTasks.length);
        listEl.innerHTML = '';

        if (colTasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No tasks here';
            listEl.appendChild(empty);
            return;
        }

        colTasks.forEach(task => {
            listEl.appendChild(createCardElement(task));
        });
    });
}

function createCardElement(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.id = task.id;

    const textEl = document.createElement('div');
    textEl.className = 'card-text';
    textEl.textContent = task.text;

    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const moveBtns = document.createElement('div');
    moveBtns.className = 'move-btns';

    const colIdx = COLUMNS.indexOf(task.column);

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'card-btn';
    prevBtn.textContent = '←';
    prevBtn.title = 'Move left';
    prevBtn.disabled = colIdx <= 0;
    prevBtn.addEventListener('click', () => moveTask(task.id, COLUMNS[colIdx - 1]));

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'card-btn';
    nextBtn.textContent = '→';
    nextBtn.title = 'Move right';
    nextBtn.disabled = colIdx >= COLUMNS.length - 1;
    nextBtn.addEventListener('click', () => moveTask(task.id, COLUMNS[colIdx + 1]));

    moveBtns.appendChild(prevBtn);
    moveBtns.appendChild(nextBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'card-btn delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    footer.appendChild(moveBtns);
    footer.appendChild(deleteBtn);

    card.appendChild(textEl);
    card.appendChild(footer);

    card.addEventListener('dragstart', () => {
        draggedTaskId = task.id;
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        draggedTaskId = null;
        card.classList.remove('dragging');
        document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });

    return card;
}

function addTask(text, column) {
    const clean = text.trim();
    if (!clean) return;
    tasks.push({
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        text: clean,
        column: COLUMNS.includes(column) ? column : 'do'
    });
    saveTasks();
    renderBoard();
}

function moveTask(id, targetColumn) {
    if (!COLUMNS.includes(targetColumn)) return;
    const task = tasks.find(t => t.id === id);
    if (!task || task.column === targetColumn) return;
    task.column = targetColumn;
    saveTasks();
    renderBoard();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderBoard();
}

if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value, columnSelect.value);
        taskInput.value = '';
        taskInput.focus();
    });
}

if (clearDoneBtn) {
    clearDoneBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.column !== 'done');
        saveTasks();
        renderBoard();
    });
}

if (resetBoardBtn) {
    resetBoardBtn.addEventListener('click', () => {
        tasks = DEFAULT_TASKS.map(t => ({ ...t }));
        saveTasks();
        renderBoard();
    });
}

document.querySelectorAll('.kanban-column').forEach(colEl => {
    colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        colEl.classList.add('drag-over');
    });

    colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
            colEl.classList.remove('drag-over');
        }
    });

    colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('drag-over');
        const targetCol = colEl.dataset.column;
        if (draggedTaskId && targetCol) {
            moveTask(draggedTaskId, targetCol);
        }
    });
});

renderBoard();
