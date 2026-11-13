import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { t as StatusBadge } from "./StatusBadge-Day_GkQv.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { l as Input, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-J3iS7xoS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, B as LockOpen, Dt as BluetoothOff, Et as Bluetooth, I as MapPin, Nt as Apple, Ot as Bell, Pt as AlarmClock, S as Search, Tt as Bug, Y as History, h as Smartphone, i as WifiOff, k as Phone, kt as Battery, m as Sparkles, n as X, ot as CreditCard, r as Wifi, rt as ExternalLink, s as User, t as Zap, tt as Eye, u as Trash2, v as ShieldOff, z as Lock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/devices-B8XfpaZm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DevicesPage() {
	const [devices, setDevices] = (0, import_react.useState)([]);
	const [dealers, setDealers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [pagination, setPagination] = (0, import_react.useState)({
		page: 1,
		limit: 10,
		total: 0,
		pages: 1
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [dealerFilter, setDealerFilter] = (0, import_react.useState)("all");
	const [stats, setStats] = (0, import_react.useState)({
		total: 0,
		locked: 0,
		unlocked: 0,
		released: 0
	});
	const [viewOpen, setViewOpen] = (0, import_react.useState)(false);
	const [selectedDevice, setSelectedDevice] = (0, import_react.useState)(null);
	const [sendingCommand, setSendingCommand] = (0, import_react.useState)(null);
	const [releaseConfirmOpen, setReleaseConfirmOpen] = (0, import_react.useState)(false);
	const [wifiBlockConfirmOpen, setWifiBlockConfirmOpen] = (0, import_react.useState)(false);
	const [sendingReminder, setSendingReminder] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		apiClient.get("/dealers?limit=1000").then((res) => {
			if (res.success) setDealers(res.data);
		});
	}, []);
	const fetchDevices = async (page = 1) => {
		setLoading(true);
		try {
			const query = new URLSearchParams({
				page: String(page),
				limit: "10",
				...search ? { search } : {},
				...dealerFilter && dealerFilter !== "all" ? { dealerId: dealerFilter } : {}
			}).toString();
			const res = await apiClient.get(`/devices?${query}`);
			if (res.success) {
				setDevices(res.data);
				if (res.meta?.pagination) {
					const pg = res.meta.pagination;
					setPagination({
						page: pg.page,
						limit: pg.limit,
						total: pg.total,
						pages: pg.pages
					});
				}
			}
			const summaryRes = await apiClient.get("/bi/summary");
			if (summaryRes.success) setStats({
				total: summaryRes.data.totalDevicesEnrolled,
				locked: summaryRes.data.devicesLocked,
				unlocked: summaryRes.data.devicesUnlocked,
				released: summaryRes.data.devicesReleased
			});
		} catch (err) {
			toast.error("Failed to load devices list", { description: err.message });
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchDevices(1);
	}, [search, dealerFilter]);
	const fetchDeviceDetails = async (device) => {
		setSelectedDevice(device);
		setViewOpen(true);
		try {
			const res = await apiClient.get(`/devices/${device.id}`);
			if (res.success) setSelectedDevice(res.data);
		} catch (err) {
			toast.error("Failed to load device details", { description: err.message });
		}
	};
	const refreshSelectedDevice = async (deviceId) => {
		const res = await apiClient.get(`/devices/${deviceId}`);
		if (res.success) setSelectedDevice(res.data);
	};
	const handleDeviceCommand = async (commandType, device) => {
		const target = device ?? selectedDevice;
		if (!target) return;
		if (commandType === "WIFI_BLOCK" && target.simPresent === false) {
			setWifiBlockConfirmOpen(true);
			return;
		}
		await queueCommand(commandType, target);
	};
	const queueCommand = async (commandType, target) => {
		setSendingCommand(commandType);
		try {
			if ((await apiClient.post("/mdm/commands", {
				deviceId: target.id,
				commandType
			})).success) {
				toast.success(`${commandType.replace(/_/g, " ")} command queued`, { description: `${target.deviceCode} will pick it up on its next poll and acknowledge the result.` });
				if (selectedDevice?.id === target.id) await refreshSelectedDevice(target.id);
				fetchDevices(pagination.page);
			}
		} catch (err) {
			toast.error(`Failed to queue ${commandType.replace(/_/g, " ")}`, { description: err.message });
		} finally {
			setSendingCommand(null);
		}
	};
	const handleSendReminder = async (device) => {
		const target = device ?? selectedDevice;
		if (!target) return;
		setSendingReminder(true);
		try {
			if ((await apiClient.post(`/devices/${target.id}/send-reminder`)).success) toast.success("Payment reminder sent", { description: `Pushed to ${target.deviceCode}.` });
		} catch (err) {
			toast.error("Failed to send reminder", { description: err.message });
		} finally {
			setSendingReminder(false);
		}
	};
	const [releaseRow, setReleaseRow] = (0, import_react.useState)(null);
	const [deleteRow, setDeleteRow] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [assigningDep, setAssigningDep] = (0, import_react.useState)(false);
	const deleteDevice = async () => {
		if (!deleteRow) return;
		setDeleting(true);
		try {
			if ((await apiClient.delete(`/devices/${deleteRow.id}`)).success) {
				toast.success(`${deleteRow.deviceCode} deleted`);
				setDeleteRow(null);
				fetchDevices(pagination.page);
			}
		} catch (err) {
			toast.error("Failed to delete device", { description: err.message });
		} finally {
			setDeleting(false);
		}
	};
	const [editSerialRow, setEditSerialRow] = (0, import_react.useState)(null);
	const [serialInput, setSerialInput] = (0, import_react.useState)("");
	const [savingSerial, setSavingSerial] = (0, import_react.useState)(false);
	const openEditSerial = (device) => {
		setEditSerialRow(device);
		setSerialInput(device.serialNumber ?? "");
	};
	const handleSaveSerial = async () => {
		if (!editSerialRow) return;
		const trimmed = serialInput.trim();
		if (!trimmed) {
			toast.error("Serial number can't be empty");
			return;
		}
		setSavingSerial(true);
		try {
			if ((await apiClient.put(`/devices/${editSerialRow.id}`, { serialNumber: trimmed })).success) {
				toast.success("Serial number updated", { description: `${editSerialRow.deviceCode} → ${trimmed}` });
				setEditSerialRow(null);
				if (selectedDevice?.id === editSerialRow.id) setSelectedDevice({
					...selectedDevice,
					serialNumber: trimmed
				});
				fetchDevices(pagination.page);
			}
		} catch (err) {
			toast.error("Failed to update serial number", { description: err.message });
		} finally {
			setSavingSerial(false);
		}
	};
	const handleAssignDep = async (device) => {
		const target = device ?? selectedDevice;
		if (!target) return;
		setAssigningDep(true);
		try {
			if ((await apiClient.post(`/mdm-ios/devices/${target.id}/assign-dep`)).success) toast.success("Zero-touch enrollment enabled", { description: `Serial ${target.serialNumber} is now linked to Nexus DEP profile — erase and power on the iPhone to self-enroll.` });
		} catch (err) {
			toast.error("Failed to assign DEP", { description: err.message });
		} finally {
			setAssigningDep(false);
		}
	};
	const cols = [
		{
			key: "deviceCode",
			header: "Device Code",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20",
				children: r.deviceCode
			})
		},
		{
			key: "platform",
			header: "Platform",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${r.platform === "IOS" ? "bg-slate-500/10 text-slate-300 border-slate-500/30" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"}`,
				children: [r.platform === "IOS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }), r.platform === "IOS" ? "iOS" : "Android"]
			})
		},
		{
			key: "serialNumber",
			header: "Serial / IMEI 1",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs text-foreground font-semibold",
					children: r.serialNumber || "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: r.imei1
				})]
			})
		},
		{
			key: "brandName",
			header: "Hardware Model",
			render: (r) => r.brandName || r.modelName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-semibold text-foreground text-xs md:text-sm",
				children: [
					r.brandName,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-normal text-muted-foreground",
						children: r.modelName
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground/60 italic",
				children: "Hardware Unrecorded"
			})
		},
		{
			key: "dealer",
			header: "Assigned Dealer",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-foreground",
				children: r.dealer?.name
			})
		},
		{
			key: "customer",
			header: "Consumer",
			render: (r) => r.customer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [r.customer.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: r.customer.photoUrl,
					alt: "",
					className: "h-6 w-6 rounded-full object-cover border border-border"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground",
					children: r.customer.name.slice(0, 1)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground text-xs",
					children: r.customer.name
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground/60 italic",
				children: "In Inventory"
			})
		},
		{
			key: "status",
			header: "Lock Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
		},
		{
			key: "enrolledAt",
			header: "Enrolled Date",
			render: (r) => r.enrolledAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground font-medium",
				children: new Date(r.enrolledAt).toLocaleDateString("en-IN", {
					month: "short",
					day: "numeric",
					year: "numeric"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground/60 italic",
				children: "Pending"
			})
		}
	];
	const actions = [
		{
			label: "View Details & Telemetry",
			icon: Eye,
			onClick: fetchDeviceDetails
		},
		{
			label: "Lock Device",
			icon: Lock,
			onClick: (r) => handleDeviceCommand("LOCK", r),
			show: (r) => r.enrollmentStatus === "ENROLLED",
			separatorBefore: true
		},
		{
			label: "Unlock Device",
			icon: LockOpen,
			onClick: (r) => handleDeviceCommand("UNLOCK", r),
			show: (r) => r.enrollmentStatus === "ENROLLED"
		},
		{
			label: "Edit Serial Number",
			icon: Pencil,
			onClick: (r) => openEditSerial(r),
			show: (r) => r.platform === "IOS",
			separatorBefore: true
		},
		{
			label: "Assign DEP (Zero-Touch)",
			icon: Zap,
			onClick: (r) => handleAssignDep(r),
			show: (r) => r.platform === "IOS" && !!r.serialNumber
		},
		{
			label: "Release Device",
			icon: ShieldOff,
			onClick: (r) => setReleaseRow(r),
			show: (r) => r.enrollmentStatus === "ENROLLED",
			destructive: true
		},
		{
			label: "Delete Device",
			icon: Trash2,
			onClick: (r) => setDeleteRow(r),
			show: (r) => r.status === "In Stock",
			destructive: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Financed Device Fleet",
				description: "Active hardware fleet management, live telemetry tracking, and remote policy enforcement.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "Devices" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Fleet Enrolled",
						value: stats.total.toLocaleString(),
						icon: Smartphone,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Locked (Policy Hold)",
						value: stats.locked.toLocaleString(),
						icon: Lock,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Active & Unlocked",
						value: stats.unlocked.toLocaleString(),
						icon: LockOpen,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Released (Settled)",
						value: stats.released.toLocaleString(),
						icon: ShieldOff,
						tone: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by IMEI, Serial number, Device code, Brand or Model…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "h-10 pl-11 pr-8 bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 rounded-full text-xs md:text-sm text-foreground focus-visible:bg-white shadow-xs"
						}),
						search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch(""),
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-black/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full md:w-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dealerFilter,
						onValueChange: setDealerFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-10 bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 rounded-full text-xs shadow-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Dealers" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-2xl border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								className: "text-xs font-semibold rounded-xl",
								children: "All Authorized Dealers"
							}), dealers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: d.id,
								className: "text-xs rounded-xl",
								children: d.name
							}, d.id))]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: devices,
				columns: cols,
				rowKey: (r) => r.id,
				loading,
				rowActions: actions,
				hideSearch: true,
				emptyTitle: "No devices enrolled yet",
				emptyDescription: "Devices will appear here once enrolled through authorized dealer store applications."
			}),
			pagination.pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-center gap-3 bg-card px-5 py-3 rounded-xl border border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground font-medium",
					children: [
						"Page ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: pagination.page
						}),
						" of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: pagination.pages
						}),
						" (",
						pagination.total,
						" total devices)"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: pagination.page <= 1,
						onClick: () => fetchDevices(pagination.page - 1),
						className: "h-8 text-xs font-semibold border-border/80",
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: pagination.page >= pagination.pages,
						onClick: () => fetchDevices(pagination.page + 1),
						className: "h-8 text-xs font-semibold border-border/80",
						children: "Next"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: viewOpen,
				onOpenChange: setViewOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] flex flex-col bg-card text-card-foreground border border-border/80 p-0 overflow-hidden rounded-2xl shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60 flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2.5 text-base font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Device Overview — ", selectedDevice?.deviceCode] }), selectedDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${selectedDevice.platform === "IOS" ? "bg-slate-500/10 text-slate-300 border-slate-500/30" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"}`,
									children: [selectedDevice.platform === "IOS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }), selectedDevice.platform === "IOS" ? "iOS" : "Android"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Real-time hardware handshake telemetry, remote command dispatch, and audit trail."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-6 py-5 flex-1 overflow-y-auto min-h-0 space-y-6",
							children: selectedDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-muted/20 p-4 border border-border/60 rounded-xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5",
													children: "Current Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: selectedDevice.status }) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-3",
													children: ["Dealer: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: selectedDevice.dealer?.name
													})]
												}),
												selectedDevice.customer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-1",
													children: ["Customer: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: selectedDevice.customer.name
													})]
												})
											] }), selectedDevice.customer && (selectedDevice.customer.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: selectedDevice.customer.photoUrl,
												alt: selectedDevice.customer.name,
												className: "h-12 w-12 rounded-full object-cover border border-border shrink-0 ring-2 ring-primary/20"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-muted-foreground" })
											}))]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-muted/20 p-4 border border-border/60 rounded-xl flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5",
												children: "Network Connectivity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-sm font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: `h-4 w-4 ${selectedDevice.lastSeen ? "text-emerald-500" : "text-muted-foreground"}` }), selectedDevice.platform === "ANDROID" && selectedDevice.networkStatus || (selectedDevice.lastSeen ? "Connected" : "No heartbeat")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground block mt-1.5",
												children: ["Heartbeat: ", selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleString("en-IN") : "Never"]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5",
												children: "Battery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5 text-sm font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: `h-4 w-4 ${selectedDevice.batteryLevel != null ? "text-emerald-500" : "text-muted-foreground"}` }), selectedDevice.batteryLevel != null ? `${selectedDevice.batteryLevel}%` : "—"]
											})]
										})]
									})]
								}),
								selectedDevice.platform === "ANDROID" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-muted/20 p-4 border border-border/60 rounded-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3",
											children: "Hardware Telemetry & Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), "SIM State"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right font-semibold text-foreground",
													children: selectedDevice.simPresent === null ? "No data" : selectedDevice.simPresent ? "Detected" : "Missing / Removed"
												}),
												selectedDevice.networkOperator && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5" }), "Cellular Carrier"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right font-semibold text-foreground",
													children: selectedDevice.networkOperator
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }), "SIM Phone Number"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right font-mono font-semibold text-foreground",
													children: selectedDevice.phoneNumber || "Not reported"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), "Last Geolocation"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right font-medium text-foreground",
													children: selectedDevice.lastLocationAt ? new Date(selectedDevice.lastLocationAt).toLocaleString("en-IN") : "No fix yet"
												})
											]
										}),
										selectedDevice.lastLatitude != null && selectedDevice.lastLongitude != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `https://www.google.com/maps?q=${selectedDevice.lastLatitude},${selectedDevice.lastLongitude}`,
											target: "_blank",
											rel: "noreferrer",
											className: "mt-3.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/5 py-1.5 rounded-lg border border-primary/20",
											children: [
												"Inspect Coordinates on Google Maps",
												selectedDevice.lastLocationAccuracy != null ? ` (±${Math.round(selectedDevice.lastLocationAccuracy)}m)` : "",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3",
										children: "Remote Dispatch Console"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("LOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-1.5 h-3.5 w-3.5 text-warning" }), sendingCommand === "LOCK" ? "Queuing…" : "Lock Device"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("UNLOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "mr-1.5 h-3.5 w-3.5 text-emerald-500" }), sendingCommand === "UNLOCK" ? "Queuing…" : "Unlock Device"]
											}),
											selectedDevice.platform === "ANDROID" && (selectedDevice.wifiBlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("WIFI_UNBLOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "mr-1.5 h-3.5 w-3.5 text-emerald-500" }), sendingCommand === "WIFI_UNBLOCK" ? "Unblocking…" : "Unblock Wi-Fi"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("WIFI_BLOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "mr-1.5 h-3.5 w-3.5 text-amber-500" }), sendingCommand === "WIFI_BLOCK" ? "Blocking…" : "Block Wi-Fi"]
											})),
											selectedDevice.platform === "ANDROID" && (selectedDevice.bluetoothBlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("BLUETOOTH_UNBLOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bluetooth, { className: "mr-1.5 h-3.5 w-3.5 text-emerald-500" }), sendingCommand === "BLUETOOTH_UNBLOCK" ? "Unblocking…" : "Unblock Bluetooth"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("BLUETOOTH_BLOCK"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BluetoothOff, { className: "mr-1.5 h-3.5 w-3.5 text-amber-500" }), sendingCommand === "BLUETOOTH_BLOCK" ? "Blocking…" : "Block Bluetooth"]
											})),
											selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("WALLPAPER_OVERLAY") && (selectedDevice.wallpaperOverlayActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("WALLPAPER_OVERLAY_CLEAR"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), sendingCommand === "WALLPAPER_OVERLAY_CLEAR" ? "Clearing…" : "Clear Overlay Message"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("WALLPAPER_OVERLAY"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), sendingCommand === "WALLPAPER_OVERLAY" ? "Sending…" : "Send Overlay Message"]
											})),
											selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("ALARM") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("ALARM"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlarmClock, { className: "mr-1.5 h-3.5 w-3.5 text-amber-500" }), sendingCommand === "ALARM" ? "Sending…" : "Sound Alarm"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("ALARM_STOP"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlarmClock, { className: "mr-1.5 h-3.5 w-3.5" }), sendingCommand === "ALARM_STOP" ? "Stopping…" : "Stop Alarm"]
											})] }),
											selectedDevice.platform === "ANDROID" && (selectedDevice.devModeEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("DEV_MODE_DISABLE"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), sendingCommand === "DEV_MODE_DISABLE" ? "Disabling…" : "Turn Off Developer Mode"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("DEV_MODE_ENABLE"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), sendingCommand === "DEV_MODE_ENABLE" ? "Enabling…" : "Turn On Developer Mode"]
											})),
											selectedDevice.platform === "IOS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleDeviceCommand("APPLY_RESTRICTIONS"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), sendingCommand === "APPLY_RESTRICTIONS" ? "Reapplying…" : "Reapply Restrictions"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												disabled: sendingReminder || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => handleSendReminder(selectedDevice),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-1.5 h-3.5 w-3.5 text-primary" }), sendingReminder ? "Sending…" : "Send Payment Reminder"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/10",
												disabled: sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED",
												onClick: () => setReleaseConfirmOpen(true),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-1.5 h-3.5 w-3.5" }), sendingCommand === "RELEASE_DEVICE" ? "Releasing…" : "Release Device"]
											}),
											selectedDevice.platform === "IOS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-border/80 hover:bg-muted",
												onClick: () => openEditSerial(selectedDevice),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }), "Edit Serial Number"]
											}),
											selectedDevice.platform === "IOS" && selectedDevice.serialNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10",
												disabled: assigningDep,
												onClick: () => handleAssignDep(selectedDevice),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1.5 h-3.5 w-3.5" }), assigningDep ? "Assigning…" : "Assign DEP (Zero-Touch)"]
											})
										]
									}),
									selectedDevice.enrollmentStatus !== "ENROLLED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-2 italic",
										children: "Commands require device enrollment."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border/80 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3 w-3" }), "Audit & Command History"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border border-border/80 rounded-xl overflow-hidden text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-left border-collapse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "bg-muted/40 border-b border-border/80 text-muted-foreground font-semibold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "Command Type"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "Status"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "Dispatched Timestamp"
													})
												]
											}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !selectedDevice.commands || selectedDevice.commands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 3,
												className: "p-4 text-center text-muted-foreground italic",
												children: "No commands queued for this device yet."
											}) }) : [...selectedDevice.commands].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((cmd) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-3 font-semibold text-foreground",
														children: cmd.commandType
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${cmd.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : cmd.status === "FAILED" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`,
															children: cmd.status
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-3 text-muted-foreground",
														children: new Date(cmd.createdAt).toLocaleString("en-IN")
													})
												]
											}, cmd.id)) })]
										})
									})]
								})
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 flex-shrink-0 bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setViewOpen(false),
								className: "text-xs font-semibold",
								children: "Close Overview"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: releaseConfirmOpen,
				onOpenChange: setReleaseConfirmOpen,
				title: "Release Device from Financing Hold?",
				description: selectedDevice ? `This permanently settles the EMI hold on ${selectedDevice.deviceCode}. The consumer will be permitted to factory-reset the hardware.` : "",
				confirmLabel: "Release Device",
				onConfirm: () => {
					setReleaseConfirmOpen(false);
					handleDeviceCommand("RELEASE_DEVICE");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!releaseRow,
				onOpenChange: (o) => !o && setReleaseRow(null),
				title: "Release Device from Financing Hold?",
				description: releaseRow ? `This permanently settles the EMI hold on ${releaseRow.deviceCode}. The consumer will be permitted to factory-reset the hardware.` : "",
				confirmLabel: "Release Device",
				onConfirm: () => {
					const r = releaseRow;
					setReleaseRow(null);
					handleDeviceCommand("RELEASE_DEVICE", r);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!deleteRow,
				onOpenChange: (o) => !o && setDeleteRow(null),
				title: "Delete Device from Inventory?",
				description: deleteRow ? `Permanently removes ${deleteRow.deviceCode} from stock. It will immediately disappear from ${deleteRow.dealer?.name || "the dealer"}'s app.` : "",
				confirmLabel: deleting ? "Deleting…" : "Delete Device",
				onConfirm: deleteDevice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: wifiBlockConfirmOpen,
				onOpenChange: setWifiBlockConfirmOpen,
				title: "Warning: Hardware Has No Active SIM",
				description: "Wi-Fi is this unit's sole connectivity channel. Blocking it will isolate the device from all over-the-air signals, and it cannot be reached remotely until physically reconnected.",
				confirmLabel: "Proceed with Wi-Fi Block",
				onConfirm: () => {
					setWifiBlockConfirmOpen(false);
					if (selectedDevice) queueCommand("WIFI_BLOCK", selectedDevice);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editSerialRow,
				onOpenChange: (o) => !o && setEditSerialRow(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl border-border/80 shadow-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-foreground",
							children: "Edit Serial Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: [editSerialRow?.deviceCode, " — correct serial is required for Apple DEP and supervised profile alignment."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "serial-input",
								className: "text-xs font-semibold text-foreground",
								children: "Hardware Serial Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "serial-input",
								value: serialInput,
								onChange: (e) => setSerialInput(e.target.value.toUpperCase()),
								placeholder: "e.g. C02XXXXXXX",
								className: "font-mono text-xs bg-muted/20 border-border/80",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditSerialRow(null),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleSaveSerial,
								disabled: savingSerial,
								className: "text-xs font-semibold",
								children: savingSerial ? "Saving…" : "Save Serial"
							})]
						})
					]
				})
			})
		]
	});
}
export { DevicesPage as component };
