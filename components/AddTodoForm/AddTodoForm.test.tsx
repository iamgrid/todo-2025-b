import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AddTodoForm from "./AddTodoForm";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "@/lib/helpers";
import userEvent from "@testing-library/user-event";

const newTodoInputFieldId = "test-new-todo-input-field-id";

describe("AddTodoForm component", () => {
	beforeAll(() => {
		// mock matchMedia since it's not implemented in jsdom
		Object.defineProperty(window, "matchMedia", {
			value: jest.fn().mockImplementation((query) => ({
				matches: query === "(pointer:fine)" ? true : false,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			})),
		});
	});

	test("renders input field and add button", () => {
		render(
			<AddTodoForm
				handleAddTodo={jest.fn()}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const inputField = screen.getByPlaceholderText(/what needs to be done\?/i);
		expect(inputField).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument(); // Add button
	});

	test("input field has correct attributes for accessibility", () => {
		render(
			<AddTodoForm
				handleAddTodo={jest.fn()}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const inputField = screen.getByPlaceholderText(/what needs to be done\?/i);
		expect(inputField).toHaveAttribute("aria-label", "New todo text");
		expect(inputField).toHaveAttribute("aria-invalid", "false");
	});

	test("shows validation message when input is over max length, does not call handleAddTodo on submit", async () => {
		const mockHandleAddTodo = jest.fn();
		render(
			<AddTodoForm
				handleAddTodo={mockHandleAddTodo}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const inputField = screen.getByPlaceholderText(/what needs to be done\?/i);
		const longText = "a".repeat(MAX_TODO_TITLE_LENGTH + 2);

		await userEvent.type(inputField, longText);
		expect(
			screen.getByText(
				`${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by 2 characters.)`,
			),
		).toBeInTheDocument();
		await userEvent.type(inputField, "{enter}");
		expect(mockHandleAddTodo).not.toHaveBeenCalled();
	});

	test("does not call handleAddTodo with empty input", async () => {
		const mockHandleAddTodo = jest.fn();
		render(
			<AddTodoForm
				handleAddTodo={mockHandleAddTodo}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const addButton = screen.getByRole("button", { name: /add/i });

		await userEvent.click(addButton);
		expect(mockHandleAddTodo).not.toHaveBeenCalled();
	});

	test("calls handleAddTodo with valid input and resets form", async () => {
		const mockHandleAddTodo = jest.fn();
		render(
			<AddTodoForm
				handleAddTodo={mockHandleAddTodo}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const inputField = screen.getByPlaceholderText(/what needs to be done\?/i);
		const addButton = screen.getByRole("button", { name: /add/i });
		const validText = " Buy groceries";

		await userEvent.type(inputField, validText);
		await userEvent.click(addButton);
		expect(mockHandleAddTodo).toHaveBeenCalledWith(validText.trim());
		expect(inputField).toHaveValue("");
	});

	test("resets input and validation state on Escape key press", async () => {
		render(
			<AddTodoForm
				handleAddTodo={jest.fn()}
				newTodoInputFieldId={newTodoInputFieldId}
			/>,
		);
		const inputField = screen.getByPlaceholderText(/what needs to be done\?/i);
		const longText = "a".repeat(MAX_TODO_TITLE_LENGTH + 5);

		await userEvent.type(inputField, longText);
		expect(
			screen.getByText(
				`${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by 5 characters.)`,
			),
		).toBeInTheDocument();

		await userEvent.type(inputField, "{escape}");
		expect(inputField).toHaveValue("");
		expect(
			screen.queryByText(
				`${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by 5 characters.)`,
			),
		).not.toBeInTheDocument();

		expect(inputField).toHaveFocus();
	});
});
