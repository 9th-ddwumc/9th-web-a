interface Task {
  text: string;
  completed: boolean;
}

const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList  = document.getElementById("todo-list")  as HTMLUListElement;
const doneList  = document.getElementById("done-list")  as HTMLUListElement;

let todos: Task[] = [];
let doneTasks: Task[] = [];

function renderTasks() {
  // 초기화
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // 해야 할 일
  todos.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "render__container__item";

    const span = document.createElement("span");
    span.textContent = task.text;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "완료";
    doneBtn.className = "render__container__item__button";
    doneBtn.addEventListener("click", () => {
      const [moved] = todos.splice(index, 1);
      doneTasks.unshift({ ...moved, completed: true });
      renderTasks();
    });

    li.append(span, doneBtn);
    todoList.appendChild(li);
  });

  // 해낸 일
  doneTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "render__container__item";

    const span = document.createElement("span");
    span.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.className = "render__container__item__button";
    delBtn.addEventListener("click", () => {
      doneTasks.splice(index, 1);
      renderTasks();
    });

    li.append(span, delBtn);
    doneList.appendChild(li);
  });
}

// 폼 제출(추가)
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.unshift({ text, completed: false });
  todoInput.value = "";
  renderTasks();
});
