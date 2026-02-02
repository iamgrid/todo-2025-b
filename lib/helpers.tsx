export const TODO_KEY_PREFIX = "todo-2025-b--todo_";
export const MAX_TODO_TITLE_LENGTH = 500;
export const TODO_TITLE_LENGTH_ERROR_MESSAGE = `A todo title should be at least 1, and at most ${MAX_TODO_TITLE_LENGTH} characters long.`;
export const FRIENDLY_DATE_RERENDER_INTERVAL_MS = 30_000; // 30 seconds

export const SORTING_OPTIONS = {
	default: "default",
	"date-created-desc": "date-created-desc",
	"date-created-asc": "date-created-asc",
	"title-asc": "title-asc",
} as const;

export type TSortingOption = keyof typeof SORTING_OPTIONS;

export const FILTERING_OPTIONS = {
	all: "all",
	incomplete: "incomplete",
	completed: "completed",
} as const;

export type TFilteringOption = keyof typeof FILTERING_OPTIONS;

export const shortMonthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function shortDateFormat(date: Date): string {
	const yearStr = `, ${date.getFullYear()}`;
	const nowDateObj = new Date();
	const addYearStr: boolean = date.getFullYear() !== nowDateObj.getFullYear();
	return `${shortMonthNames[date.getMonth()]} ${date.getDate()}${
		addYearStr ? yearStr : ""
	}`;
}

/**
 * Converts an ISO 8601 date string (created with .toISOString()) or a Date object into a more human-friendly format.
 * @param input ISO 8601 date string or Date object
 */

export function friendlyDate(input: string | Date): string {
	const inputDateObj = input instanceof Date ? input : new Date(input);

	if (isNaN(inputDateObj.getTime())) {
		return "[invalid date]";
	}

	let reply = "";

	const ts = inputDateObj.getTime() / 1000;
	const nowObj = new Date();
	const nowTs = Date.now() / 1000;
	const zerohourToday =
		Date.parse(
			`${nowObj.getFullYear()}-${
				nowObj.getMonth() + 1
			}-${nowObj.getDate()} 00:00:00`
		) / 1000; // timestamp for 00:00:00 of today

	let strDate = `${shortDateFormat(inputDateObj)}`;
	if (inputDateObj.getFullYear() !== nowObj.getFullYear()) {
		strDate = `${strDate}, ${inputDateObj.getFullYear()}`;
	}

	const diff = Math.round(nowTs - ts);
	const diffInDays = Math.ceil(Math.abs(zerohourToday - ts) / (24 * 60 * 60));
	const maxDayDifferenceToShow = 99;

	if (diff < 0 && diff < -48 * 60 * 60) {
		reply = strDate;
		if (diffInDays <= maxDayDifferenceToShow + 1) {
			reply = strDate + " (" + (diffInDays - 1) + " days from now)";
		}
	} else if (diff < 0 && diff >= -48 * 60 * 60 && diff <= -2 * 60 * 60) {
		reply =
			Math.floor(Math.abs(diff) / (60 * 60)) +
			" hours from now (" +
			strDate +
			")";
	} else if (diff < 0 && diff > -2 * 60 * 60 && diff <= -60 * 60) {
		reply = "1 hour from now";
	} else if (diff < 0 && diff > -60 * 60 && diff <= -120) {
		reply = Math.floor(Math.abs(diff) / 60) + " minutes from now";
	} else if (diff < 0 && diff > -120 && diff <= -60) {
		reply = "1 minute from now";
	} else if (diff < 0 && diff > -60 && diff <= -10) {
		reply = Math.abs(diff) + " seconds from now";
	} else if (diff < 0 && diff > -10) {
		reply = "a few seconds from now";
	} else if (diff < 10) {
		reply = "a few seconds ago";
	} else if (diff < 60) {
		reply = diff + " seconds ago";
	} else if (diff < 120) {
		reply = "1 minute ago";
	} else if (diff < 60 * 60) {
		reply = Math.floor(diff / 60) + " minutes ago";
	} else if (diff < 2 * 60 * 60) {
		reply = "1 hour ago";
	} else if (diff <= 24 * 60 * 60) {
		reply = Math.floor(diff / (60 * 60)) + " hours ago (" + strDate + ")";
	} else if (
		diff > 24 * 60 * 60 &&
		ts < zerohourToday &&
		ts >= zerohourToday - 24 * 60 * 60
	) {
		reply = "yesterday (" + strDate + ")";
	} else {
		reply = strDate;
		if (diffInDays <= maxDayDifferenceToShow) {
			reply = strDate + " (" + diffInDays + " days ago)";
		}
	}

	return reply;
}

export function shortenPhrase(
	input: string | false | null | undefined,
	maxLength: number,
	addDots: boolean = true,
	cutWords: boolean = false
): string {
	if (typeof input === "undefined" || input === false || input === null) {
		return "-";
	}
	if (input.length < maxLength) return input;

	let rawShortStr1 = input.substring(0, maxLength);
	if (addDots) {
		rawShortStr1 = input.substring(0, maxLength - 4);
	}

	if (cutWords) return `${rawShortStr1}${addDots ? "..." : ""}`;

	let rawShortStr2 = rawShortStr1.substring(0, rawShortStr1.lastIndexOf(" "));
	if (rawShortStr2.length === 0) {
		rawShortStr2 = input.substring(0, maxLength);
	}

	if (addDots) {
		return `${rawShortStr2} ...`;
	} else {
		return rawShortStr2;
	}
}
