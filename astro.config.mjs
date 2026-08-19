// @ts-check

import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// Tailwind se procesa vía PostCSS (postcss.config.mjs), ya que la integración
// @astrojs/tailwind quedó deprecada y no es compatible con Astro 7.
// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	vite: {
		build: {
			// Sin esto, el minificador emite media queries de rango — @media (width>=768px) —
			// que Safari sólo entiende desde la 16.4. Mantiene el (min-width: 768px) de siempre.
			cssTarget: ["chrome91", "edge91", "firefox90", "safari14"],
		},
	},
});
