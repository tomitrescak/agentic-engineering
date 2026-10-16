import "dotenv/config";
import { defineConfig as defineSqliteConfig } from "@prisma/orm-sqlite/config";
import { definePrismaConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.startsWith("file:")) {
	throw new Error("DATABASE_URL must be a file: URL for the SQLite database");
}

export default definePrismaConfig({
	orm: defineSqliteConfig({
		contract: "./prisma/contract.prisma",
		output: "./generated/prisma8",
		db: {
			connection: databaseUrl.slice("file:".length),
		},
		migrations: {
			dir: "./prisma/migrations",
		},
	}),
});
