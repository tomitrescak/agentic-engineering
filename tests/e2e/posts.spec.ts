import { expect, test } from "@playwright/test";
import { seedDatabase, seededPosts } from "./database";

test.describe.configure({ mode: "serial" });

test.beforeEach(() => {
	const testInfo = test.info();
	const path: unknown = testInfo.config.metadata.postsDatabase;
	if (typeof path !== "string")
		throw new Error("Missing disposable posts database");
	seedDatabase(path);
});

test("home page preserves its content and links to the separate ordered posts list", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "Create T3 App" }),
	).toBeVisible();
	await expect(page.getByText("Hello from tRPC")).toBeVisible();
	await expect(page.getByRole("link", { name: /First Steps/ })).toBeVisible();
	await expect(page.getByRole("link", { name: /Documentation/ })).toBeVisible();
	await expect(page.getByPlaceholder("Title")).toBeVisible();
	await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
	await page.getByRole("link", { name: "View all posts" }).click();
	await expect(page).toHaveURL("/posts");
	const items = page
		.getByRole("list", { name: "Posts", exact: true })
		.getByRole("listitem");
	await expect(items.getByRole("heading")).toHaveText([
		"Newest update",
		"Older update",
	]);
	for (const [index, post] of [...seededPosts].reverse().entries()) {
		await expect(items.nth(index).locator("p").first()).toHaveText(
			post.body.slice(0, 150) + (post.body.length > 150 ? "…" : ""),
		);
		await expect(items.nth(index).locator("time")).toHaveAttribute(
			"datetime",
			new Date(post.updatedAt).toISOString(),
		);
		await expect(items.nth(index).locator("time")).toHaveText(
			new Date(post.updatedAt).toLocaleDateString(),
		);
	}
});

test("no posts shows an empty state on direct navigation", async ({
	page,
}, testInfo) => {
	const path: unknown = testInfo.config.metadata.postsDatabase;
	if (typeof path !== "string")
		throw new Error("Missing disposable posts database");
	seedDatabase(path, []);
	await page.goto("/posts");
	await expect(page.getByText("No posts yet.")).toBeVisible();
	await expect(
		page.getByRole("list", { name: "Posts", exact: true }),
	).toHaveCount(0);
});

test("title-only creation still works and the next posts navigation includes the new post", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByPlaceholder("Title").fill("Created through home page");
	await page.getByRole("button", { name: "Submit", exact: true }).click();
	await expect(
		page.getByText("Your most recent post: Created through home page", {
			exact: true,
		}),
	).toBeVisible();
	await expect(page.getByPlaceholder("Title")).toHaveValue("");
	await page.getByRole("link", { name: "View all posts" }).click();
	await expect(
		page.getByRole("heading", {
			name: "Created through home page",
			exact: true,
		}),
	).toBeVisible();
});
