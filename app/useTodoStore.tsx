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

	return {
		isLocalStorageWorking,
		todoStoreTodos,
		addTodo,
	};
}
