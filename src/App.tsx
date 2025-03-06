import { useEffect, useState } from "react";
import "./App.css";
import { getTodos, type Todo } from "./test";

type ToggleTodo = Omit<Todo, "title">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const AddTodo = () => {
    if (title === "") {
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    fetch("http://localhost:4000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });

    setTodoList((prev) => [...prev, newTodo]);
    setTitle("");
  };
  const DeleteTodo = async (id: Todo["id"]) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });

    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);
  const ToggleTodo = async ({ id, completed }: ToggleTodo) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: !completed,
      }),
    });
    setTodoList((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !completed,
          };
        }
        return todo;
      })
    );
  };

  return (
    <>
      <input type="text" value={title} onChange={titleChange} />
      <button onClick={AddTodo}>등록</button>
      <TodoList
        todoList={todoList}
        onDeleteClick={DeleteTodo}
        onToggleClick={ToggleTodo}
      />
    </>
  );
}

type TodoListProps = {
  todoList: Todo[];
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListProps) {
  return (
    <div>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          onDeleteClick={onDeleteClick}
          onToggleClick={onToggleClick}
        />
      ))}
    </div>
  );
}

type TodoItemProps = Todo & {
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoItem({
  id,
  title,
  completed,
  onDeleteClick,
  onToggleClick,
}: TodoItemProps) {
  const todoItemStyle: React.CSSProperties = {
    textDecoration: completed ? "line-through" : "none",
  };
  return (
    <ul>
      <li style={todoItemStyle}>{title}</li>
      <button onClick={() => onToggleClick({ id, completed })}>
        {completed ? "취소하기" : "완료하기"}
      </button>
      <button onClick={() => onDeleteClick(id)}>삭제</button>
    </ul>
  );
}

export default App;
