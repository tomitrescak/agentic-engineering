# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Database

The SQLite data contract is defined in `prisma/contract.prisma`. Run
`pnpm db:generate` to emit the runtime contract artifacts, `pnpm db:plan
--name <migration>` to create a migration, and `pnpm db:migrate` to apply
planned migrations. Run `pnpm db:status` to check migration status.
`pnpm db:update` updates the database directly to match the contract and is
intended for local prototyping.
This project uses Prisma ORM 8's release-candidate SQLite runtime, which is
experimental and may change before the stable release.

## Testing

Use Vitest (powered by Vite) for unit tests and Playwright for end-to-end
and isolated browser component tests. Install dependencies with `pnpm install`,
then install Chromium with `pnpm exec playwright install chromium`
(`pnpm exec playwright install --with-deps chromium` on Linux CI).

| Command | Purpose |
| --- | --- |
| `pnpm test` | Run unit tests once |
| `pnpm test:watch` | Watch unit tests |
| `pnpm test:e2e` | Test the Next.js app in Chromium |
| `pnpm test:components` | Test component stories in Chromium |
| `pnpm test:browser` | Run both Playwright projects |
| `pnpm test:all` | Run all three suites |
| `pnpm test:gallery` | Serve the component gallery manually |

Unit tests live alongside source as `src/**/*.test.ts` (or `.tsx`) and use
the Node environment for logic tests. Browser component tests live in
`tests/components`; stories live alongside components as `*.story.tsx`.
The standalone Vite gallery supports Playwright's `mount` fixture using
`<path-under-src>/<story-export>` IDs. It imports the app's global styles
and supports the `~` alias and SCSS modules. It is not a production app route.
Test async Server Components through the end-to-end suite, not Vitest.

Playwright starts Next.js on port 3200 and the gallery on port 3100, and
fails if either port is occupied rather than testing an unrelated app.
Both servers currently start for either
browser project. End-to-end tests require the same environment and initialized
database as `pnpm dev` (see `.env.example` and the database commands above).
The initial end-to-end smoke test reads the database but does not write posts;
component tests intercept tRPC requests and do not require database data.
Traces on failure and the HTML report are written to ignored output directories.
Use `pnpm exec playwright show-report` to inspect the report.

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
