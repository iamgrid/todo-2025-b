"use client";
import { useId, useState } from "react";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "../../lib/helpers";
import { useDoesUserHaveAProperMouse } from "../../lib/useDoesUserHaveAProperMouse";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Kbd, KbdGroup } from "../ui/kbd";

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

	function submitNewTodoAction(formData: FormData) {
		const functionSignature = "App.tsx@submitNewTodoAction()";

		console.log(
			functionSignature,
			"Form data received:",
			Array.from(formData.entries()),
		);

		if (!formData.has(newTodoInputFieldId)) {
			console.error(
				functionSignature,
				`Form data does not have expected field with ID '${newTodoInputFieldId}'!`,
				Array.from(formData.entries()),
			);
			return;
		}

		if (!todoInputIsValid) {
			console.warn(
				functionSignature,
				"Todo input is not valid, returning early...",
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

		const formElement = document.getElementById(
			formId,
		) as HTMLFormElement | null;
		if (formElement === null) {
			console.error(functionSignature, "Could not find form element in DOM!");
			return;
		}

		formElement.reset();

		setTodoInputIsValid(true);
		setTodoInputValueIsOverMaxLengthBy(0);
		focusNewTodoInputField();
	}

	function renderKeyboardShortcutInfo() {
		return (
			<span>
				Hit{" "}
				<KbdGroup>
					<Kbd>Ctrl</Kbd>
					<span>+</span>
					<Kbd>Enter</Kbd>
				</KbdGroup>{" "}
				to focus this field.
			</span>
		);
	}

	return (
		<form
			id={formId}
			className="new-todo-form mb-3 px-2"
			action={submitNewTodoAction}
			noValidate
		>
			<div className="grid w-full grid-cols-[1fr_auto] items-center gap-3">
				<Textarea
					id={newTodoInputFieldId}
					name={newTodoInputFieldId}
					className="resize-none pb-1.5 text-zinc-900 dark:text-zinc-300"
					placeholder="What needs to be done?"
					autoFocus
					onChange={(event) => handleTodoInputChange(event.target.value)}
					rows={1}
					style={{ minHeight: "unset", maxHeight: "5.4em" }}
					aria-invalid={!todoInputIsValid}
					onKeyDown={(event) => {
						const functionSignature = "AddTodoForm.tsx@onKeyDown()";
						if (event.key === "Enter") {
							event.preventDefault();
							const formElement = document.getElementById(
								formId,
							) as HTMLFormElement | null;
							if (formElement === null) {
								console.error(
									functionSignature,
									"Could not find form element in DOM!",
								);
								return;
							}
							const formData = new FormData(formElement);
							submitNewTodoAction(formData);
						} else if (event.key === "Escape") {
							event.preventDefault();
							const newTodoInputField = document.getElementById(
								newTodoInputFieldId,
							) as HTMLInputElement | null;
							if (newTodoInputField !== null) {
								newTodoInputField.value = "";
								setTodoInputIsValid(true);
								setTodoInputValueIsOverMaxLengthBy(0);
								focusNewTodoInputField();
							}
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
				<Button
					type="submit"
					className=""
					size={"lg"}
					disabled={!todoInputIsValid}
				>
					<IconPlus /> Add
				</Button>
			</div>
			<div
				className={`mt-1.5 pl-1.25 text-sm ${!todoInputIsValid ? "text-red-500 dark:text-red-400/80" : "text-zinc-500 dark:text-zinc-400"}`}
			>
				{!todoInputIsValid
					? `${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by ${todoInputValueIsOverMaxLengthBy} characters.)`
					: doesUserHaveAProperMouse
						? renderKeyboardShortcutInfo()
						: null}
			</div>
		</form>
	);
}

export default AddTodoForm;
