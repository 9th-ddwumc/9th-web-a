// app.ts
document.addEventListener('DOMContentLoaded', (): void => {
    const todoInput: HTMLInputElement = document.getElementById('todo-input') as HTMLInputElement;
    const addButton: HTMLButtonElement = document.getElementById('add-button') as HTMLButtonElement;
    const pendingList: HTMLUListElement = document.getElementById('pending-list') as HTMLUListElement;
    const completedList: HTMLUListElement = document.getElementById('completed-list') as HTMLUListElement;

    // 할일 추가 버튼 클릭 이벤트
    addButton.addEventListener('click', (): void => {
        const todoText: string = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
        }
    });

    // Enter 키 이벤트는 제거 (버튼으로만 추가하도록 변경)

    // 할 일 추가 함수
    const addTodo = (text: string): void => {
        const li: HTMLLIElement = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <div class="buttons">
                <button class="complete-btn">완료</button>
            </div>
        `;
        pendingList.appendChild(li);

        // 완료 버튼 이벤트
        const completeBtn: HTMLButtonElement = li.querySelector('.complete-btn') as HTMLButtonElement;
        completeBtn.addEventListener('click', (): void => {
            li.classList.toggle('completed');
            completedList.appendChild(li);
            completeBtn.remove(); // 완료 버튼 제거
            
            // 해낸 일 목록에 삭제 버튼 추가
            const deleteBtn: HTMLButtonElement = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            const buttonsDiv: HTMLDivElement = li.querySelector('.buttons') as HTMLDivElement;
            buttonsDiv.appendChild(deleteBtn);

            // 삭제 버튼 이벤트
            deleteBtn.addEventListener('click', (): void => {
                li.remove();
            });
        });
    };
});