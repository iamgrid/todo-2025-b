"use client";
import { useId, useState, useMemo, useReducer, useEffect, useCallback } from "react";
import AddTodoForm from "../components/AddTodoForm/AddTodoForm";

import {
	todoStoreReducer,
	initialTodoStoreState,
	getAllTodoObjectsFromLocalStorage,
	TTodoStoreActionTypes,
	// deleteTodosFromLocalStorage,
} from "./todoStore";
import TodoList from "@/components/TodoList/TodoList";

let hasAppBeenInitialized: boolean = false;

function Main() {
	const newTodoInputFieldId = useId();
	const [todoStoreState, todoStoreDispatch] = useReducer(
		todoStoreReducer,
		initialTodoStoreState
	);

	const [isCompleteAllAlertDialogOpen, setIsCompleteAllAlertDialogOpen] =
		useState<boolean>(false);
	const [
		isClearCompletedAlertDialogOpen,
		setIsClearCompletedAlertDialogOpen,
	] = useState<boolean>(false);
	const [
		isCorruptedLSTodosAlertDialogOpen,
		setIsCorruptedLSTodosAlertDialogOpen,
	] = useState<boolean>(false);
	const [corruptedLSTodoKeys, setCorruptedLSTodoKeys] = useState<string[]>(
		[]
	);

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
		const noOfTodos = todoStoreState.todos.length;
		const noOfIncompleteTodos = todoStoreState.todos.filter(
			(todo) => !todo.isCompleted
		).length;
		const noOfCompletedTodos = noOfTodos - noOfIncompleteTodos;

		return { noOfTodos, noOfIncompleteTodos, noOfCompletedTodos };
	}, [todoStoreState.todos]);

	const focusNewTodoInputField = useCallback(() => {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			newTodoInputFieldId
		) as HTMLInputElement | null;
		if (newTodoInputField !== null) {
			newTodoInputField.focus();
		} else {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!"
			);
		}
	}, [newTodoInputFieldId]);

	const showSnackbarMessage = useCallback(
		(message: string) => {
			setSnackbarMessage(message);
			setIsSnackbarOpen(true);
		},
		[]
	);

	const showCorruptedLSTodosAlertDialog = useCallback((corruptedLSTodoKeys: string[]) => {
		setCorruptedLSTodoKeys(corruptedLSTodoKeys);
		setIsCorruptedLSTodosAlertDialogOpen(true);
	}, []);

	useEffect(() => {
		const functionSignature = "App.tsx@component mounted useEffect()";

		if (hasAppBeenInitialized) {
			console.log(
				functionSignature,
				"App has already been initialized, skipping..."
			);
			return;
		}
		hasAppBeenInitialized = true;

		console.log(functionSignature, "App initializing...");

		// throw Error("Test error for ErrorBoundary");

		// Check if localStorage is available
		let isLocalStorageAvailable = true;
		try {
			const testKey = "__storage_test__";
			localStorage.setItem(testKey, testKey);
			localStorage.removeItem(testKey);
			console.log(
				functionSignature,
				"localStorage is available for use."
			);
		} catch (e) {
			console.warn(functionSignature, "localStorage is not available.", e);
			isLocalStorageAvailable = false;
		}

		if (!isLocalStorageAvailable) {
			showSnackbarMessage(
				"Warning: localStorage looks to be disabled in your browser. Your todos will not be saved between sessions."
			);

			todoStoreDispatch({
				type: TTodoStoreActionTypes.SET_LOCAL_STORAGE_AVAILABILITY,
				payload: { isLocalStorageAvailable: false },
			});
		} else {
			// Load user data from localStorage
			const todosFromLocalStorageResponse =
				getAllTodoObjectsFromLocalStorage();

			console.log(
				functionSignature,
				"todosFromLocalStorageResponse:",
				todosFromLocalStorageResponse
			);

			if (todosFromLocalStorageResponse !== null) {
				console.log(
					functionSignature,
					"localStorage contained todos for this user, updating state..."
				);

				todoStoreDispatch({
					type: TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE,
					payload: todosFromLocalStorageResponse.validTodos,
				});

				if (todosFromLocalStorageResponse.invalidTodoKeys.length > 0) {
					setCorruptedLSTodoKeys([
						...todosFromLocalStorageResponse.invalidTodoKeys,
					]);
					showCorruptedLSTodosAlertDialog([
						...todosFromLocalStorageResponse.invalidTodoKeys,
					]);
				}

				showSnackbarMessage(
					`Restored ${
						todosFromLocalStorageResponse.validTodos.length
					} todo${
						todosFromLocalStorageResponse.validTodos.length === 1
							? ""
							: "s"
					} from localStorage.`
				);
			}
		}
	}, [showSnackbarMessage, showCorruptedLSTodosAlertDialog]);

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
			console.log(
				functionSignature,
				"Removing global keydown event listener"
			);
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [focusNewTodoInputField]);

	function handleAddTodo(newTodoText: string) {
		todoStoreDispatch({
			type: TTodoStoreActionTypes.ADD_TODO,
			payload: { text: newTodoText },
		});
	}
	
	return (
		<>
			<AddTodoForm
				handleAddTodo={handleAddTodo}
				newTodoInputFieldId={newTodoInputFieldId}
				focusNewTodoInputField={focusNewTodoInputField}
			/>
			<TodoList todos={todoStoreState.todos} />
		</>
	);
}

export default Main;