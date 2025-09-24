import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const Todo = () => {
    const  [todos, setTodos] = useState<TTodo[]>([]);
    const  [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 새로고침 방지

        const text = input.trim();

        if (text) {
            const newTodo: TTodo = {id:Date.now(), text};
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setInput('');
        }
    }

    const completeTodo =(todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id))
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    }

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo) =>
            prevDoneTodo.filter((t) => t.id !== todo.id
        ))
    }

    return (
        <div className="todo-container">
            <h1 className="todo-container__header">TODO</h1>
            <TodoForm input={input} setInput={setInput} handleSubmit={handleSubmit}/>
            <div className="render-container">
                <TodoList 
                    title="할 일" 
                    todos={todos} 
                    buttonLabel="완료" 
                    buttonColor="#28a745"
                    onClick={completeTodo}/>
                <TodoList 
                    title="완료" 
                    todos={doneTodos} 
                    buttonLabel="삭제"
                    buttonColor="#dc3545"
                    onClick={deleteTodo}/>
            </div>
        </div>
    )
};

export default Todo;