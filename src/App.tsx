import { useActionState, useOptimistic, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic<ITodo[]>(todos);

  const addTodo = async (_: unknown, formData: any) => {
    const todo = formData.get("todo");
    if (!todo) return "Enter a todo item";

    const newTodo = {
      id: new Date().toISOString(),
      title: todo,
      completed: false,
    };

    setOptimisticTodos((currTodos) => [...currTodos, newTodo]);

    await new Promise((resolve) => {
      setTimeout(() => {
        setTodos([...todos, newTodo]);
        resolve(() => null);
      }, 1000);
    });
  };

  const clearAll = async (_: unknown, formData: any) => {
    const buttonId = formData.get("delete-btn");
    const newTodos = todos.filter((todo) => todo.id !== buttonId);
    setTodos(newTodos);
    return null;
  };

  const [error, submitAction, isPending] = useActionState(addTodo, null);
  const [, clearAction] = useActionState(clearAll, null);

  return (
    <div className="flex items-center justify-center">
      <div className="mt-20 w-3/5">
        <form action={submitAction}>
          <div className="flex items-center gap-5">
            <Input type="text" name="todo" />
            <Button type="submit">Add Todo Item</Button>
          </div>
        </form>
        <ul className="flex flex-col gap-4 mt-4">
          {isPending && <div>Loading...</div>}
          {error && !isPending && <div className="text-red-500">{error}</div>}
          {optimisticTodos?.map((todo, index) => {
            return (
              <li key={index} className="flex justify-between items-center">
                {todo.title}
                <form action={clearAction}>
                  <Button
                    type="submit"
                    name="delete-btn"
                    value={todo.id}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </form>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
