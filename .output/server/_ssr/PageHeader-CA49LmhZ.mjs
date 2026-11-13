import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { J as House, ht as ChevronRight } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/PageHeader-CA49LmhZ.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description, breadcrumbs, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-7 flex flex-col gap-4 border-b border-white/70 dark:border-white/10 pb-6 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [
				breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/85 dark:border-white/15 bg-white/60 dark:bg-white/10 px-3 py-1 text-xs text-muted-foreground shadow-xs backdrop-blur-md",
					children: breadcrumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground/40 shrink-0" }), c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: c.to,
							className: "inline-flex items-center gap-1 font-medium transition-colors hover:text-primary",
							children: [i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground/90",
							children: c.label
						})]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold tracking-tight text-[#14172C] dark:text-white md:text-3xl",
					children: title
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-3xl text-xs md:text-sm leading-relaxed text-[#64748B] dark:text-slate-400",
					children: description
				})
			]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap items-center gap-2.5",
			children: actions
		})]
	});
}
export { PageHeader as t };
