import { ITodo } from "@/App";

export async function getTodosAction() {
  const todosData = await fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((json) => console.log(json));
  return todosData as unknown as ITodo[];
}
