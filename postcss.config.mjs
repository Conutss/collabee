// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 기존 'tailwindcss' 대신 아래처럼 바꿔야 합니다.
    '@tailwindcss/postcss': {},
  },
};

export default config;