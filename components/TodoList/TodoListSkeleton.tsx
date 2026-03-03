import { Skeleton } from "../ui/skeleton";

function TodoListSkeleton() {
	return (
		<div className="space-y-5 px-2 py-5">
			<Skeleton className="mt-2 h-5 w-[75%] rounded-md" />
			<Skeleton className="mt-2 h-5 w-[75%] rounded-md md:hidden" />
			<div className="grid grid-cols-[auto_1fr_auto] items-center space-x-2 pt-1">
				<Skeleton className="h-4 w-4 rounded-xs" />
				<div>
					<Skeleton className="h-4 w-[75%] rounded-md" />
					<Skeleton className="mt-2 h-3.5 w-[50%] rounded-md" />
				</div>
				<Skeleton className="h-8 w-19 rounded-md" />
			</div>
			<div className="grid grid-cols-[auto_1fr_auto] items-center space-x-2 pt-1">
				<Skeleton className="h-4 w-4 rounded-xs" />
				<div>
					<Skeleton className="h-4 w-[75%] rounded-md" />
					<Skeleton className="mt-2 h-3.5 w-[50%] rounded-md" />
				</div>
				<Skeleton className="h-8 w-19 rounded-md" />
			</div>
			<div className="flex justify-center pt-1 pb-1.5">
				<Skeleton className="mt-3 h-5 w-[40%] rounded-md" />
			</div>
		</div>
	);
}

export default TodoListSkeleton;
