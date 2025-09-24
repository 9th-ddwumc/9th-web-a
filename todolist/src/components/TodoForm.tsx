import { useState, type FormEvent } from "react";
import { useTodo } from "../context/todoContext";

const   TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();

        if(text){
            addTodo(text);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-container__form">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="할 일 입력"
                    className="todo-container__input"
                    required
                 />
                <button className="todo-container__button" type="submit">
                    할 일 추가
                </button>
            </form>
    );
};

export default TodoForm;