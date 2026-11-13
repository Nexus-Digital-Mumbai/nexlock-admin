import { i as __toESM } from "../_runtime.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { h as session, m as cn, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as LockOpen, F as Maximize2, Ft as Activity, T as RefreshCw, _ as Shield, _t as ChevronDown, c as Trophy, ft as CircleCheck, h as Smartphone, jt as ArrowRight, m as Sparkles, o as Users, p as Store, t as Zap, xt as ChartColumn, z as Lock } from "../_libs/lucide-react.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-D9VD2leT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var splineData = [
	{
		date: "Oct 10",
		enrolled: 2200,
		locked: 1200,
		released: 700
	},
	{
		date: "Oct 17",
		enrolled: 3100,
		locked: 1700,
		released: 1e3
	},
	{
		date: "Oct 24",
		enrolled: 4300,
		locked: 2200,
		released: 1400
	},
	{
		date: "Oct 31",
		enrolled: 6400,
		locked: 3100,
		released: 2100
	},
	{
		date: "Nov 09",
		enrolled: 5200,
		locked: 2800,
		released: 1900
	}
];
function CustomChartTooltip({ active, payload, label }) {
	if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-xl text-xs space-y-1.5 min-w-[130px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-bold text-foreground border-b border-black/5 dark:border-white/10 pb-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-[#8B5CF6]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#8B5CF6]" }), " Enrolled"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold font-mono",
					children: [(payload[0]?.value / 1e3).toFixed(1), "K"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-[#1E1B4B] dark:text-indigo-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#1E1B4B] dark:bg-indigo-300" }), " Locked"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold font-mono",
					children: [(payload[1]?.value / 1e3).toFixed(1), "K"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-[#A78BFA]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#A78BFA]" }), " Released"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold font-mono",
					children: [(payload[2]?.value / 1e3).toFixed(1), "K"]
				})]
			})
		]
	});
	return null;
}
function Dashboard() {
	const [activeRange, setActiveRange] = (0, import_react.useState)("30D");
	const user = session.getUser();
	const userName = user?.name ? user.name.split(" ")[0] : "Somya";
	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["bi", "summary"],
		queryFn: () => apiClient.get("/bi/summary")
	});
	const summary = data?.data || {
		totalDealers: 248,
		totalDevicesEnrolled: 12500,
		devicesLocked: 7800,
		devicesUnlocked: 3100,
		devicesReleased: 3900,
		recentEnrollments: []
	};
	const pieData = [
		{
			name: "Locked",
			value: summary.devicesLocked || 7800,
			color: "#6366F1"
		},
		{
			name: "Unlocked",
			value: summary.devicesUnlocked || 3100,
			color: "#C7D2FE"
		},
		{
			name: "Released",
			value: summary.devicesReleased || 1600,
			color: "#E0E7FF"
		}
	];
	const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0) || 12500;
	const formatK = (val) => val >= 1e3 ? `${(val / 1e3).toFixed(1)}K` : String(val);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14172C] dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Good Morning, ",
						userName,
						"!"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block animate-wave",
						children: "👋"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[#64748B] dark:text-slate-400",
					children: "Here's what's happening with your NexLock platform today."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch(),
						disabled: isRefetching,
						className: "h-10 rounded-full border border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl text-xs font-semibold px-4 shadow-xs hover:bg-white transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-3.5 w-3.5 mr-1.5", isRefetching ? "animate-spin" : "") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sync Fleet" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/devices",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "h-10 rounded-full bg-[#1E1B4B] hover:bg-[#2A2665] text-white text-xs font-semibold px-5 shadow-xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fleet Manager" })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dealers",
						className: "block focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							label: "Total Dealers",
							value: formatK(summary.totalDealers || 248),
							icon: Users,
							tone: "primary",
							trend: {
								value: "12%",
								up: true
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/devices",
						className: "block focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							label: "Enrolled Devices",
							value: formatK(summary.totalDevicesEnrolled || 12500),
							icon: Smartphone,
							tone: "primary",
							trend: {
								value: "8%",
								up: true
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/devices",
						className: "block focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							label: "Locked Devices",
							value: formatK(summary.devicesLocked || 7800),
							icon: Lock,
							tone: "primary",
							trend: {
								value: "5%",
								up: true
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/devices",
						className: "block focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							label: "Released Devices",
							value: formatK(summary.devicesReleased || 3900),
							icon: CircleCheck,
							tone: "primary",
							trend: {
								value: "10%",
								up: true
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface lg:col-span-7 flex flex-col justify-between p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-[#14172C] dark:text-white",
									children: "Device Analytics"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 self-start sm:self-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center rounded-full bg-black/5 dark:bg-white/10 p-1 text-xs",
									children: [
										"7D",
										"30D",
										"90D",
										"1Y"
									].map((range) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveRange(range),
										className: cn("rounded-full px-3 py-1 font-semibold transition-all cursor-pointer text-xs", activeRange === range ? "bg-[#3D3882] text-white shadow-xs" : "text-[#64748B] dark:text-slate-300 hover:text-foreground"),
										children: range
									}, range))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
									title: "Expand chart",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-5 text-xs text-muted-foreground mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#8B5CF6]" }), " Enrolled"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#1E1B4B] dark:bg-indigo-300" }), " Locked"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#C4B5FD]" }), " Released"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[240px] w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: splineData,
									margin: {
										top: 10,
										right: 10,
										left: -20,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "colorEnrolled",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "5%",
													stopColor: "#8B5CF6",
													stopOpacity: .4
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "95%",
													stopColor: "#8B5CF6",
													stopOpacity: .02
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "colorLocked",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "5%",
													stopColor: "#312E81",
													stopOpacity: .3
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "95%",
													stopColor: "#312E81",
													stopOpacity: .02
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "colorReleased",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "5%",
													stopColor: "#C4B5FD",
													stopOpacity: .3
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "95%",
													stopColor: "#C4B5FD",
													stopOpacity: .02
												})]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "date",
											tickLine: false,
											axisLine: false,
											tick: {
												fill: "#64748B",
												fontSize: 11
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tickLine: false,
											axisLine: false,
											tick: {
												fill: "#64748B",
												fontSize: 11
											},
											tickFormatter: (val) => val === 0 ? "0" : `${val / 1e3}K`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "enrolled",
											stroke: "#8B5CF6",
											strokeWidth: 2.5,
											fillOpacity: 1,
											fill: "url(#colorEnrolled)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "locked",
											stroke: "#312E81",
											strokeWidth: 2,
											fillOpacity: 1,
											fill: "url(#colorLocked)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "released",
											stroke: "#C4B5FD",
											strokeWidth: 2,
											fillOpacity: 1,
											fill: "url(#colorReleased)"
										})
									]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface lg:col-span-5 flex flex-col justify-between p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-[#14172C] dark:text-white",
									children: "Remote Device Control"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Lock or Unlock devices instantly"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/devices",
								className: "flex h-8 w-8 items-center justify-center rounded-full border border-white/80 dark:border-white/10 bg-white/70 dark:bg-white/10 text-foreground hover:bg-white transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center justify-center pl-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-36 w-36 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/15 to-transparent blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-44 w-24 rounded-[26px] border-[3px] border-[#2A2B44] bg-[#0B0C18] p-1.5 shadow-2xl ring-1 ring-white/20 transform -rotate-6 transition-transform hover:rotate-0 duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-7 rounded-full bg-[#2A2B44] mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-[calc(100%-10px)] w-full flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-[#14162B] to-[#0A0B14] p-2 text-center overflow-hidden relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-25" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute h-3 w-3 text-white" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-2 text-[9px] font-mono text-indigo-300",
												children: "NEXLOCK"
											})
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 space-y-3 pr-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/devices",
									className: "block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full h-12 rounded-2xl bg-[#1E1E2F] hover:bg-[#2C2C42] text-white text-xs font-semibold gap-2 shadow-sm transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Device" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/devices",
									className: "block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "w-full h-12 rounded-2xl border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white text-[#1E1E2F] dark:text-white text-xs font-semibold gap-2 shadow-xs transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unlock Device" })]
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), " Connected"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px]",
								children: "Last Sync: 2m ago"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface flex flex-col justify-between p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-[#14172C] dark:text-white",
								children: "Device Status Overview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full",
								children: ["This Month ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-3 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28 w-28 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieChart, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: pieData,
										innerRadius: 36,
										outerRadius: 50,
										paddingAngle: 3,
										dataKey: "value",
										children: pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
									}) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 flex flex-col items-center justify-center text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-foreground leading-tight",
										children: formatK(totalPie)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-muted-foreground leading-none",
										children: "Total"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-xs flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#6366F1] shrink-0" }), " Locked"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground font-mono",
											children: [
												formatK(summary.devicesLocked || 7800),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/70 font-normal",
													children: "62%"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#C7D2FE] shrink-0" }), " Unlocked"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground font-mono",
											children: [
												formatK(summary.devicesUnlocked || 3100),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/70 font-normal",
													children: "25%"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#E0E7FF] shrink-0" }), " Released"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground font-mono",
											children: [
												formatK(summary.devicesReleased || 1600),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/70 font-normal",
													children: "13%"
												})
											]
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface flex flex-col justify-between p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-[#14172C] dark:text-white",
									children: "Recent Activity"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/notifications",
								className: "text-xs font-semibold text-primary hover:underline flex items-center gap-0.5",
								children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 my-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 shrink-0 mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground truncate",
												children: "Device Locked"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "2m ago"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-muted-foreground truncate",
											children: "IMEI 356789012345678"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground truncate",
												children: "New Dealer Registered"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "12m ago"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground truncate",
											children: "TechNova Solutions"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 shrink-0 mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground truncate",
												children: "Device Unlocked"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "25m ago"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-muted-foreground truncate",
											children: "IMEI 356789012345679"
										})]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface flex flex-col justify-between p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-[#14172C] dark:text-white",
									children: "Top Dealers"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dealers",
								className: "text-xs font-semibold text-primary hover:underline flex items-center gap-0.5",
								children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 my-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/15 text-purple-700 font-bold text-xs",
											children: "T"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-foreground truncate",
											children: "TechNova Solutions"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0",
										children: "+524 Units"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 font-bold text-xs",
											children: "G"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-foreground truncate",
											children: "Global Mobiles"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0",
										children: "+382 Units"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-blue-700 font-bold text-xs",
											children: "S"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-foreground truncate",
											children: "SmartBuy Retail"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0",
										children: "+317 Units"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2038] via-[#15172C] to-[#0E1020] p-6 text-white shadow-xl flex flex-col justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-indigo-300 animate-pulse" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 my-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold tracking-tight text-white leading-snug",
									children: "Powering Smarter Device Management"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-300 mt-1 leading-relaxed",
									children: "Realtime telemetry & automated locking policies for device financing."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/devices",
								className: "relative z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "w-full h-9 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold gap-1.5 shadow-sm transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore More" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					})
				]
			})
		]
	});
}
export { Dashboard as component };
