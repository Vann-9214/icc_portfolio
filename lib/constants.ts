// Shared transition/loader color constants.
// Used by both transition.provider.tsx and intro-loader.tsx
// so the page transition and the loader exit sequence are always in sync.

// Wave order inverts per mode:
//   light mode → dark wave first, light wave second
//   dark  mode → light wave first, dark wave second
export const DARK_COLOR  = "#0C0D0F"; // near-black with barely-there blue hint
export const LIGHT_COLOR = "#EEF3FC"; // near-white with soft blue tint

// Background gradients — mirror globals.css :root and .dark exactly
export const BG_DARK  = "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%), radial-gradient(ellipse at 50% 45%, #09090b 0%, #18181b 100%)";
export const BG_LIGHT = "radial-gradient(circle, rgba(15, 66, 169, 0.09) 0%, transparent 70%), radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #EEF3FC 100%)";
