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
        // ADR-015 semantic aliases — prefer these in new code
        surface: {
          page:    "var(--surface-page)",
          hover:   "var(--surface-hover)",
          pressed: "var(--surface-pressed)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary:  "var(--text-tertiary)",
          faint:     "var(--text-faint)",
          inverse:   "var(--text-inverse)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong:  "var(--border-strong)",
        },
        state: {
          danger:  "var(--state-danger)",
          warn:    "var(--state-warn)",
          success: "var(--state-success)",
        },
      },
      // ADR-015: 4pt spacing scale via tokens
      spacing: {
        "sp-1": "var(--sp-1)",
        "sp-2": "var(--sp-2)",
        "sp-3": "var(--sp-3)",
        "sp-4": "var(--sp-4)",
        "sp-5": "var(--sp-5)",
        "sp-6": "var(--sp-6)",
        "sp-8": "var(--sp-8)",
        "sp-10": "var(--sp-10)",
      },
      fontSize: {
        micro:   "var(--fs-micro)",
        caption: "var(--fs-caption)",
        "body-s": "var(--fs-body-s)",
        body:    "var(--fs-body)",
        title:   "var(--fs-title)",
        stat:    "var(--fs-stat)",
        display: "var(--fs-display)",
      },
      borderRadius: {
        card:  "var(--r-card)",
        pill:  "var(--r-pill)",
        input: "var(--r-input)",
        sm:    "var(--r-sm)",
      },
      zIndex: {
        base:    "var(--z-base)",
        raised:  "var(--z-raised)",
        capture: "var(--z-capture)",
        nav:     "var(--z-nav)",
        overlay: "var(--z-overlay)",
      },
      fontFamily: {
        newsreader: ["'Newsreader'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
