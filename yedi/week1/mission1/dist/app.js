"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    addButton.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
        }
    });
    const addTodo = (text) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <div class="buttons">
                <button class="complete-btn">완료</button>
            </div>
        `;
        pendingList.appendChild(li);
        const completeBtn = li.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            completedList.appendChild(li);
            completeBtn.remove();
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '삭제';
            const buttonsDiv = li.querySelector('.buttons');
            buttonsDiv.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });
        });
    };
});
