import { Skeleton } from "../ui/skeleton";

function TodoListSkeleton() {
	return (
		<div className="space-y-6 px-3 py-5">
			<Skeleton className="mt-2 h-5 w-[75%] rounded-md" />
			<Skeleton className="mt-2 h-5 w-[75%] rounded-md md:hidden" />
			<Skeleton className="mt-5 h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
			<div className="flex justify-center">
				<Skeleton className="mt-3 h-5 w-[40%] rounded-md" />
			</div>
		</div>
	);
}

export default TodoListSkeleton;
