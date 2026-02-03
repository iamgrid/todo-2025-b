"use client";
import { useId, useState } from "react";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "../../lib/helpers";
import { useDoesUserHaveAProperMouse } from "../../lib/useDoesUserHaveAProperMouse";
import { Textarea } from "../ui/textarea";

interface TAddTodoFormProps {
	handleAddTodo: (text: string) => void;
	newTodoInputFieldId: string;
	focusNewTodoInputField(): void;
}

function AddTodoForm({
	handleAddTodo,
	newTodoInputFieldId,
	focusNewTodoInputField,
}: TAddTodoFormProps) {
	const formId = useId();
	const [todoInputIsValid, setTodoInputIsValid] = useState<boolean>(true);
	const [todoInputValueIsOverMaxLengthBy, setTodoInputValueIsOverMaxLengthBy] =
		useState<number>(0);
	const doesUserHaveAProperMouse = useDoesUserHaveAProperMouse();

	function handleTodoInputChange(newValue: string) {
		const trimmedValue = newValue.trim();
		if (trimmedValue.length === 0) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(0);
			return;
		} else if (trimmedValue.length > MAX_TODO_TITLE_LENGTH) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(
				trimmedValue.length - MAX_TODO_TITLE_LENGTH,
			);
			return;
		} else {
			setTodoInputIsValid(true);
			setTodoInputValueIsOverMaxLengthBy(0);
		}
	}

	function handleNewTodoFormSubmission(
		event: React.FormEvent<HTMLFormElement> | null = null,
	) {
		const functionSignature = "App.tsx@handleNewTodoFormSubmission()";

		let formElement: HTMLFormElement | null = null;

		if (event !== null) {
			event.preventDefault();
			formElement = event.currentTarget;
		} else {
			formElement = document.getElementById(formId) as HTMLFormElement | null;
		}

		if (!todoInputIsValid) {
			return;
		}

		if (formElement === null) {
			console.error(functionSignature, "Could not find form element in DOM!");
			return;
		}

		const formData = new FormData(formElement);

		// for (const [key, value] of formData.entries()) {
		// 	console.log(
		// 		functionSignature,
		// 		`Form data entry: ${key} = ${value}`
		// 	);
		// }

		if (!formData.has(newTodoInputFieldId)) {
			console.error(
				functionSignature,
				`Form data does not have expected field with ID '${newTodoInputFieldId}'!`,
				formData.entries(),
			);
			return;
		}

		const newTodoText = (formData.get(newTodoInputFieldId) as string).trim();

		if (newTodoText.length === 0) {
			console.warn(
				functionSignature,
				"New todo text is empty, returning early...",
			);
			focusNewTodoInputField();
			return;
		}

		handleAddTodo(newTodoText);

		formElement.reset();

		setTodoInputIsValid(true);
		setTodoInputValueIsOverMaxLengthBy(0);

		focusNewTodoInputField();
	}

	return (
		<form
			id={formId}
			className="new-todo-form"
			onSubmit={(event) => handleNewTodoFormSubmission(event)}
			noValidate
		>
			<Textarea
				id={newTodoInputFieldId}
				name={newTodoInputFieldId}
				placeholder="What needs to be done?"
				autoFocus
				onChange={(event) => handleTodoInputChange(event.target.value)}
				// minRows={1}
				// maxRows={4}
				aria-invalid={!todoInputIsValid}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						handleNewTodoFormSubmission();
					}
				}}
				onBlur={() => {
					const newTodoInputField = document.getElementById(
						newTodoInputFieldId,
					) as HTMLInputElement | null;
					if (newTodoInputField !== null) {
						if (newTodoInputField.value.trim().length === 0) {
							newTodoInputField.value = "";
							setTodoInputIsValid(true);
							setTodoInputValueIsOverMaxLengthBy(0);
						}
					}
				}}
			/>
		</form>
	);
}

export default AddTodoForm;
