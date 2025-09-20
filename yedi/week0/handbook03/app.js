document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');

    // Enter 키로 할 일 추가
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const todoText = todoInput.value.trim();
            if (todoText) {
                addTodo(todoText);
                todoInput.value = '';
            }
        }
    });

    // 할 일 추가 
    const addTodo = (text) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <div class="buttons">
                <button class="complete-btn">완료</button>
            </div>
        `;
        pendingList.appendChild(li);

        // 완료 버튼 
        li.querySelector('.complete-btn').addEventListener('click', () => {
            li.classList.toggle('completed');
            completedList.appendChild(li);
            li.querySelector('.complete-btn').remove(); // 완료 버튼 제거
            
            // 해낸 일 목록에 삭제 버튼 추가
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            li.querySelector('.buttons').appendChild(deleteBtn);

            // 삭제 버튼 
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });
        });
    };
});