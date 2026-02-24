import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

import TodoList from "./TodoList";
import { TTodo } from "@/app/useTodoStore";

const mockTodos: TTodo[] = [
	{
		id: 1,
		text: "B Test Todo 1",
		isCompleted: false,
		createdAt: "2024-01-01T10:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: null,
	},
	{
		id: 2,
		text: "A Test Todo 2",
		isCompleted: true,
		createdAt: "2024-01-02T10:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: "2024-01-02T14:00:00.000Z",
	},
];

describe("TodoList component", () => {
	test("renders todo items correctly", () => {
		render(
			<TodoList
				todos={mockTodos}
				noOfTodos={2}
				noOfIncompleteTodos={1}
				noOfCompletedTodos={1}
				handleToggleTodoCompletion={() => {}}
				handleUpdateTodoText={() => {}}
				handleDeleteTodo={() => {}}
				handleCompleteAllTodos={() => {}}
				handleClearCompletedTodos={() => {}}
			/>,
		);

		expect(screen.getByText(/b test todo 1/i)).toBeInTheDocument();
		expect(screen.getByText(/a test todo 2/i)).toBeInTheDocument();
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes[0]).not.toBeChecked();
		expect(checkboxes[1]).toBeChecked();
	});
});
