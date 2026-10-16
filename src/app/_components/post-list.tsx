import type { RouterOutputs } from "~/server/api/root";
import styles from "../index.module.scss";

export function PostList({ posts }: { posts: RouterOutputs["post"]["list"] }) {
	if (posts.length === 0) {
		return <p className={styles.showcaseText}>No posts yet.</p>;
	}

	return (
		<ul aria-label="Posts" className={styles.form}>
			{posts.map((post) => {
				const characters = Array.from(post.body);
				return (
					<li className={styles.card} key={post.id}>
						<h2 className={styles.cardTitle}>{post.name}</h2>
						<p className={styles.cardText}>
							{characters.slice(0, 150).join("")}
							{characters.length > 150 ? "…" : ""}
						</p>
						<p>
							Updated{" "}
							<time dateTime={post.updatedAt.toISOString()}>
								{post.updatedAt.toLocaleDateString()}
							</time>
						</p>
					</li>
				);
			})}
		</ul>
	);
}
