import { TTodo } from "@/app/useTodoStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";
import FriendlyDate from "../shared/FriendlyDate";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { shortenPhrase } from "@/lib/helpers";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TTodoListItemProps {
	todo: TTodo;
	listItemIndex: number;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleUpdateTodoText(todoId: number, newText: string): void;
	handleDeleteTodo(todoId: number): void;
	triggerFriendlyDateRerender: number;
}

function TodoListItem({
	todo,
	listItemIndex,
	handleToggleTodoCompletion,
	handleUpdateTodoText,
	handleDeleteTodo,
	triggerFriendlyDateRerender,
}: TTodoListItemProps) {
	const checkboxId = useId();

	function onEditButtonClick() {
		const functionSignature = "TodoListItem.tsx@onEditButtonClick()";
		console.log(
			functionSignature,
			`Edit button clicked for todo ID ${todo.id}`,
		);
	}

	function onDeleteButtonClick() {
		handleDeleteTodo(todo.id);
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
			<ButtonGroup
				// className="ml-auto opacity-0 transition-opacity group-hover/button:opacity-100"
				onClick={(event) => event.stopPropagation()}
			>
				<Tooltip>
					<TooltipTrigger
						tabIndex={-1}
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
						tabIndex={-1}
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
}

export default TodoListItem;
