import type { TTodo } from "../../app/useTodoStore";

export interface TTodoListProps {
	todos: TTodo[];
}

function TodoList({ todos }: TTodoListProps) {
	return (
		<ul>
			{todos.map((todo) => (
				<li key={todo.id}>{todo.text}</li>
			))}
		</ul>
	);
}

export default TodoList;
