import { TODO_KEY_PREFIX } from "../lib/helpers";

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

export interface TTodoStoreState {
	todoIdIterator: number;
	isLocalStorageAvailable: boolean;
	todos: TTodo[];
}

export const initialTodoStoreState: TTodoStoreState = {
	todoIdIterator: 1,
	isLocalStorageAvailable: true,
	todos: [],
};

export const TTodoStoreActionTypes = {
	SET_LOCAL_STORAGE_AVAILABILITY: "SET_LOCAL_STORAGE_AVAILABILITY",
	ADD_TODO: "ADD_TODO",
	UPDATE_TODO_TEXT_CONTENT: "UPDATE_TODO_TEXT_CONTENT",
	UPDATE_TODO_COMPLETION_STATUS: "UPDATE_TODO_COMPLETION_STATUS",
	DELETE_TODO: "DELETE_TODO",
	LOAD_USER_DATA_FROM_LOCAL_STORAGE: "LOAD_USER_DATA_FROM_LOCAL_STORAGE",
	COMPLETE_ALL_TODOS: "COMPLETE_ALL_TODOS",
	CLEAR_COMPLETED_TODOS: "CLEAR_COMPLETED_TODOS",
} as const;

export type TTodoStoreAction =
	| {
			type: typeof TTodoStoreActionTypes.SET_LOCAL_STORAGE_AVAILABILITY;
			payload: { isLocalStorageAvailable: boolean };
	  }
	| { type: typeof TTodoStoreActionTypes.ADD_TODO; payload: TNewTodo }
	| {
			type: typeof TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT;
			payload: {
				updateTodoWithId: number;
				newText: string;
			};
	  }
	| {
			type: typeof TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS;
			payload: {
				updateTodoWithId: number;
				newCompletionStatus: boolean;
			};
	  }
	| {
			type: typeof TTodoStoreActionTypes.DELETE_TODO;
			payload: { deleteTodoWithId: number };
	  }
	| {
			type: typeof TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE;
			payload: TTodo[];
	  }
	| { type: typeof TTodoStoreActionTypes.COMPLETE_ALL_TODOS }
	| { type: typeof TTodoStoreActionTypes.CLEAR_COMPLETED_TODOS };

