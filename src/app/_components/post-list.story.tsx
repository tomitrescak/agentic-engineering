import { PostList } from "./post-list";

export function Preview({ body = "A short body." }: { body?: string }) {
	return (
		<PostList
			posts={[
				{
					id: 1,
					name: "Example post",
					body,
					createdAt: new Date("2026-01-01T12:00:00Z"),
					updatedAt: new Date("2026-10-10T12:00:00Z"),
				},
			]}
		/>
	);
}

export function Empty() {
	return <PostList posts={[]} />;
}
