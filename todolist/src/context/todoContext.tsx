import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { TTodo } from "../types/todo";

interface ItodoContext {
    todos?: TTodo[];
    doneTodos: TTodo[];
    completeTodo?: (todo: TTodo) => void;
    deleteTodo?: (todo: TTodo) => void;
    addTodo: (text: string) => void;
}
export const TodoContext = createContext<ItodoContext | undefined>(undefined);

export const TodoProvider = ({children}: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo = { id: Date.now(), text };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
    const completeTodo = (todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos(prevDoneTodos => [...prevDoneTodos, todo]);
    };
    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo) => prevDoneTodo.filter((t) => t.id !== todo.id));
    };

    return <TodoContext.Provider value={{todos, doneTodos, completeTodo, deleteTodo, addTodo}}>
        {children}
    </TodoContext.Provider>
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    //컨텍스트가 없는 경우
    if(!context) {
        throw new Error("useTodo must be used within a TodoProvider");
    }
    //있는 경우
    return context;
};