import { TFilteringOption, FILTERING_OPTIONS } from "../../lib/helpers";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface TFilterListButtonsProps {
	noOfTodos: number;
	noOfIncompleteTodos: number;
	noOfCompletedTodos: number;
	currentFilteringOption: TFilteringOption;
	setCurrentFilteringOption: (option: TFilteringOption) => void;
}

function FilterListButtons({
	noOfTodos,
	noOfIncompleteTodos,
	noOfCompletedTodos,
	currentFilteringOption,
	setCurrentFilteringOption,
}: TFilterListButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="text-sm text-zinc-500">Filter:</div>
			<ToggleGroup
				value={[currentFilteringOption]}
				aria-label="Todo filtering options"
				onValueChange={(groupValue) => {
					const functionSignature = "FilterListButtons.tsx@onValueChange()";
					const newValue = groupValue[0] as TFilteringOption;
					if (newValue) {
						console.log(functionSignature, "Group value changed:", newValue);
						setCurrentFilteringOption(newValue);
					}
				}}
				variant="outline"

				// className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md"
			>
				<ToggleGroupItem
					value={FILTERING_OPTIONS.all}
					aria-label={`Toggle "All (${noOfTodos})"`}
				>
					All ({noOfTodos})
				</ToggleGroupItem>
				<ToggleGroupItem
					value={FILTERING_OPTIONS.incomplete}
					aria-label={`Toggle "Incomplete (${noOfIncompleteTodos})"`}
				>
					Incomplete ({noOfIncompleteTodos})
				</ToggleGroupItem>
				<ToggleGroupItem
					value={FILTERING_OPTIONS.completed}
					aria-label={`Toggle "Completed (${noOfCompletedTodos})"`}
				>
					Completed ({noOfCompletedTodos})
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export default FilterListButtons;
