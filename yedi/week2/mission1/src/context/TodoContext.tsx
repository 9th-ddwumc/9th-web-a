import React, { createContext, useContext, useState } from 'react';
import type { TTodo } from '../types/todo';

interface TodoContextType {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = { id: Date.now(), text };
    setTodos((previousTodos) => [...previousTodos, newTodo]);
  };

  const completeTodo = (todo: TTodo) => {
    setTodos((previousTodos) => 
      previousTodos.filter((t) => t.id !== todo.id)
    );
    setDoneTodos((previousDoneTodos) => [...previousDoneTodos, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((previousTodos) => 
      previousTodos.filter((t) => t.id !== todo.id)
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error(
      'useTodo는 반드시 TodoProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
};