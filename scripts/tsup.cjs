const modernTarget = ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'];
/**
 * ESM 모듈을 지원하는 최신 브라우저 목록
 * Full ES6 feature를 지원하기 위한 최신 브라우저 목록
 */
const legacyTarget = ['chrome60', 'firefox60', 'edge18', 'safari14', 'ios14', 'opera68'];

/**
 * @param {import('tsup').Options} opts - Options for building configurations.
 * @returns {import('tsup').Options}
 */
export function modernConfig(opts) {
  return {
    clean: opts.clean || true,
    dts: true,
    entry: opts.entry || ['src/index.ts'],
    esbuildOptions: opts.esbuildOptions,
    esbuildPlugins: opts.esbuildPlugins,
    external: opts.external,
    format: ['cjs', 'esm'],
    noExternal: opts.noExternal,
    outDir: 'dist/modern',
    target: modernTarget,
    tsconfig: 'tsconfig.build.json',
    // minify: 'terser',
    sourcemap: true,
    treeshake: true,
    ...(opts || {}),
  };
}

/**
 * @param {import('tsup').Options} opts - Options for building configurations.
 * @returns {import('tsup').Options}
 */
export function legacyConfig(opts) {
  return {
    clean: opts.clean || true,
    dts: true,
    entry: opts.entry || ['src/index.ts'],
    esbuildOptions: opts.esbuildOptions,
    esbuildPlugins: opts.esbuildPlugins,
    external: opts.external,
    format: ['cjs', 'esm'],
    noExternal: opts.noExternal,
    outDir: 'dist/legacy',
    target: legacyTarget,
    tsconfig: 'tsconfig.build.json',
    // minify: 'terser',
    sourcemap: true,
    treeshake: true,
    ...(opts || {}),
  };
}
