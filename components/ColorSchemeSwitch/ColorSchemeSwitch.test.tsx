import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import ColorSchemeSwitch from "./ColorSchemeSwitch";

describe("ColorSchemeSwitch component", () => {
	test("renders color scheme options and label", () => {
		render(<ColorSchemeSwitch />);

		expect(screen.getByText(/color scheme/i)).toBeInTheDocument(); // Label
		expect(
			screen.getByLabelText(/toggle system preference color scheme/i),
		).toBeInTheDocument(); // System Preference option
		expect(
			screen.getByLabelText(/toggle light color scheme/i),
		).toBeInTheDocument(); // Light option
		expect(
			screen.getByLabelText(/toggle dark color scheme/i),
		).toBeInTheDocument(); // Dark option
	});
});
