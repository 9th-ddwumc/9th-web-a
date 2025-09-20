// HTML 요소 가져오기
var todoInput = document.getElementById('todo-input');
var todoForm = document.getElementById('todo-form');
var todoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');
// 할 일 목록과 완료된 목록을 저장할 배열
var todos = [];
var doneTodos = [];
// 할 일 항목(li 태그)을 생성하는 함수
function createTodoElement(todo, isDone) {
    var listItem = document.createElement('li');
    listItem.className = 'todo-item';
    var textSpan = document.createElement('span');
    textSpan.className = 'todo-item-text';
    textSpan.textContent = todo.text;
    var button = document.createElement('button');
    button.className = 'todo-item-button';
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545'; // 빨간색
        button.onclick = function () { return deleteTodo(todo); };
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745'; // 초록색
        button.onclick = function () { return completeTodo(todo); };
    }
    listItem.appendChild(textSpan);
    listItem.appendChild(button);
    return listItem;
}
// 화면에 목록을 다시 그리는 함수
function renderTasks() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var item = createTodoElement(todo, false);
        todoList.appendChild(item);
    });
    doneTodos.forEach(function (todo) {
        var item = createTodoElement(todo, true);
        doneList.appendChild(item);
    });
}
// 할 일을 추가하는 함수
function addTodo(text) {
    if (text === '')
        return;
    var newTodo = {
        id: Date.now(), // 현재 시간을 고유 ID로 사용
        text: text,
    };
    todos.push(newTodo);
    todoInput.value = ''; // 입력창 비우기
    renderTasks();
}
// 할 일을 '완료' 상태로 바꾸는 함수
function completeTodo(todoToComplete) {
    todos = todos.filter(function (todo) { return todo.id !== todoToComplete.id; });
    doneTodos.push(todoToComplete);
    renderTasks();
}
// 완료된 할 일을 삭제하는 함수
function deleteTodo(todoToDelete) {
    doneTodos = doneTodos.filter(function (todo) { return todo.id !== todoToDelete.id; });
    renderTasks();
}
// 폼 제출(할 일 추가) 이벤트 처리
todoForm.addEventListener('submit', function (event) {
    event.preventDefault(); // 페이지가 새로고침되는 것을 방지
    addTodo(todoInput.value.trim());
});
// 페이지가 처음 로드될 때 한 번 렌더링 실행
renderTasks();
