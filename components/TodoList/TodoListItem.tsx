import { TTodo } from "@/app/useTodoStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useId, useState } from "react";
import FriendlyDate from "../shared/FriendlyDate";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
	MAX_TODO_TITLE_LENGTH,
	shortenPhrase,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "@/lib/helpers";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "../ui/textarea";

export interface TTodoListItemProps {
	todo: TTodo;
	listItemIndex: number;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	isTodoBeingEdited: boolean;
	handleEditTodo(todoId: number): void;
	handleCancelEditingTodo(): void;
	handleUpdateTodoTextProper(todoId: number, newText: string): void;
	handleDeleteTodoProper(todoId: number): void;
	triggerFriendlyDateRerender: number;
}

function TodoListItem({
	todo,
	listItemIndex,
	handleToggleTodoCompletion,
	isTodoBeingEdited,
	handleEditTodo,
	handleCancelEditingTodo,
	handleUpdateTodoTextProper,
	handleDeleteTodoProper,
	triggerFriendlyDateRerender,
}: TTodoListItemProps) {
	const checkboxId = useId();
	const editTodoFormId = useId();
	const editTodoInputFieldId = useId();

	const [editTodoInputIsValid, setEditTodoInputIsValid] =
		useState<boolean>(true);
	const [
		editTodoInputValueIsOverMaxLengthBy,
		setEditTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);

	function onEditButtonClick() {
		const functionSignature = "TodoListItem.tsx@onEditButtonClick()";
		console.log(
			functionSignature,
			`Edit button clicked for todo ID ${todo.id}`,
		);
		handleEditTodo(todo.id);
	}

	function onDeleteButtonClick() {
		handleDeleteTodoProper(todo.id);
	}

	function editTodoFormAction(formData: FormData) {
		const functionSignature = "TodoListItem.tsx@editTodoFormAction()";
		console.log(functionSignature, Array.from(formData.entries()));
		if (!formData.has(editTodoInputFieldId)) {
			console.error(
				functionSignature,
				`Form data does not have expected field with ID '${editTodoInputFieldId}'!`,
				Array.from(formData.entries()),
			);
			return;
		}

		if (!editTodoInputIsValid) {
			console.warn(
				functionSignature,
				"Edited todo input is not valid, returning early...",
			);
			return;
		}

		const newTodoText = (formData.get(editTodoInputFieldId) as string).trim();

		if (newTodoText.length === 0) {
			console.warn(
				functionSignature,
				"Edited todo text is empty, returning early...",
			);
			return;
		}

		handleUpdateTodoTextProper(todo.id, newTodoText);
	}

	function renderSecondaryText() {
		const parts: React.ReactNode[] = [];

		if (todo.completedAt !== null) {
			parts.push(
				<>
					Completed{" "}
					<FriendlyDate
						input={todo.completedAt}
						triggerRerender={triggerFriendlyDateRerender}
					/>
				</>,
			);
		}

		if (todo.lastUpdatedAt !== null) {
			parts.push(
				<>
					Last updated{" "}
					<FriendlyDate
						input={todo.lastUpdatedAt}
						triggerRerender={triggerFriendlyDateRerender}
					/>
				</>,
			);
		}

		parts.push(
			<>
				Created{" "}
				<FriendlyDate
					input={todo.createdAt}
					triggerRerender={triggerFriendlyDateRerender}
				/>
			</>,
		);

		return (
			<span>
				{parts.map((part, index) => (
					// xeslint-disable-next-line react-x/no-array-index-key
					<span key={index}>
						{index > 0 ? " · " : ""}
						{part}
					</span>
				))}
			</span>
		);
	}

	if (!isTodoBeingEdited) {
		return (
			<div
				className={`todo-list-item ${todo.isCompleted ? "todo-list-item--completed" : ""} grid cursor-pointer grid-cols-[auto_1fr_auto] items-center space-x-2 border-t p-2 first:mt-0 first:border-t-0 hover:bg-zinc-100 dark:hover:bg-zinc-700/20`}
				onClick={(event) => {
					event.preventDefault();
					handleToggleTodoCompletion(todo.id, !todo.isCompleted);
				}}
			>
				<Checkbox
					id={checkboxId}
					name={checkboxId}
					checked={todo.isCompleted}
					// tabIndex={listItemIndex}
				/>
				<div className="flex flex-col pl-1">
					<label
						htmlFor={checkboxId}
						className={`cursor-pointer font-bold select-none ${
							todo.isCompleted
								? "text-zinc-500 line-through opacity-50 dark:text-zinc-400"
								: "text-zinc-900 dark:text-zinc-300"
						}`}
					>
						{todo.text}
					</label>
					<div
						className={`text-sm text-zinc-500 dark:text-zinc-500 ${todo.isCompleted ? "opacity-50" : ""}`}
					>
						{renderSecondaryText()}
					</div>
				</div>
				<ButtonGroup onClick={(event) => event.stopPropagation()}>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									className=""
									variant={"outline"}
									onClick={onEditButtonClick}
									aria-label={`Edit todo: ${shortenPhrase(todo.text, 20, true, true)}`}
								>
									<IconEdit size={16} />
								</Button>
							}
						></TooltipTrigger>
						<TooltipContent side="top">
							<p>Edit</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									className=""
									variant={"outline"}
									onClick={onDeleteButtonClick}
									aria-label={`Delete todo: ${shortenPhrase(todo.text, 20, true, true)}`}
								>
									<IconTrash size={16} />
								</Button>
							}
						></TooltipTrigger>
						<TooltipContent side="top">
							<p>Delete</p>
						</TooltipContent>
					</Tooltip>
				</ButtonGroup>
			</div>
		);
	} else {
		return (
			<form
				noValidate
				id={editTodoFormId}
				action={editTodoFormAction}
				className="grid grid-rows-[auto_auto] items-center gap-3 border-t px-2 pt-4 pb-1.5 first:border-t-0 md:grid-cols-[1fr_auto]"
			>
				<div>
					<Textarea
						defaultValue={todo.text}
						id={editTodoInputFieldId}
						name={editTodoInputFieldId}
						onChange={(event) => {
							const val = event.target.value.trim();
							if (val.length === 0 || val.length > MAX_TODO_TITLE_LENGTH) {
								setEditTodoInputIsValid(false);
								if (val.length > MAX_TODO_TITLE_LENGTH) {
									setEditTodoInputValueIsOverMaxLengthBy(
										val.length - MAX_TODO_TITLE_LENGTH,
									);
								} else {
									setEditTodoInputValueIsOverMaxLengthBy(0);
								}
							} else {
								setEditTodoInputIsValid(true);
								setEditTodoInputValueIsOverMaxLengthBy(0);
							}
						}}
						onKeyDown={(event) => {
							const functionSignature = "TodoListItem.tsx@onKeyDown()";
							if (event.key === "Enter") {
								event.preventDefault();
								const formElement = document.getElementById(
									editTodoFormId,
								) as HTMLFormElement | null;
								if (formElement === null) {
									console.error(
										functionSignature,
										"Could not find form element in DOM!",
									);
									return;
								}
								const formData = new FormData(formElement);
								editTodoFormAction(formData);
							} else if (event.key === "Escape") {
								event.preventDefault();
								handleCancelEditingTodo();
							}
						}}
						className="resize-none text-zinc-900 dark:text-zinc-300"
						rows={1}
						style={{ minHeight: "unset", maxHeight: "5.4em" }}
						aria-invalid={!editTodoInputIsValid}
						autoFocus
					/>
					{!editTodoInputIsValid ? (
						<div className="mt-1 pl-1.25 text-sm text-red-500 dark:text-red-400/80">
							{TODO_TITLE_LENGTH_ERROR_MESSAGE}{" "}
							{editTodoInputValueIsOverMaxLengthBy > 0
								? `(You are over by ${editTodoInputValueIsOverMaxLengthBy} characters.)`
								: null}
						</div>
					) : null}
				</div>
				<div>
					<Button type="submit" disabled={!editTodoInputIsValid} size={"lg"}>
						Save
					</Button>
					<Button
						variant={"outline"}
						onClick={(event) => {
							event.preventDefault();
							handleCancelEditingTodo();
						}}
						size={"lg"}
					>
						Cancel
					</Button>
				</div>
			</form>
		);
	}
}

export default TodoListItem;
