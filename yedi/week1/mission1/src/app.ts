// app.ts
// localStorage 관련 타입 및 인터페이스 정의
interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoData {
    pending: TodoItem[];
    completed: TodoItem[];
}

//localStorage 관련 함수들
// localStorage에서 할 일 목록 불러오기
const loadTodosFromStorage = (): TodoData => {
    try {
        const savedTodos = localStorage.getItem('yedi-todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        }
    } catch (error) {
        console.error('할 일 목록을 불러오는 중 오류가 발생했습니다:', error);
    }
    
    // 기본값 반환
    return {
        pending: [],
        completed: []
    };
};

// localStorage에 할 일 목록 저장하기
const saveTodosToStorage = (todos: TodoData): void => {
    try {
        localStorage.setItem('yedi-todos', JSON.stringify(todos));
    } catch (error) {
        console.error('할 일 목록을 저장하는 중 오류가 발생했습니다:', error);
    }
};

document.addEventListener('DOMContentLoaded', (): void => {
    const todoInput: HTMLInputElement = document.getElementById('todo-input') as HTMLInputElement;
    const addButton: HTMLButtonElement = document.getElementById('add-button') as HTMLButtonElement;
    const pendingList: HTMLUListElement = document.getElementById('pending-list') as HTMLUListElement;
    const completedList: HTMLUListElement = document.getElementById('completed-list') as HTMLUListElement;

    // 현재 DOM에서 할 일 목록 데이터 추출하기 (함수를 DOMContentLoaded 내부로 이동)
    const extractTodosFromDOM = (): TodoData => {
        const pendingItems = Array.from(pendingList.children).map((li, index) => ({
            id: Date.now() + index, // 간단한 ID 생성
            text: (li.querySelector('span') as HTMLSpanElement).textContent || '',
            completed: false
        }));

        const completedItems = Array.from(completedList.children).map((li, index) => ({
            id: Date.now() + index + 1000, // 간단한 ID 생성
            text: (li.querySelector('span') as HTMLSpanElement).textContent || '',
            completed: true
        }));

        return {
            pending: pendingItems,
            completed: completedItems
        };
    };

    //  localStorage에서 저장된 할 일 목록 불러와서 DOM에 렌더링 
    const loadAndRenderTodos = (): void => {
        const savedTodos = loadTodosFromStorage();
        
        // 미완료 할 일들 렌더링
        savedTodos.pending.forEach(todo => {
            addTodoToDOM(todo.text, false);
        });
        
        // 완료된 할 일들 렌더링
        savedTodos.completed.forEach(todo => {
            addTodoToDOM(todo.text, true);
        });
    };

    // 할일 추가 버튼 클릭 이벤트
    addButton.addEventListener('click', (): void => {
        const todoText: string = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
        }
    });

    // 할 일 추가 함수 (localStorage 저장 기능 추가)
    const addTodo = (text: string): void => {
        addTodoToDOM(text, false);
        
        //localStorage에 할 일 목록 저장 
        const currentTodos = extractTodosFromDOM();
        saveTodosToStorage(currentTodos);
    };

    // DOM에 할 일 추가하는 함수 
    const addTodoToDOM = (text: string, isCompleted: boolean): void => {
        const li: HTMLLIElement = document.createElement('li');
        
        if (isCompleted) {
            // 완료된 할 일인 경우
            li.innerHTML = `
                <span>${text}</span>
                <div class="buttons">
                    <button class="delete-btn">삭제</button>
                </div>
            `;
            li.classList.add('completed');
            completedList.appendChild(li);
            
            // 삭제 버튼 이벤트
            const deleteBtn: HTMLButtonElement = li.querySelector('.delete-btn') as HTMLButtonElement;
            deleteBtn.addEventListener('click', (): void => {
                li.remove();
                // localStorage에 할 일 목록 저장 
                const currentTodos = extractTodosFromDOM();
                saveTodosToStorage(currentTodos);
            });
        } else {
            // 미완료 할 일인 경우
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
                    //  localStorage에 할 일 목록 저장
                    const currentTodos = extractTodosFromDOM();
                    saveTodosToStorage(currentTodos);
                });

                //  localStorage에 할 일 목록 저장 
                const currentTodos = extractTodosFromDOM();
                saveTodosToStorage(currentTodos);
            });
        }
    };

    //  페이지 로드 시 저장된 할 일 목록 불러오기
    loadAndRenderTodos();
});