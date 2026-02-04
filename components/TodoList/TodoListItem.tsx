import { TTodo } from "@/app/useTodoStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";
import FriendlyDate from "../shared/FriendlyDate";

export interface TTodoListItemProps {
	todo: TTodo;
	listItemIndex: number;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	triggerFriendlyDateRerender: number;
}

function TodoListItem({
	todo,
	listItemIndex,
	handleToggleTodoCompletion,
	triggerFriendlyDateRerender,
}: TTodoListItemProps) {
	const checkboxId = useId();

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
			className="flex items-center space-x-2 py-1 my-1 cursor-pointer todo-list-item"
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
					className={`select-none font-bold cursor-pointer ${
						todo.isCompleted
							? "line-through text-zinc-500 dark:text-zinc-400 opacity-50"
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
		</div>
	);
}

export default TodoListItem;
