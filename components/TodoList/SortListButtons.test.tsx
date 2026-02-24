import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SortListButtons from "./SortListButtons";

import { SORTING_OPTIONS } from "@/lib/helpers";

describe("SortListButtons component", () => {
	test("renders sort buttons and label", () => {
		render(
			<SortListButtons
				currentSortingOption={SORTING_OPTIONS.default}
				setCurrentSortingOption={() => {}}
			/>,
		);

		expect(screen.getByText(/sort:/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(
				/toggle "default \(incomplete first, then newest first\)"/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle "date created \(newest first\)"/i),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle "date created \(oldest first\)"/i),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/toggle "title \(a-z\)"/i),
		).toBeInTheDocument();
	});

	test("calls setCurrentSortingOption with correct value when buttons are clicked", async () => {
		const mockSetCurrentSortingOption = jest.fn();
		render(
			<SortListButtons
				currentSortingOption={SORTING_OPTIONS.default}
				setCurrentSortingOption={mockSetCurrentSortingOption}
			/>,
		);
		await userEvent.click(
			screen.getByLabelText(/toggle "date created \(newest first\)"/i),
		);
		expect(mockSetCurrentSortingOption).toHaveBeenCalledWith(
			SORTING_OPTIONS["date-created-desc"],
		);
	});
});
