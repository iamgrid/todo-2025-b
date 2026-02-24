import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TTodo } from "@/app/useTodoStore";
import TodoListItem from "./TodoListItem";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "@/lib/helpers";

const mockTodo1: TTodo = {
	id: 1,
	text: "Test Todo",
	isCompleted: false,
	createdAt: new Date().toISOString(),
	lastUpdatedAt: null,
	completedAt: null,
};

const mockTodo2: TTodo = {
	id: 2,
	text: "Completed Todo",
	isCompleted: true,
	createdAt: new Date().toISOString(),
	lastUpdatedAt: null,
	completedAt: new Date().toISOString(),
};

describe("TodoListItem component", () => {
	test("renders correctly", () => {
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={false}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);
		expect(screen.getByText(/test todo/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle todo completion: test todo/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /edit todo: test todo/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /delete todo: test todo/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/created/i)).toBeInTheDocument();
	});

	test("renders completed todo as completed", () => {
		render(
			<TodoListItem
				todo={mockTodo2}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={false}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);
		expect(screen.getByText(/completed todo/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle todo completion: completed todo/i),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle todo completion: completed todo/i),
		).toBeChecked();
		expect(
			screen.getByRole("button", { name: /edit todo: completed todo/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /delete todo: completed todo/i }),
		).toBeInTheDocument();
		const noteElement = screen.getByRole("note");
		expect(noteElement).toBeInTheDocument();
		expect(noteElement).toHaveTextContent(/completed/i);
	});

	test("calls handleToggleTodoCompletion when checkbox is clicked", async () => {
		const mockHandleToggleTodoCompletion = jest.fn();
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={mockHandleToggleTodoCompletion}
				isTodoBeingEdited={false}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const checkbox = screen.getByLabelText(
			/toggle todo completion: test todo/i,
		);
		await userEvent.click(checkbox);
		expect(mockHandleToggleTodoCompletion).toHaveBeenCalledWith(
			mockTodo1.id,
			true,
		);
	});

	test("calls handleEditTodo when edit button is clicked", async () => {
		const mockHandleEditTodo = jest.fn();
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={false}
				handleEditTodo={mockHandleEditTodo}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const editButton = screen.getByRole("button", {
			name: /edit todo: test todo/i,
		});
		await userEvent.click(editButton);
		expect(mockHandleEditTodo).toHaveBeenCalledWith(mockTodo1.id);
	});

	test("shows edit form when isTodoBeingEdited is true", () => {
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={true}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);
		expect(screen.getByRole("form")).toBeInTheDocument();
		expect(screen.getByLabelText(/edit todo text/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
	});

	test("calls handleUpdateTodoTextProper with new text when edit form is submitted", async () => {
		const mockHandleUpdateTodoTextProper = jest.fn();
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={true}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={mockHandleUpdateTodoTextProper}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const inputField = screen.getByLabelText(/edit todo text/i);
		const saveButton = screen.getByRole("button", { name: /save/i });
		await userEvent.clear(inputField);
		await userEvent.type(inputField, "Updated Todo Text");
		await userEvent.click(saveButton);
		expect(mockHandleUpdateTodoTextProper).toHaveBeenCalledWith(
			mockTodo1.id,
			"Updated Todo Text",
		);
	});

	test("disables save button when input is empty", async () => {
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={true}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const inputField = screen.getByLabelText(/edit todo text/i);
		const saveButton = screen.getByRole("button", { name: /save/i });
		await userEvent.clear(inputField);
		expect(saveButton).toBeDisabled();
	});

	test("disables save button when input is over max length", async () => {
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={true}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const inputField = screen.getByLabelText(/edit todo text/i);
		const saveButton = screen.getByRole("button", { name: /save/i });
		await userEvent.clear(inputField);
		await userEvent.type(inputField, "a".repeat(MAX_TODO_TITLE_LENGTH + 5));
		expect(saveButton).toBeDisabled();
		expect(
			screen.getByText(
				`${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by 5 characters.)`,
			),
		).toBeInTheDocument();
	});

	test("calls handleCancelEditingTodo when cancel button is clicked", async () => {
		const mockHandleCancelEditingTodo = jest.fn();
		render(
			<TodoListItem
				todo={mockTodo1}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={true}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={mockHandleCancelEditingTodo}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={() => {}}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const cancelButton = screen.getByRole("button", { name: /cancel/i });
		await userEvent.click(cancelButton);
		expect(mockHandleCancelEditingTodo).toHaveBeenCalled();
	});

	test("calls handleDeleteTodoProper when delete button is clicked", async () => {
		const mockHandleDeleteTodoProper = jest.fn();
		render(
			<TodoListItem
				todo={mockTodo2}
				handleToggleTodoCompletion={() => {}}
				isTodoBeingEdited={false}
				handleEditTodo={() => {}}
				handleCancelEditingTodo={() => {}}
				handleUpdateTodoTextProper={() => {}}
				handleDeleteTodoProper={mockHandleDeleteTodoProper}
				triggerFriendlyDateRerender={0}
			/>,
		);

		const deleteButton = screen.getByRole("button", {
			name: /delete todo: completed todo/i,
		});
		await userEvent.click(deleteButton);
		expect(mockHandleDeleteTodoProper).toHaveBeenCalledWith(mockTodo2.id);
	});
});
