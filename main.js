const user_modal = document.getElementById("user-modal");
const close = document.getElementById("close");
const save = document.getElementById("save");
const result = document.getElementById("result");
let form = {};
let edit_user = -1;
let delete_user = -1;

let todos = JSON.parse(localStorage.getItem("todos")) || [
    { status: "open", tasks: [] },
    { status: "pending", tasks: [] },
    { status: "inprogress", tasks: [] },
    { status: "complete", tasks: [] }
];

document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
});

close.addEventListener("click", function () {
    toggleModal("none");
});

window.addEventListener("click", function (event) {
    if (event.target === user_modal) {
        toggleModal("none");
    }
});

save.addEventListener("click", (e) => {
    e.preventDefault();
    createTask();
});

function handleChange(event) {
    const { name, value } = event.target;
    form = { ...form, [name]: value };
}

function displayTasks() {
    result.innerHTML = "";
    todos.forEach((item, statusIndex) => {
        let col = document.createElement("div");
        col.classList.add('col-md-3');
        let task_list = item.tasks.map((task, index) => {
            return `
                <li class="d-flex justify-content-between my-2">
                    ${task}
                    <div class="d-flex gap-2">
                        <button class="btn btn-warning" onclick="editUser(${statusIndex}, ${index})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteUser(${statusIndex}, ${index})">Delete</button>
                    </div>
                </li>`;
        }).join("");

        col.innerHTML = `
           <div class="card">
               <div class="card-header"><h3 class="text-center text-uppercase">${item.status}</h3></div>
               <div class="card-body"><ol>${task_list}</ol></div>
               <div class="card-footer d-flex justify-content-center">
                   <button class="btn btn-success" onclick="openModal('${item.status}')">Add Task</button>
               </div>
           </div>`;

        result.appendChild(col);
    });
}

function saveStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function toggleModal(status) {
    user_modal.style.display = status;
    if (status === "none") {
        form = {};  // Reset form on modal close
        document.querySelector("form").reset();
    }
}

function openModal(status) {
    form = { status: status }; // Set the status in the form when opening the modal
    toggleModal("block");
}

function createTask() {
    const { task, status } = form;
    if (!task || !status) return; // Ensure form is not empty

    if (edit_user > -1) {
        todos[edit_user].tasks[delete_user] = task;
        edit_user = -1;  // Reset edit mode
    } else {
        todos.forEach(item => {
            if (item.status === status) {
                item.tasks.push(task);
            }
        });
    }
    displayTasks();
    saveStorage();
    toggleModal("none");
}

function deleteUser(statusIndex, taskIndex) {
    todos[statusIndex].tasks.splice(taskIndex, 1);
    saveStorage();
    displayTasks();
}

function editUser(statusIndex, taskIndex) {
    form = {
        task: todos[statusIndex].tasks[taskIndex],
        status: todos[statusIndex].status
    };
    edit_user = statusIndex;
    delete_user = taskIndex;
    document.querySelector("input[name='task']").value = form.task;
    toggleModal("block");
}
