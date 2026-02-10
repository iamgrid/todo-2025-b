"use client";
import { useId, useState, useMemo, useEffect, useCallback } from "react";
import AddTodoForm from "../components/AddTodoForm/AddTodoForm";

import useTodoStore from "./useTodoStore";
import TodoList from "../components/TodoList/TodoList";

function Main() {
	const newTodoInputFieldId = useId();
	const {
		todoStoreTodos,
		addTodo,
		toggleTodoCompletion,
		updateTodoText,
		deleteTodo,
	} = useTodoStore();

	const [isCompleteAllAlertDialogOpen, setIsCompleteAllAlertDialogOpen] =
		useState<boolean>(false);
	const [isClearCompletedAlertDialogOpen, setIsClearCompletedAlertDialogOpen] =
		useState<boolean>(false);

	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

	const {
		noOfTodos,
		noOfIncompleteTodos,
		noOfCompletedTodos,
	}: {
		noOfTodos: number;
		noOfIncompleteTodos: number;
		noOfCompletedTodos: number;
	} = useMemo(() => {
		const noOfTodos = todoStoreTodos.length;
		const noOfIncompleteTodos = todoStoreTodos.filter(
			(todo) => !todo.isCompleted,
		).length;
		const noOfCompletedTodos = noOfTodos - noOfIncompleteTodos;

		return { noOfTodos, noOfIncompleteTodos, noOfCompletedTodos };
	}, [todoStoreTodos]);

	const focusNewTodoInputField = useCallback(() => {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			newTodoInputFieldId,
		) as HTMLInputElement | null;
		if (newTodoInputField !== null) {
			newTodoInputField.focus();
		} else {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!",
			);
		}
	}, [newTodoInputFieldId]);

	const showSnackbarMessage = useCallback((message: string) => {
		setSnackbarMessage(message);
		setIsSnackbarOpen(true);
	}, []);

	useEffect(() => {
		const functionSignature = "App.tsx@keyDownHandler useEffect()";

		const keyDownHandler = (event: KeyboardEvent) => {
			const functionSignature = "App.tsx@keyDownHandler()";
			// console.log(functionSignature, "Key down event detected");
			if (event.key === "Enter" && event.ctrlKey) {
				console.log(functionSignature, "Ctrl+Enter detected");
				event.preventDefault();
				focusNewTodoInputField();
				window.scrollTo(0, 0);
			}
		};
		console.log(functionSignature, "Adding global keydown event listener");
		window.addEventListener("keydown", keyDownHandler);

		return () => {
			console.log(functionSignature, "Removing global keydown event listener");
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [focusNewTodoInputField]);

	function handleAddTodo(newTodoText: string) {
		addTodo(newTodoText);
	}

	function handleToggleTodoCompletion(todoId: number, newStatus: boolean) {
		const functionSignature = "App.tsx@handleToggleTodoCompletion()";
		console.log(functionSignature, `Toggling todo completion for ID ${todoId}`);
		toggleTodoCompletion(todoId, newStatus);
	}

	function handleUpdateTodoText(todoId: number, newText: string) {
		const functionSignature = "Main.tsx@handleUpdateTodoText()";
		console.log(
			functionSignature,
			`Updating text for todo ID ${todoId} to "${newText}"`,
		);
		updateTodoText(todoId, newText);
	}

	function handleDeleteTodo(todoId: number) {
		const functionSignature = "Main.tsx@handleDeleteTodo()";
		console.log(functionSignature, `Deleting todo with ID ${todoId}`);
		deleteTodo(todoId);
	}

	return (
		<div className="bg-background w-full">
			<div className="mx-auto min-h-screen w-full max-w-5xl min-w-0 p-2 sm:p-6 lg:p-12">
				<AddTodoForm
					handleAddTodo={handleAddTodo}
					newTodoInputFieldId={newTodoInputFieldId}
					focusNewTodoInputField={focusNewTodoInputField}
				/>
				{todoStoreTodos.length > 0 ? (
					<TodoList
						todos={todoStoreTodos}
						noOfTodos={noOfTodos}
						noOfIncompleteTodos={noOfIncompleteTodos}
						noOfCompletedTodos={noOfCompletedTodos}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						handleUpdateTodoText={handleUpdateTodoText}
						handleDeleteTodo={handleDeleteTodo}
					/>
				) : (
					<div className="mt-10 text-center text-lg text-zinc-500 italic">
						You have no todos yet. Add one above to get started!
					</div>
				)}
			</div>
		</div>
	);
}

export default Main;
