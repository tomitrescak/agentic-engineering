import { expect, test } from "@playwright/test";

for (const length of [0, 12, 149, 150, 151]) {
	test(`preview preserves up to 150 characters (${length})`, async ({
		mount,
		page,
	}) => {
		const body = "x".repeat(length);
		const component = await mount("app/_components/post-list/Preview", {
			body,
		});
		await expect(
			component.getByRole("heading", { name: "Example post" }),
		).toBeVisible();
		await expect(component.locator("li > p").first()).toHaveText(
			body.slice(0, 150) + (length > 150 ? "…" : ""),
		);
		await expect(component.locator("time")).toHaveAttribute(
			"datetime",
			"2026-10-10T12:00:00.000Z",
		);
		const date = await page.evaluate(() =>
			new Date("2026-10-10T12:00:00Z").toLocaleDateString(),
		);
		await expect(component.locator("time")).toHaveText(date);
	});
}

test("preview does not split Unicode characters", async ({ mount }) => {
	const component = await mount("app/_components/post-list/Preview", {
		body: "😀".repeat(151),
	});
	await expect(component.locator("li > p").first()).toHaveText(
		`${"😀".repeat(150)}…`,
	);
});

test("empty list is not a loading or error state", async ({ mount }) => {
	const component = await mount("app/_components/post-list/Empty");
	await expect(component.getByText("No posts yet.")).toBeVisible();
	await expect(component.getByRole("list")).toHaveCount(0);
	await expect(component.getByRole("alert")).toHaveCount(0);
});
