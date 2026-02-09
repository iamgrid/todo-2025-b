import { useEffect, useState } from "react";
import type { TTodo } from "../../app/useTodoStore";
import TodoListItem from "./TodoListItem";
import { FRIENDLY_DATE_RERENDER_INTERVAL_MS } from "@/lib/helpers";

export interface TTodoListProps {
	todos: TTodo[];
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleUpdateTodoText(todoId: number, newText: string): void;
	handleDeleteTodo(todoId: number): void;
}

function TodoList({
	todos,
	handleToggleTodoCompletion,
	handleUpdateTodoText,
	handleDeleteTodo,
}: TTodoListProps) {
	const [triggerFriendlyDateRerender, setTriggerFriendlyDateRerender] =
		useState<number>(0);

	useEffect(() => {
		const functionSignature = "TodoList.tsx@rerender FriendlyDates useEffect()";
		const interval = setInterval(() => {
			setTriggerFriendlyDateRerender((prev) => prev + 1);
			console.log(functionSignature, "triggered");
		}, FRIENDLY_DATE_RERENDER_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	return (
		<ul>
			{todos.map((todo, ix) => (
				<TodoListItem
					key={todo.id}
					todo={todo}
					listItemIndex={ix}
					handleToggleTodoCompletion={handleToggleTodoCompletion}
					handleUpdateTodoText={handleUpdateTodoText}
					handleDeleteTodo={handleDeleteTodo}
					triggerFriendlyDateRerender={triggerFriendlyDateRerender}
				/>
			))}
		</ul>
	);
}

export default TodoList;
