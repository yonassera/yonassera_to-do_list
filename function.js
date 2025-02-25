let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks = tasks.map(task => task && typeof task === 'object' ? task : { text: '', completed: false });

let undoStack = [JSON.parse(JSON.stringify(tasks))]; // Initialize undo stack with initial state
let redoStack = [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskText = document.getElementById('taskInput').value.trim();
    if (taskText === '') return;

    const task = { text: taskText, completed: false };
    tasks.push(task);
    undoStack.push(JSON.parse(JSON.stringify(tasks))); // Save state for undo
    redoStack = []; // Clear redo stack on new task addition

    saveTasks();
    updateList();
    document.getElementById('taskInput').value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function updateList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task' + (task.completed ? ' completed' : '');
        li.draggable = true;
        li.ondragstart = (e) => dragStart(e, index);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.onblur = () => editTask(index, input.value);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleComplete(index);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '❌';
        deleteBtn.onclick = () => removeTask(index);
        
        li.appendChild(checkbox);
        li.appendChild(input);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateProgress();
}

function removeTask(index) {
    redoStack.push(JSON.parse(JSON.stringify(tasks))); // Save state for redo
    tasks.splice(index, 1);
    undoStack.push(JSON.parse(JSON.stringify(tasks)));

    saveTasks();
    updateList();
}

function editTask(index, newText) {
    tasks[index].text = newText;
    undoStack.push(JSON.parse(JSON.stringify(tasks)));

    saveTasks();
    updateList();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    undoStack.push(JSON.parse(JSON.stringify(tasks)));

    saveTasks();
    updateList();
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        tasks = JSON.parse(JSON.stringify(undoStack[undoStack.length - 1]));
        
        saveTasks();
        updateList();
    }
}

function redo() {
    if (redoStack.length > 0) {
        tasks = redoStack.pop();
        undoStack.push(JSON.parse(JSON.stringify(tasks)));

        saveTasks();
        updateList();
    }
}

function updateProgress() {
    const completedCount = tasks.filter(task => task.completed).length;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('totalCount').textContent = tasks.length;
}

// ✅ Ensure tasks are loaded from localStorage on page load
window.onload = function() {
    updateList();
};
