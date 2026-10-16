import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { FullConfig } from "@playwright/test";

export function createDatabase() {
	const directory = mkdtempSync(join(tmpdir(), "posts-tests-"));
	const path = join(directory, "db.sqlite");
	try {
		execFileSync("pnpm", ["db:migrate"], {
			env: { ...process.env, DATABASE_URL: `file:${path}` },
			stdio: "pipe",
		});
	} catch (error) {
		rmSync(directory, { recursive: true });
		throw error;
	}
	return path;
}

export function disposeDatabase(path: string) {
	if (
		basename(path) !== "db.sqlite" ||
		!basename(dirname(path)).startsWith("posts-tests-")
	) {
		throw new Error("Refusing to delete a non-test database");
	}
	rmSync(dirname(path), { recursive: true });
}

export const seededPosts = [
	{
		id: 1,
		name: "Older update",
		body: "a".repeat(150),
		createdAt: "2026-10-10T12:00:00Z",
		updatedAt: "2026-01-01T12:00:00Z",
	},
	{
		id: 2,
		name: "Newest update",
		body: "b".repeat(151),
		createdAt: "2026-01-01T12:00:00Z",
		updatedAt: "2026-10-10T12:00:00Z",
	},
];

export function seedDatabase(path: string, posts = seededPosts) {
	if (
		basename(path) !== "db.sqlite" ||
		!basename(dirname(path)).startsWith("posts-tests-")
	) {
		throw new Error("Refusing to seed a non-test database");
	}
	const database = new DatabaseSync(path);
	try {
		database.exec("DELETE FROM Post");
		const insert = database.prepare(
			"INSERT INTO Post (id, name, body, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
		);
		for (const post of posts) {
			insert.run(post.id, post.name, post.body, post.createdAt, post.updatedAt);
		}
	} finally {
		database.close();
	}
}

export default function teardown(config: FullConfig) {
	const path: unknown = config.metadata.postsDatabase;
	if (typeof path !== "string")
		throw new Error("Missing disposable posts database");
	disposeDatabase(path);
}
