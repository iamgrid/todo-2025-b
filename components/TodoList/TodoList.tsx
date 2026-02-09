import { useEffect, useState } from "react";
import type { TTodo } from "../../app/useTodoStore";
import TodoListItem from "./TodoListItem";
import {
	FRIENDLY_DATE_RERENDER_INTERVAL_MS,
	shortenPhrase,
} from "@/lib/helpers";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogMedia,
} from "../ui/alert-dialog";
import { IconTrash } from "@tabler/icons-react";

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
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
	const [todoIdToDelete, setTodoIdToDelete] = useState<number | null>(null);
	const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

	useEffect(() => {
		const functionSignature = "TodoList.tsx@rerender FriendlyDates useEffect()";
		const interval = setInterval(() => {
			setTriggerFriendlyDateRerender((prev) => prev + 1);
			console.log(functionSignature, "triggered");
		}, FRIENDLY_DATE_RERENDER_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	function handleDeleteTodoProper(todoId: number) {
		setTodoIdToDelete(todoId);
		setIsDeleteDialogOpen(true);
	}

	function handleCancelDelete() {
		setTodoIdToDelete(null);
		setIsDeleteDialogOpen(false);
	}

	return (
		<>
			<ul>
				{todos.map((todo, ix) => (
					<TodoListItem
						key={todo.id}
						todo={todo}
						listItemIndex={ix}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						handleUpdateTodoText={handleUpdateTodoText}
						handleDeleteTodoProper={handleDeleteTodoProper}
						triggerFriendlyDateRerender={triggerFriendlyDateRerender}
					/>
				))}
			</ul>
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={handleCancelDelete}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogMedia>
							<IconTrash size={48} />
						</AlertDialogMedia>
						<AlertDialogTitle>
							You are about to delete the following todo:
						</AlertDialogTitle>
						<AlertDialogDescription>
							{shortenPhrase(
								todoIdToDelete !== null
									? todos.find((t) => t.id === todoIdToDelete)?.text
									: "Error: Could not find the todo to delete!",
								100,
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancelDelete}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								const functionSignature =
									"TodoList.tsx@AlertDialogAction onClick()";
								if (todoIdToDelete === null) {
									console.error(
										functionSignature,
										"todoIdToDelete is null when trying to delete!",
									);
									return;
								}
								handleDeleteTodo(todoIdToDelete);
								setTodoIdToDelete(null);
								setIsDeleteDialogOpen(false);
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default TodoList;
