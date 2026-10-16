/// <reference types="vite/client" />
import { type ComponentType, StrictMode } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import "../../src/styles/globals.css";

type MountParams = { story: string; props?: Record<string, unknown> };

declare global {
	interface Window {
		mount(params: MountParams): Promise<void>;
		unmount(): Promise<void>;
	}
}

const stories = import.meta.glob<Record<string, ComponentType>>(
	"../../src/**/*.story.tsx",
);
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Gallery root is missing");
let root: Root | undefined;

window.mount = async ({ story, props }) => {
	const separator = story.lastIndexOf("/");
	const path = story.slice(0, separator);
	const name = story.slice(separator + 1);
	const load = stories[`../../src/${path}.story.tsx`];
	if (!load) throw new Error(`Unknown story: ${story}`);
	const Story = (await load())[name];
	if (!Story) throw new Error(`Unknown story export: ${story}`);
	root ??= createRoot(rootElement, {
		onUncaughtError: (error) => {
			throw error;
		},
	});
	flushSync(() =>
		root?.render(
			<StrictMode>
				<Story {...props} />
			</StrictMode>,
		),
	);
};

window.unmount = async () => {
	root?.unmount();
	root = undefined;
};
