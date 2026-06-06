import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // All colors reference CSS custom properties — no hardcoded hex.
      // Grep invariant: grep "#[0-9A-Fa-f]{3,6}" tailwind.config.ts = 0 results.
      colors: {
        cream:  "var(--cream)",
        cream2: "var(--cream2)",
        cream3: "var(--cream3)",
        ink:    "var(--ink)",
        ink2:   "var(--ink2)",
        ink3:   "var(--ink3)",
        ink4:   "var(--ink4)",
        line:   "var(--line)",
        line2:  "var(--line2)",
        red:    "var(--red)",
        amber:  "var(--amber)",
        green:  "var(--green)",
      },
      fontFamily: {
        newsreader: ["'Newsreader'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
