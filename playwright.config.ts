import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: [["list"], ["html", { open: "never" }]],
	use: { trace: "retain-on-failure" },
	projects: [
		{
			name: "e2e",
			testDir: "./tests/e2e",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://127.0.0.1:3200",
			},
		},
		{
			name: "components",
			testDir: "./tests/components",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://127.0.0.1:3100/playwright/gallery/index.html",
				serviceWorkers: "block",
				reuseContext: true,
			},
		},
	],
	webServer: [
		{
			command: "pnpm dev --hostname 127.0.0.1 --port 3200",
			url: "http://127.0.0.1:3200",
			reuseExistingServer: false,
			timeout: 120_000,
		},
		{
			command: "pnpm test:gallery",
			url: "http://127.0.0.1:3100/playwright/gallery/index.html",
			reuseExistingServer: false,
		},
	],
});
