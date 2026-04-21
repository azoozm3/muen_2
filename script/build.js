import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";
import { build as viteBuild } from "vite";

const allowlist = [
  "bcrypt",
  "connect-mongo",
  "dotenv",
  "express",
  "express-session",
  "mongoose",
  "nanoid",
  "zod",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.js"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
