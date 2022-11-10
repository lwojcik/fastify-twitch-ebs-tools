import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const name = "dist/index";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [
      esbuild({
        sourceMap: false,
        minify: true,
      }),
    ],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        globals: {
          fastify: "fastify",
          "fastify-plugin": "fastify-plugin",
          "twitch-ebs-tools": "twitch-ebs-tools",
        },
        exports: "auto",
      },
    ],
    context: "this",
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
