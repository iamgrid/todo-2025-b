import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterListButtons from "./FilterListButtons";

import { FILTERING_OPTIONS } from "@/lib/helpers";

describe("FilterListButtons component", () => {
	test("renders filter buttons and label", () => {
		render(
			<FilterListButtons
				noOfTodos={5}
				noOfIncompleteTodos={3}
				noOfCompletedTodos={2}
				currentFilteringOption={FILTERING_OPTIONS.all}
				setCurrentFilteringOption={() => {}}
			/>,
		);

		expect(screen.getByText(/filter:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/toggle "all \(5\)"/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle "incomplete \(3\)"/i),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle "completed \(2\)"/i),
		).toBeInTheDocument();
	});

	test("calls setCurrentFilteringOption with correct value when buttons are clicked", async () => {
		const mockSetCurrentFilteringOption = jest.fn();
		render(
			<FilterListButtons
				noOfTodos={5}
				noOfIncompleteTodos={3}
				noOfCompletedTodos={2}
				currentFilteringOption={FILTERING_OPTIONS.all}
				setCurrentFilteringOption={mockSetCurrentFilteringOption}
			/>,
		);

		await userEvent.click(screen.getByLabelText(/toggle "incomplete \(3\)"/i));
		expect(mockSetCurrentFilteringOption).toHaveBeenCalledWith(
			FILTERING_OPTIONS.incomplete,
		);
	});
});
