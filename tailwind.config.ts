import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				ds: {
					bg: {
						primary: "var(--ds-bg-primary)",
						secondary: "var(--ds-bg-secondary)",
						tertiary: "var(--ds-bg-tertiary)",
						elevated: "var(--ds-bg-elevated)",
						inset: "var(--ds-bg-inset)",
					},
					surface: {
						DEFAULT: "var(--ds-surface)",
						hover: "var(--ds-surface-hover)",
						active: "var(--ds-surface-active)",
						overlay: "var(--ds-surface-overlay)",
					},
					border: {
						DEFAULT: "var(--ds-border)",
						subtle: "var(--ds-border-subtle)",
						strong: "var(--ds-border-strong)",
						focus: "var(--ds-border-focus)",
					},
					text: {
						primary: "var(--ds-text-primary)",
						secondary: "var(--ds-text-secondary)",
						tertiary: "var(--ds-text-tertiary)",
						disabled: "var(--ds-text-disabled)",
						inverse: "var(--ds-text-inverse)",
					},
					accent: {
						DEFAULT: "var(--ds-accent)",
						hover: "var(--ds-accent-hover)",
						subtle: "var(--ds-accent-subtle)",
						text: "var(--ds-accent-text)",
					},
					success: {
						DEFAULT: "var(--ds-success)",
						subtle: "var(--ds-success-subtle)",
					},
					error: {
						DEFAULT: "var(--ds-error)",
						subtle: "var(--ds-error-subtle)",
					},
					warning: {
						DEFAULT: "var(--ds-warning)",
						subtle: "var(--ds-warning-subtle)",
					},
					info: {
						DEFAULT: "var(--ds-info)",
						subtle: "var(--ds-info-subtle)",
					},
				},
			},
			fontFamily: {
				sans: ["var(--ds-font-sans)"],
				mono: ["var(--ds-font-mono)"],
			},
			fontSize: {
				"ds-xs": "var(--ds-text-xs)",
				"ds-sm": "var(--ds-text-sm)",
				"ds-base": "var(--ds-text-base)",
				"ds-md": "var(--ds-text-md)",
				"ds-lg": "var(--ds-text-lg)",
				"ds-xl": "var(--ds-text-xl)",
				"ds-2xl": "var(--ds-text-2xl)",
				"ds-3xl": "var(--ds-text-3xl)",
			},
			borderRadius: {
				"ds-sm": "var(--ds-radius-sm)",
				"ds-md": "var(--ds-radius-md)",
				"ds-lg": "var(--ds-radius-lg)",
				"ds-xl": "var(--ds-radius-xl)",
				"ds-2xl": "var(--ds-radius-2xl)",
				"ds-full": "var(--ds-radius-full)",
			},
			boxShadow: {
				"ds-xs": "var(--ds-shadow-xs)",
				"ds-sm": "var(--ds-shadow-sm)",
				"ds-md": "var(--ds-shadow-md)",
				"ds-lg": "var(--ds-shadow-lg)",
				"ds-xl": "var(--ds-shadow-xl)",
				"ds-glow": "var(--ds-shadow-glow)",
			},
			spacing: {
				"ds-1": "var(--ds-space-1)",
				"ds-2": "var(--ds-space-2)",
				"ds-3": "var(--ds-space-3)",
				"ds-4": "var(--ds-space-4)",
				"ds-5": "var(--ds-space-5)",
				"ds-6": "var(--ds-space-6)",
				"ds-8": "var(--ds-space-8)",
				"ds-10": "var(--ds-space-10)",
				"ds-12": "var(--ds-space-12)",
				"ds-16": "var(--ds-space-16)",
			},
			transitionDuration: {
				fast: "var(--ds-duration-fast)",
				base: "var(--ds-duration-base)",
				slow: "var(--ds-duration-slow)",
				slower: "var(--ds-duration-slower)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
}
export default config
