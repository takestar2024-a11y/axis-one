/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans JP Variable'", "'Hiragino Kaku Gothic ProN'", "'Hiragino Sans'", "'Yu Gothic'", "Meiryo", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Noto Sans JP Variable'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
