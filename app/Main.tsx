"use client";
import { useId, useMemo, useEffect } from "react";
import AddTodoForm from "../components/AddTodoForm/AddTodoForm";

import useTodoStore from "./useTodoStore";
import TodoList from "../components/TodoList/TodoList";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ColorSchemeSwitch from "@/components/ColorSchemeSwitch/ColorSchemeSwitch";
import LocalStorageWarning from "@/components/LocalStorageWarning/LocalStorageWarning";
import TodoListSkeleton from "@/components/TodoList/TodoListSkeleton";
import AboutThisProject from "@/components/AboutThisProject/AboutThisProject";
import { focusDOMElementById } from "@/lib/helpers";

function Main() {
	const newTodoInputFieldId = useId();
	const {
		todoStoreTodos,
		addTodo,
		toggleTodoCompletion,
		updateTodoText,
		deleteTodo,
		completeAllTodos,
		clearCompletedTodos,
		isLocalStorageWorking,
	} = useTodoStore();

	console.log(
		"isLocalStorageWorking in Main component:",
		isLocalStorageWorking,
	);

	const {
		noOfTodos,
		noOfIncompleteTodos,
		noOfCompletedTodos,
	}: {
		noOfTodos: number;
		noOfIncompleteTodos: number;
		noOfCompletedTodos: number;
	} = useMemo(() => {
		if (
			typeof todoStoreTodos === "undefined" ||
			todoStoreTodos === "initializing"
		) {
			return { noOfTodos: 0, noOfIncompleteTodos: 0, noOfCompletedTodos: 0 };
		}
		const noOfTodos = todoStoreTodos.length;
		const noOfIncompleteTodos = todoStoreTodos.filter(
			(todo) => !todo.isCompleted,
		).length;
		const noOfCompletedTodos = noOfTodos - noOfIncompleteTodos;

		return { noOfTodos, noOfIncompleteTodos, noOfCompletedTodos };
	}, [todoStoreTodos]);

	useEffect(() => {
		const functionSignature = "App.tsx@keyDownHandler useEffect()";

		// throw Error("Test error thrown in useEffect to check error boundary");

		const keyDownHandler = (event: KeyboardEvent) => {
			const functionSignature = "App.tsx@keyDownHandler()";
			// console.log(functionSignature, "Key down event detected");
			if (event.key === "Enter" && event.ctrlKey) {
				console.log(functionSignature, "Ctrl+Enter detected");
				event.preventDefault();
				focusDOMElementById(newTodoInputFieldId);
				window.scrollTo(0, 0);
			}
		};
		console.log(functionSignature, "Adding global keydown event listener");
		window.addEventListener("keydown", keyDownHandler);

		return () => {
			console.log(functionSignature, "Removing global keydown event listener");
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [newTodoInputFieldId]);

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

	function handleCompleteAllTodos() {
		const functionSignature = "Main.tsx@handleCompleteAllTodos()";
		console.log(functionSignature, "Completing all todos...");
		completeAllTodos();
	}

	function handleClearCompletedTodos() {
		const functionSignature = "Main.tsx@handleClearCompletedTodos()";
		console.log(functionSignature, "Clearing completed todos...");
		clearCompletedTodos();
	}

	function renderTodoList() {
		if (
			typeof todoStoreTodos === "undefined" ||
			todoStoreTodos === "initializing"
		) {
			return <TodoListSkeleton />;
		} else if (todoStoreTodos.length === 0) {
			return (
				<div className="mt-10 text-center text-lg text-zinc-500 italic">
					You have no todos yet. Add one above to get started!
				</div>
			);
		} else {
			return (
				<TodoList
					todos={todoStoreTodos}
					noOfTodos={noOfTodos}
					noOfIncompleteTodos={noOfIncompleteTodos}
					noOfCompletedTodos={noOfCompletedTodos}
					handleToggleTodoCompletion={handleToggleTodoCompletion}
					handleUpdateTodoText={handleUpdateTodoText}
					handleDeleteTodo={handleDeleteTodo}
					handleCompleteAllTodos={handleCompleteAllTodos}
					handleClearCompletedTodos={handleClearCompletedTodos}
				/>
			);
			// return <TodoListSkeleton />;
		}
	}

	return (
		<div className="bg-background w-full">
			<div className="relative px-2 pt-5 md:px-5 md:pt-7">
				<AboutThisProject />
				<ColorSchemeSwitch />
			</div>
			<div className="mx-auto min-h-screen w-full max-w-5xl min-w-0 pb-7">
				<Header />
				<LocalStorageWarning isLocalStorageWorking={isLocalStorageWorking} />
				<AddTodoForm
					handleAddTodo={handleAddTodo}
					newTodoInputFieldId={newTodoInputFieldId}
				/>
				{renderTodoList()}
				<Footer />
			</div>
		</div>
	);
}

export default Main;
