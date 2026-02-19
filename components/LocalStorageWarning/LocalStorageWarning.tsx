import { IconAlertTriangle } from "@tabler/icons-react";

interface TLocalStorageWarningProps {
	isLocalStorageWorking: boolean;
}

function LocalStorageWarning({
	isLocalStorageWorking,
}: TLocalStorageWarningProps) {
	if (isLocalStorageWorking) {
		return null;
	} else {
		return (
			<div className="mx-2 mb-8 rounded-md border border-red-300 bg-red-50 p-4 py-3.5 dark:border-red-400/70 dark:bg-red-500/10">
				<div className="flex items-center">
					<div className="shrink-0">
						<IconAlertTriangle
							size={32}
							className="text-red-400 dark:text-red-400/90"
						/>
					</div>
					<div className="ml-5">
						<h3 className="text-md font-bold text-red-800 dark:text-red-400">
							Local storage is not working
						</h3>
						<div className="mt-2 text-sm text-red-700 dark:text-red-400/90">
							<p>
								Your browser&apos;s local storage looks to be disabled, which
								means your todos won&apos;t be saved once you refresh or close
								this page. Please check your browser settings to ensure that
								local storage is enabled and functioning properly.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LocalStorageWarning;
