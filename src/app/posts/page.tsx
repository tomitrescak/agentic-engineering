import Link from "next/link";
import { PostList } from "~/app/_components/post-list";
import { getQueryClient, trpc } from "~/trpc/server";
import styles from "../index.module.scss";

export default async function PostsPage() {
	const posts = await getQueryClient().fetchQuery(
		trpc.post.list.queryOptions(),
	);

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<h1 className={styles.title}>Posts</h1>
				<Link className={styles.loginButton} href="/">
					Home
				</Link>
				<PostList posts={posts} />
			</div>
		</main>
	);
}
