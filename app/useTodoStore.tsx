import useLocalStorageState from "use-local-storage-state";

export interface TNewTodo {
	text: string;
}

export interface TTodo extends TNewTodo {
	id: number;
	isCompleted: boolean;
	createdAt: string; // ISO string
	lastUpdatedAt: null | string; // ISO string
	completedAt: null | string; // ISO string
}

const defaultTodos: TTodo[] = [
	{
		id: 1,
		text: "Buy avocado",
		isCompleted: false,
		createdAt: "2026-01-01T10:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: null,
	},
	{
		id: 2,
		text: "Do 50 push-ups",
		isCompleted: false,
		createdAt: "2026-01-02T11:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: null,
	},
];

export default function useTodoStore() {
	const [todoStoreTodos, setTodos, { isPersistent: isLocalStorageWorking }] =
		useLocalStorageState("todo-2025-b", {
			defaultValue: defaultTodos,
		});

	function addTodo(text: string) {
		let newId = 1;
		if (todoStoreTodos.length > 0) {
			newId = Math.max(...todoStoreTodos.map((t) => t.id)) + 1;
		}

		const newTodo: TTodo = {
			id: newId,
			text,
			isCompleted: false,
			createdAt: new Date().toISOString(),
			lastUpdatedAt: null,
			completedAt: null,
		};

		setTodos([...todoStoreTodos, newTodo]);
	}

	function toggleTodoCompletion(todoId: number, newStatus: boolean) {
		const updatedTodos = todoStoreTodos.map((todo) => {
			if (todo.id === todoId) {
				const nowISOString = new Date().toISOString();
				return {
					...todo,
					isCompleted: newStatus,
					completedAt: newStatus ? nowISOString : null,
				};
			}
			return todo;
		});

		setTodos(updatedTodos);
	}

	function updateTodoText(todoId: number, newText: string) {
		const updatedTodos = todoStoreTodos.map((todo) => {
			if (todo.id === todoId) {
				return {
					...todo,
					text: newText,
					lastUpdatedAt: new Date().toISOString(),
				};
			}
			return todo;
		});

		setTodos(updatedTodos);
	}

	function deleteTodo(todoId: number) {
		const updatedTodos = todoStoreTodos.filter((todo) => todo.id !== todoId);
		setTodos(updatedTodos);
	}

	function completeAllTodos() {
		const nowISOString = new Date().toISOString();
		const updatedTodos = todoStoreTodos.map((todo) => {
			if (!todo.isCompleted) {
				return { ...todo, isCompleted: true, completedAt: nowISOString };
			}
			return todo;
		});
		setTodos(updatedTodos);
	}

	function clearCompletedTodos() {
		const updatedTodos = todoStoreTodos.filter((todo) => !todo.isCompleted);
		setTodos(updatedTodos);
	}

	return {
		isLocalStorageWorking,
		todoStoreTodos,
		addTodo,
		toggleTodoCompletion,
		updateTodoText,
		deleteTodo,
		completeAllTodos,
		clearCompletedTodos,
	};
}
