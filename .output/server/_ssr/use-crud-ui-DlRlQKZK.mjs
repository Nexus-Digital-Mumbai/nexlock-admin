import { i as __toESM } from "../_runtime.mjs";
import { l as Input, m as cn, u as Button } from "./router-C4OGpStW.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { t as Textarea } from "./textarea-Diw4dwM4.mjs";
import { t as Switch } from "./switch-sgIg-9Hs.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { V as LoaderCircle } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/use-crud-ui-DlRlQKZK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CrudModal({ open, onOpenChange, title, description, fields, initial, mode = "create", submitLabel, onSubmit }) {
	const defaults = (0, import_react.useMemo)(() => {
		const d = {};
		fields.forEach((f) => {
			d[f.name] = initial?.[f.name] ?? (f.type === "switch" ? false : f.type === "number" ? 0 : "");
		});
		return d;
	}, [fields, initial]);
	const [values, setValues] = (0, import_react.useState)(defaults);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setValues(defaults);
			setErrors({});
		}
	}, [open, defaults]);
	const setVal = (name, v) => {
		setValues((p) => ({
			...p,
			[name]: v
		}));
		if (errors[name]) setErrors((e) => ({
			...e,
			[name]: ""
		}));
	};
	const validate = () => {
		const errs = {};
		fields.forEach((f) => {
			const v = values[f.name];
			const empty = v === "" || v === null || v === void 0;
			if (f.required && empty) errs[f.name] = `${f.label} is required`;
			else if (!empty && f.type === "email" && !/^\S+@\S+\.\S+$/.test(String(v))) errs[f.name] = "Enter a valid email address";
			else if (!empty && f.type === "tel" && String(v).replace(/\D/g, "").length < 7) errs[f.name] = "Enter a valid phone number";
			else if (!empty && f.type === "number" && Number.isNaN(Number(v))) errs[f.name] = "Must be a valid number";
			else if (f.validate) {
				const msg = f.validate(v, values);
				if (msg) errs[f.name] = msg;
			}
		});
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const handleSubmit = async () => {
		if (!validate()) return;
		setSubmitting(true);
		try {
			const out = { ...values };
			fields.forEach((f) => {
				if (f.type === "number") out[f.name] = Number(out[f.name] ?? 0);
			});
			await onSubmit(out);
			onOpenChange(false);
		} finally {
			setSubmitting(false);
		}
	};
	const sections = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		fields.forEach((f) => {
			const s = f.section ?? "";
			if (!map.has(s)) map.set(s, []);
			map.get(s).push(f);
		});
		return Array.from(map.entries());
	}, [fields]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[85vh] flex flex-col bg-card text-card-foreground border border-border/80 p-0 overflow-hidden rounded-2xl shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "border-b border-border/80 px-6 py-4.5 bg-card/60 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-bold text-foreground",
						children: title
					}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: description
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-5 space-y-6 flex-1 overflow-y-auto",
					children: sections.map(([section, list], idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [section && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: section
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border/60" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: list.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("space-y-1.5", f.colSpan === 2 && "md:col-span-2"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs font-semibold text-foreground/90",
										children: [f.label, f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-destructive font-bold",
											children: "*"
										})]
									}),
									renderField(f, values[f.name], (v) => setVal(f.name, v), !!errors[f.name]),
									errors[f.name] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-medium text-destructive",
										children: errors[f.name]
									}) : f.helper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: f.helper
									}) : null
								]
							}, f.name))
						})]
					}, section || idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "border-t border-border/80 px-6 py-3.5 sm:justify-end flex-shrink-0 bg-muted/20 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => onOpenChange(false),
						disabled: submitting,
						className: "border-border/80 text-xs font-medium",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: handleSubmit,
						disabled: submitting,
						className: "gap-1.5 text-xs font-semibold shadow-xs",
						children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), submitLabel ?? (mode === "edit" ? "Save Changes" : "Create")]
					})]
				})
			]
		})
	});
}
function renderField(f, value, onChange, hasError) {
	const t = f.type ?? "text";
	if (t === "textarea") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
		value: String(value ?? ""),
		placeholder: f.placeholder,
		onChange: (e) => onChange(e.target.value),
		rows: 3,
		className: cn("text-xs bg-muted/20 border-border/80 focus-visible:bg-card", hasError && "border-destructive")
	});
	if (t === "select") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: String(value ?? ""),
		onValueChange: (v) => onChange(v),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: cn("h-9 text-xs bg-muted/20 border-border/80", hasError && "border-destructive"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: f.placeholder ?? "Select an option…" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
			className: "rounded-xl shadow-xl border-border",
			children: (f.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: o.value,
				className: "text-xs",
				children: o.label
			}, o.value))
		})]
	});
	if (t === "switch") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: Boolean(value),
			onCheckedChange: onChange
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-foreground",
			children: value ? "Enabled" : "Disabled"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		type: t,
		value: value === void 0 || value === null ? "" : String(value),
		placeholder: f.placeholder,
		min: f.min,
		max: f.max,
		onChange: (e) => onChange(t === "number" ? e.target.value === "" ? "" : Number(e.target.value) : e.target.value),
		className: cn("h-9 text-xs bg-muted/20 border-border/80 focus-visible:bg-card", hasError && "border-destructive")
	});
}
function DetailsDialog({ open, onOpenChange, title, subtitle, fields, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[85vh] flex flex-col bg-card text-card-foreground border border-border/80 p-0 overflow-hidden rounded-2xl shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "border-b border-border/80 px-6 py-4.5 bg-card/60 flex-shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-bold text-foreground",
						children: title
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: subtitle
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3.5 px-6 py-5 md:grid-cols-2 flex-1 overflow-y-auto",
					children: fields.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/30", f.colSpan === 2 && "md:col-span-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80",
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs md:text-sm font-medium text-foreground break-words",
							children: f.value ?? "—"
						})]
					}, i))
				}),
				footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-end gap-2.5 border-t border-border/80 px-6 py-3.5 flex-shrink-0 bg-muted/20",
					children: footer
				})
			]
		})
	});
}
function useCrudUi() {
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editRow, setEditRow] = (0, import_react.useState)(null);
	const [viewRow, setViewRow] = (0, import_react.useState)(null);
	const [deleteRow, setDeleteRow] = (0, import_react.useState)(null);
	const [bulkDeleteIds, setBulkDeleteIds] = (0, import_react.useState)(null);
	return {
		createOpen,
		setCreateOpen,
		editRow,
		setEditRow,
		viewRow,
		setViewRow,
		deleteRow,
		setDeleteRow,
		bulkDeleteIds,
		setBulkDeleteIds
	};
}
export { DetailsDialog as n, useCrudUi as r, CrudModal as t };
