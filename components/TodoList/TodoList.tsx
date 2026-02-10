import { useEffect, useState, useMemo } from "react";
import type { TTodo } from "../../app/useTodoStore";
import TodoListItem from "./TodoListItem";
import {
	FRIENDLY_DATE_RERENDER_INTERVAL_MS,
	shortenPhrase,
	FILTERING_OPTIONS,
	TFilteringOption,
	SORTING_OPTIONS,
	TSortingOption,
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
import FilterListButtons from "./FilterListButtons";
import SortListButtons from "./SortListButtons";

export interface TTodoListProps {
	todos: TTodo[];
	noOfTodos: number;
	noOfIncompleteTodos: number;
	noOfCompletedTodos: number;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleUpdateTodoText(todoId: number, newText: string): void;
	handleDeleteTodo(todoId: number): void;
}

function TodoList({
	todos,
	noOfTodos,
	noOfIncompleteTodos,
	noOfCompletedTodos,
	handleToggleTodoCompletion,
	handleUpdateTodoText,
	handleDeleteTodo,
}: TTodoListProps) {
	const [triggerFriendlyDateRerender, setTriggerFriendlyDateRerender] =
		useState<number>(0);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
	const [todoIdToDelete, setTodoIdToDelete] = useState<number | null>(null);
	const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
	const [currentSortingOption, setCurrentSortingOption] =
		useState<TSortingOption>("default");
	const [currentFilteringOption, setCurrentFilteringOption] =
		useState<TFilteringOption>("all");

	const sortedAndFilteredTodos = useMemo(() => {
		let filteredTodos: TTodo[] = [];

		if (currentFilteringOption === FILTERING_OPTIONS.all) {
			filteredTodos.push(...todos);
		} else {
			filteredTodos = todos.filter((todo) => {
				if (currentFilteringOption === FILTERING_OPTIONS.completed) {
					return todo.isCompleted === true;
				} else if (currentFilteringOption === FILTERING_OPTIONS.incomplete) {
					return todo.isCompleted === false;
				}
			});
		}

		const sortedTodos: TTodo[] = [...filteredTodos];

		if (currentSortingOption === SORTING_OPTIONS.default) {
			// sort by incomplete first then by newest first
			sortedTodos.sort((a, b) => {
				if (a.isCompleted && !b.isCompleted) {
					return 1;
				} else if (!a.isCompleted && b.isCompleted) {
					return -1;
				} else {
					const aDateObj = new Date(a.createdAt);
					const bDateObj = new Date(b.createdAt);
					return bDateObj.getTime() - aDateObj.getTime();
				}
			});
		} else if (currentSortingOption === SORTING_OPTIONS["date-created-desc"]) {
			sortedTodos.sort((a, b) => {
				const aDateObj = new Date(a.createdAt);
				const bDateObj = new Date(b.createdAt);
				return bDateObj.getTime() - aDateObj.getTime();
			});
		} else if (currentSortingOption === SORTING_OPTIONS["date-created-asc"]) {
			sortedTodos.sort((a, b) => {
				const aDateObj = new Date(a.createdAt);
				const bDateObj = new Date(b.createdAt);
				return aDateObj.getTime() - bDateObj.getTime();
			});
		} else if (currentSortingOption === SORTING_OPTIONS["title-asc"]) {
			sortedTodos.sort((a, b) => {
				return a.text.localeCompare(b.text);
			});
		}

		return sortedTodos;
	}, [todos, currentSortingOption, currentFilteringOption]);

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

	function handleUpdateTodoTextProper(todoId: number, newText: string) {
		handleUpdateTodoText(todoId, newText);
		setEditingTodoId(null);
	}

	return (
		<div className="py-5">
			<div className="mb-2 flex flex-wrap gap-4 px-3">
				<FilterListButtons
					noOfTodos={noOfTodos}
					noOfIncompleteTodos={noOfIncompleteTodos}
					noOfCompletedTodos={noOfCompletedTodos}
					currentFilteringOption={currentFilteringOption}
					setCurrentFilteringOption={setCurrentFilteringOption}
				/>
				<SortListButtons
					currentSortingOption={currentSortingOption}
					setCurrentSortingOption={setCurrentSortingOption}
				/>
			</div>
			<ul>
				{sortedAndFilteredTodos.map((todo) => (
					<TodoListItem
						key={todo.id}
						todo={todo}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						isTodoBeingEdited={editingTodoId === todo.id}
						handleEditTodo={(todoId) => setEditingTodoId(todoId)}
						handleCancelEditingTodo={() => setEditingTodoId(null)}
						handleUpdateTodoTextProper={handleUpdateTodoTextProper}
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
		</div>
	);
}

export default TodoList;
