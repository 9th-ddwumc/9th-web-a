// 1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 2. 할 일이 어떻게 생긴애인지 Type 정의
type Todo = {
    id: number;
    text: string;
}

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 할 일 목록 렌더링 하는 함수 정의
const renderTask = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    })

    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    })
};

// 3. 할 일 입력 텍스트 공백 처리
const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTask();
};

[
    { id: 1, text: '할 일 1'},
    { id: 2, text: '할 일 2'}
]

// 5. 할 일 상태 변경
const completeTask = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id); // 클릭한 거 빼고 렌더링
    doneTasks.push(todo);
    renderTask();
};

// 6. 완료된 할 일 삭제
const deleteTask = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTask();
};

// 7. 할 일 아이템 생성 함수
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');

    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');

    button.classList.add('render-container__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', (): void => {
        if (isDone) {
            deleteTask(todo);
        } else {
            completeTask(todo);
        }
    });

    li.appendChild(button);

    return li;
};

// 8. 폼 제출
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = getTodoText();

    if (text) {
        addTodo(text);
    }
});

renderTask();
