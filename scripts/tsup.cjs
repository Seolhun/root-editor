const modernTarget = ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'];
/**
 * ESM 모듈을 지원하는 최신 브라우저 목록
 */
// const legacyTarget = ['chrome51', 'firefox53', 'edge18', 'safari11', 'ios11', 'opera38'];
/**
 * Full ES6 feature를 지원하기 위한 최신 브라우저 목록
 */
const legacyTarget = ['chrome60', 'firefox60', 'edge18', 'safari14', 'ios14', 'opera68'];

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @param {string[]} opts.noExternal - The noExternal array.
 * @param {string[]} opts.external - The external array.
 * @param {boolean} opts.clean - Clean the output directory.
 * @param {import('tsup').Options['esbuildOptions']} opts.esbuildOptions - esbuild options.
 * @param {import('tsup').Options['esbuildPlugins']} opts.esbuildPlugins - esbuild plugins.
 * @param {import('tsup').Options['loader']} opts.loader - Loader options.
 * @returns {import('tsup').Options}
 */
export function modernConfig(opts) {
  return {
    ...(opts || {}),
    clean: opts.clean || true,
    dts: true,
    entry: opts.entry || ['src/index.ts'],
    esbuildOptions: opts.esbuildOptions,
    esbuildPlugins: opts.esbuildPlugins,
    external: opts.external,
    format: ['cjs', 'esm'],
    noExternal: opts.noExternal,
    outDir: 'dist/modern',
    sourcemap: true,
    target: modernTarget,
    treeshake: true,
    tsconfig: 'tsconfig.build.json',
  };
}

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @param {string[]} opts.noExternal - The noExternal array.
 * @param {string[]} opts.external - The external array.
 * @param {boolean} opts.clean - Clean the output directory.
 * @returns {import('tsup').Options}
 */
export function legacyConfig(opts) {
  return {
    ...(opts || {}),
    clean: opts.clean || true,
    dts: true,
    entry: opts.entry || ['src/index.ts'],
    esbuildOptions: opts.esbuildOptions,
    esbuildPlugins: opts.esbuildPlugins,
    external: opts.external,
    format: ['cjs', 'esm'],
    noExternal: opts.noExternal,
    outDir: 'dist/legacy',
    sourcemap: true,
    target: legacyTarget,
    treeshake: true,
    tsconfig: 'tsconfig.build.json',
  };
}