export function todoStoreReducer(
	state: TTodoStoreState,
	action: TTodoStoreAction
): TTodoStoreState {
	const functionSignature = "todoStore.ts@todoStoreReducer()";

	switch (action.type) {
		case TTodoStoreActionTypes.SET_LOCAL_STORAGE_AVAILABILITY: {
			return {
				...state,
				isLocalStorageAvailable: action.payload.isLocalStorageAvailable,
			};
		}
		case TTodoStoreActionTypes.ADD_TODO: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const newTodo: TTodo = {
				id: state.todoIdIterator,
				text: action.payload.text,
				isCompleted: false,
				createdAt: nowIsoString,
				lastUpdatedAt: null,
				completedAt: null,
			};

			const newState = {
				...state,
				todos: [...state.todos, newTodo],
				todoIdIterator: state.todoIdIterator + 1,
			};

			updateLocalStorage(newState, action, newTodo.id);

			return newState;
		}

		case TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const updatedTodoObj = state.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);

			if (!updatedTodoObj) {
				console.error(
					functionSignature,
					action.payload,
					`Could not find todo with id ${action.payload.updateTodoWithId} to update text content`
				);
				return state;
			}

			updatedTodoObj.text = action.payload.newText;
			updatedTodoObj.lastUpdatedAt = nowIsoString;

			const newState = {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === updatedTodoObj.id ? updatedTodoObj : todo
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const updatedTodoObj = state.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);

			if (!updatedTodoObj) {
				console.error(
					functionSignature,
					action.payload,
					`Could not find todo with id ${action.payload.updateTodoWithId} to update completion status`
				);
				return state;
			}

			updatedTodoObj.isCompleted = action.payload.newCompletionStatus;
			updatedTodoObj.completedAt = action.payload.newCompletionStatus
				? nowIsoString
				: null;

			const newState = {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === updatedTodoObj.id ? updatedTodoObj : todo
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.DELETE_TODO: {
			const newState = {
				...state,
				todos: state.todos.filter(
					(todo) => todo.id !== action.payload.deleteTodoWithId
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE: {
			let highestId = 0;
			action.payload.forEach((todo) => {
				if (todo.id > highestId) highestId = todo.id;
			});

			return {
				...state,
				todos: [...action.payload],
				todoIdIterator: highestId + 1,
			};
		}
		case TTodoStoreActionTypes.COMPLETE_ALL_TODOS: {
			const nowIsoString = new Date().toISOString();

			const todosToUpdate: number[] = [];

			const newTodos = state.todos.map((todo) => {
				if (!todo.isCompleted) {
					todosToUpdate.push(todo.id);
					return {
						...todo,
						isCompleted: true,
						completedAt: nowIsoString,
					};
				} else {
					return todo;
				}
			});

			const newState = {
				...state,
				todos: newTodos,
			};

			updateLocalStorage(newState, action, undefined, todosToUpdate);

			return newState;
		}
		case TTodoStoreActionTypes.CLEAR_COMPLETED_TODOS: {
			const todosToClear: number[] = [];
			state.todos.forEach((todo) => {
				if (todo.isCompleted) {
					todosToClear.push(todo.id);
				}
			});

			const newState = {
				...state,
				todos: state.todos.filter((todo) => !todo.isCompleted),
			};

			updateLocalStorage(
				newState,
				action,
				undefined,
				undefined,
				todosToClear
			);

			return newState;
		}
		default: {
			console.error(
				functionSignature,
				// @ts-expect-error TS2339 - Property 'type' does not exist on type 'never'.
				`Unknown action type: ${action.type}`
			);
			return state;
		}
	}
}

function updateLocalStorage(
	updatedAppState: TTodoStoreState,
	action: TTodoStoreAction,
	newTodoId?: number,
	todosToUpdate?: number[],
	todosToClear?: number[]
) {
	const functionSignature = "todoStore.ts@updateLocalStorage()";

	if (!updatedAppState.isLocalStorageAvailable) {
		console.info(
			functionSignature,
			"localStorage is not available, returning early..."
		);
		return;
	}

	switch (action.type) {
		case TTodoStoreActionTypes.ADD_TODO: {
			if (newTodoId === undefined) {
				console.error(functionSignature, "newTodoId is undefined");
				return;
			}

			const newTodo = updatedAppState.todos.find(
				(todo) => todo.id === newTodoId
			);
			if (!newTodo) {
				console.error(
					functionSignature,
					action.type,
					`Could not find new todo with id ${newTodoId} in state`
				);
				return;
			}

			const localStorageKey = `${TODO_KEY_PREFIX}${newTodoId}`;

			if (localStorage.getItem(localStorageKey) !== null) {
				console.error(
					functionSignature,
					action.type,
					`localStorage already has an item with key ${localStorageKey}. Overwriting...`,
					localStorage.getItem(localStorageKey)
				);
			}

			setTimeout(() => {
				localStorage.setItem(localStorageKey, JSON.stringify(newTodo));
			}, 100);

			break;
		}
		case TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT:
		case TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS: {
			const updatedTodo = updatedAppState.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);
			if (!updatedTodo) {
				console.error(
					functionSignature,
					action.type,
					`Could not find updated todo with id ${action.payload.updateTodoWithId} in state`
				);
				return;
			}

			const localStorageKey = `${TODO_KEY_PREFIX}${updatedTodo.id}`;

			if (localStorage.getItem(localStorageKey) === null) {
				console.error(
					functionSignature,
					action.type,
					`localStorage has no item with key ${localStorageKey}. Creating...`
				);
			}

			setTimeout(() => {
				localStorage.setItem(
					localStorageKey,
					JSON.stringify(updatedTodo)
				);
			}, 100);
			break;
		}
		case TTodoStoreActionTypes.DELETE_TODO: {
			localStorage.removeItem(
				`${TODO_KEY_PREFIX}${action.payload.deleteTodoWithId}`
			);
			break;
		}
		case TTodoStoreActionTypes.COMPLETE_ALL_TODOS: {
			if (todosToUpdate === undefined) {
				console.error(functionSignature, "todosToUpdate is undefined");
				return;
			}

			todosToUpdate.forEach((todoId) => {
				const localStorageKey = `${TODO_KEY_PREFIX}${todoId}`;
				if (localStorage.getItem(localStorageKey) === null) {
					console.error(
						functionSignature,
						action.type,
						`localStorage has no item with key ${localStorageKey}. Creating...`
					);
				}

				setTimeout(() => {
					localStorage.setItem(
						localStorageKey,
						JSON.stringify(
							updatedAppState.todos.find(
								(todo) => todo.id === todoId
							)
						)
					);
				}, 100);
			});
			break;
		}
		case TTodoStoreActionTypes.CLEAR_COMPLETED_TODOS: {
			if (todosToClear === undefined) {
				console.error(functionSignature, "todosToClear is undefined");
				return;
			}

			todosToClear.forEach((todoId) => {
				const localStorageKey = `${TODO_KEY_PREFIX}${todoId}`;
				localStorage.removeItem(localStorageKey);
			});
			break;
		}
		default:
			console.error(
				functionSignature,
				`Unknown action type ${action.type}`
			);
			break;
	}
}

export function getAllTodoObjectsFromLocalStorage(): null | {
	validTodos: TTodo[];
	invalidTodoKeys: string[];
} {
	const functionSignature =
		"todoStore.ts@getAllTodoObjectsFromLocalStorage()";

	const keysInLocalStorage = Object.keys(localStorage);

	if (keysInLocalStorage.length === 0) {
		console.info(
			functionSignature,
			"No keys found in localStorage. Returning null."
		);
		return null;
	}

	const todos: TTodo[] = [];
	const invalidTodoKeys: string[] = [];

	keysInLocalStorage.forEach((key) => {
		if (key.startsWith(TODO_KEY_PREFIX)) {
			const lsItem = localStorage.getItem(key);
			if (typeof lsItem !== "string" || lsItem === null) {
				console.error(
					functionSignature,
					`lsItem is not a string or is null. Skipping...`,
					lsItem
				);

				invalidTodoKeys.push(key);

				return;
			}

			let newTodo: TTodo | null = null;
			try {
				const parsedTodo = JSON.parse(lsItem);

				if (!(parsedTodo instanceof Object) || parsedTodo === null) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} is not an object. Skipping...`,
						parsedTodo
					);

					invalidTodoKeys.push(key);

					return;
				}

				// Check for required properties
				if (
					!("id" in parsedTodo) ||
					!("text" in parsedTodo) ||
					!("isCompleted" in parsedTodo) ||
					!("createdAt" in parsedTodo) ||
					!("lastUpdatedAt" in parsedTodo) ||
					!("completedAt" in parsedTodo)
				) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} is missing one or more required properties. Skipping...`,
						parsedTodo
					);

					invalidTodoKeys.push(key);

					return;
				}

				// Type checks
				if (
					typeof parsedTodo.id !== "number" ||
					typeof parsedTodo.text !== "string" ||
					typeof parsedTodo.isCompleted !== "boolean" ||
					(typeof parsedTodo.createdAt !== "string" &&
						parsedTodo.createdAt !== null) ||
					(typeof parsedTodo.lastUpdatedAt !== "string" &&
						parsedTodo.lastUpdatedAt !== null) ||
					(typeof parsedTodo.completedAt !== "string" &&
						parsedTodo.completedAt !== null)
				) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} does not have the correct types. Skipping...`,
						parsedTodo
					);

					invalidTodoKeys.push(key);

					return;
				}

				newTodo = parsedTodo;
			} catch (errorObj) {
				console.error(
					functionSignature,
					`Could not parse JSON from localStorage for key ${key}:`,
					errorObj
				);
				return;
			}

			if (newTodo === null) {
				console.error(
					functionSignature,
					"newTodo is null. Skipping..."
				);
				return;
			}

			todos.push(newTodo);
		}
	});

	if (todos.length === 0) {
		return null;
	} else {
		const todosSortedById = [...todos].sort((a, b) => b.id - a.id);
		return { validTodos: todosSortedById, invalidTodoKeys };
	}
}

export function deleteTodosFromLocalStorage(keys: string[]) {
	keys.forEach((key) => {
		localStorage.removeItem(key);
	});
}