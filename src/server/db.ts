import "server-only";

import { UNBOUND_NAMESPACE_ID } from "@prisma/orm-sqlite/components/ir";
import { orm } from "@prisma/orm-sqlite/orm-client";
import sqlite, { type SqliteRuntime } from "@prisma/orm-sqlite/runtime";
import { env } from "~/env";
import type { Contract } from "../../generated/prisma8/contract.d";
import contractJson from "../../generated/prisma8/contract.json" with {
	type: "json",
};

const client = sqlite<Contract>({ contractJson });
const globalForPrisma = globalThis as typeof globalThis & {
	prismaRuntime: Promise<SqliteRuntime> | undefined;
};

const getRuntime = () => {
	const databaseUrl = env.DATABASE_URL;
	if (!databaseUrl.startsWith("file:")) {
		throw new Error("DATABASE_URL must be a file: URL for the SQLite database");
	}

	if (!globalForPrisma.prismaRuntime) {
		globalForPrisma.prismaRuntime = client.connect({
			path: databaseUrl.slice("file:".length),
		});
	}

	return globalForPrisma.prismaRuntime;
};

export const getDatabase = async () => {
	const runtime = await getRuntime();
	return {
		db: orm({ runtime, context: client.context })[UNBOUND_NAMESPACE_ID],
		sql: client.sql,
		runtime,
	};
};
