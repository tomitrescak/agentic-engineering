import { afterAll, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/env", () => ({
	env: {
		get DATABASE_URL() {
			return `file:${path}`;
		},
	},
}));

import { getDatabase } from "~/server/db";
import {
	createDatabase,
	disposeDatabase,
	seedDatabase,
} from "../../../../tests/e2e/database";
import { postRouter } from "./post";

const path = createDatabase();
const database = await getDatabase();
const caller = postRouter.createCaller({
	...database,
	session: null,
	user: undefined,
	headers: new Headers(),
});
afterAll(async () => {
	await database.runtime.close();
	disposeDatabase(path);
});

test("an empty database produces an empty list, not a missing value", async () => {
	seedDatabase(path, []);
	expect(await caller.list()).toEqual([]);
});

test("list returns every post newest updated first, not newest created first", async () => {
	seedDatabase(path);
	const posts = await caller.list();
	expect(posts.map((post) => post.id)).toEqual([2, 1]);
	expect(posts[0]).toMatchObject({
		name: "Newest update",
		body: "b".repeat(151),
		updatedAt: new Date("2026-10-10T12:00:00Z"),
	});
});
