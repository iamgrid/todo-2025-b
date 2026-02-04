import { friendlyDate } from "../../lib/helpers";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface TFriendlyDateProps {
	input: string | Date;
	triggerRerender: number;
}

export default function FriendlyDate({
	input,
	// x@ts-expect-error unused but needed to trigger rerender
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	triggerRerender,
}: TFriendlyDateProps): React.ReactNode {
	const inputDateObj = input instanceof Date ? input : new Date(input);

	// console.log("FriendlyDate render with triggerRerender:", triggerRerender);

	if (isNaN(inputDateObj.getTime())) {
		return "[invalid date]";
	} else {
		const tooltipString = inputDateObj.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		return (
			<Tooltip>
				<TooltipTrigger tabIndex={-1}>
					<span>{friendlyDate(input)}</span>
				</TooltipTrigger>
				<TooltipContent side="top">
					<p>{tooltipString}</p>
				</TooltipContent>
			</Tooltip>
		);
	}
}
