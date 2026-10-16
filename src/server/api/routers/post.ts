import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const now = new Date();
			const plan = ctx.sql.Post.insert([
				{ name: input.name, createdAt: now, updatedAt: now },
			])
				.returning("id", "name", "createdAt", "updatedAt")
				.build();
			const [post] = await ctx.runtime.query(plan);
			if (!post) {
				throw new Error("Post insert did not return the created row");
			}
			return normalizePost(post);
		}),

	getLatest: publicProcedure.query(async ({ ctx }) =>
		normalizePost(
			await ctx.db.Post.select("id", "name", "createdAt", "updatedAt")
				.orderBy((post) => post.createdAt.desc())
				.first(),
		),
	),
});

const normalizePost = <
	T extends { createdAt: Date | string; updatedAt: Date | string },
>(
	post: T | null,
) =>
	post
		? {
				...post,
				createdAt:
					post.createdAt instanceof Date
						? post.createdAt
						: new Date(post.createdAt),
				updatedAt:
					post.updatedAt instanceof Date
						? post.updatedAt
						: new Date(post.updatedAt),
			}
		: null;
