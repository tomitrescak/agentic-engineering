"use client";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";
import styles from "../index.module.scss";

export function LatestPost() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: latestPost } = useSuspenseQuery(
		trpc.post.getLatest.queryOptions(),
	);

	const [name, setName] = useState("");
	const createPost = useMutation(
		trpc.post.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.post.getLatest.queryFilter());
				setName("");
			},
		}),
	);

	return (
		<div className={styles.showcaseContainer}>
			{latestPost ? (
				<p className={styles.showcaseText}>
					Your most recent post: {latestPost.name}
				</p>
			) : (
				<p className={styles.showcaseText}>You have no posts yet.</p>
			)}

			<form
				className={styles.form}
				onSubmit={(e) => {
					e.preventDefault();
					createPost.mutate({ name });
				}}
			>
				<input
					className={styles.input}
					onChange={(e) => setName(e.target.value)}
					placeholder="Title"
					type="text"
					value={name}
				/>
				<button
					className={styles.submitButton}
					disabled={createPost.isPending}
					type="submit"
				>
					{createPost.isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}
