import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { IconMoon, IconSun, IconDeviceLaptop } from "@tabler/icons-react";

const COLOR_SCHEMES = [
	{ name: "System Preference", colorSchemeValue: "system" },
	{ name: "Light", colorSchemeValue: "light" },
	{ name: "Dark", colorSchemeValue: "dark" },
] as const;

export default function ColorSchemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		// @eslint-disable-next-line react-hooks/exhaustive-deps
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex items-center justify-end gap-2 px-2">
			<div className="text-xs text-zinc-500">Color Scheme:</div>
			<ToggleGroup
				value={[theme]}
				aria-label="Color scheme options"
				onValueChange={(groupValue) => {
					// const functionSignature = "ColorSchemeSwitch.tsx@onValueChange()";
					const newValue =
						groupValue[0] as (typeof COLOR_SCHEMES)[number]["colorSchemeValue"];
					if (newValue) {
						// console.log(functionSignature, "Group value changed:", newValue);
						setTheme(newValue);
					}
				}}
				variant="outline"
				size="sm"
			>
				{COLOR_SCHEMES.map((scheme) => (
					<ToggleGroupItem
						key={scheme.colorSchemeValue}
						value={scheme.colorSchemeValue}
						aria-label={`Toggle ${scheme.name} color scheme`}
					>
						{scheme.colorSchemeValue === "system" && <IconDeviceLaptop />}
						{scheme.colorSchemeValue === "light" && <IconSun />}
						{scheme.colorSchemeValue === "dark" && <IconMoon />}
						<span className="hidden text-xs md:inline">{scheme.name}</span>
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}
