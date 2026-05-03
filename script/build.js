// script/build.js
import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";
import { build as viteBuild } from "vite";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));

  const externals = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];

  await esbuild({
    entryPoints: ["server/index.js"],
    platform: "node",
    bundle: true,
    format: "cjs",
    target: "node20",
    outfile: "dist/index.cjs",
    external: externals,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    logLevel: "info",
  });
}

buildAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
