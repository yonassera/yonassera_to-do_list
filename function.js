function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();
    
    if (taskText === "") return;
    
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);
    
    let textNode = document.createTextNode(" " + taskText);
    li.appendChild(textNode);
    
    li.onclick = function() {
        this.remove();
        saveTasks();
    };
    
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push(li.textContent.trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(taskText => {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        li.appendChild(checkbox);
        
        let textNode = document.createTextNode(" " + taskText);
        li.appendChild(textNode);
        
        li.onclick = function() {
            this.remove();
            saveTasks();
        };
        
        document.getElementById("taskList").appendChild(li);
    });
}

window.onload = loadTasks;