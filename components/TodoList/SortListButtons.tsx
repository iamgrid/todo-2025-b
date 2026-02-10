import { TSortingOption, SORTING_OPTIONS } from "../../lib/helpers";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface TSortListButtonsProps {
	currentSortingOption: TSortingOption;
	setCurrentSortingOption: (option: TSortingOption) => void;
}

function SortListButtons({
	currentSortingOption,
	setCurrentSortingOption,
}: TSortListButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="text-sm text-zinc-500">Sort:</div>
			<ToggleGroup
				value={[currentSortingOption]}
				aria-label="Todo sorting options"
				onValueChange={(groupValue) => {
					const functionSignature = "SortListButtons.tsx@onValueChange()";
					const newValue = groupValue[0] as TSortingOption;
					if (newValue) {
						console.log(functionSignature, "Group value changed:", newValue);
						setCurrentSortingOption(newValue);
					}
				}}
				variant="outline"
			>
				<ToggleGroupItem
					value={SORTING_OPTIONS.default}
					aria-label={`Toggle "Default (Incomplete first, then newest first)"`}
					title="Incomplete first, then newest first"
				>
					Default
				</ToggleGroupItem>
				<ToggleGroupItem
					value={SORTING_OPTIONS["date-created-desc"]}
					aria-label={`Toggle "Date Created (Newest first)"`}
				>
					Newest First
				</ToggleGroupItem>
				<ToggleGroupItem
					value={SORTING_OPTIONS["date-created-asc"]}
					aria-label={`Toggle "Date Created (Oldest first)"`}
				>
					Oldest First
				</ToggleGroupItem>
				<ToggleGroupItem
					value={SORTING_OPTIONS["title-asc"]}
					aria-label={`Toggle "Title (A-Z)"`}
				>
					Title (A-Z)
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export default SortListButtons;
