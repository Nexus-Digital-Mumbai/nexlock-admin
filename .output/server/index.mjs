globalThis.__nitro_main__ = import.meta.url;
import { t as HookableCore } from "./_libs/hookable.mjs";
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as FastResponse } from "./_libs/srvx.mjs";
// #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
// #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/Dashboard-Background.png": {
		"type": "image/png",
		"etag": "\"bbd1-0yXW3gFkpuPOS2wu/S64w4WnkdQ\"",
		"mtime": "2026-11-15T17:08:05.913Z",
		"size": 48081,
		"path": "../public/Dashboard-Background.png"
	},
	"/nexus-background.jpg": {
		"type": "image/jpeg",
		"etag": "\"bbd1-0yXW3gFkpuPOS2wu/S64w4WnkdQ\"",
		"mtime": "2026-11-15T17:08:05.913Z",
		"size": 48081,
		"path": "../public/nexus-background.jpg"
	},
	"/nexus-full-logo.png": {
		"type": "image/png",
		"etag": "\"3b7ca-3Ma8GFQGFEwQh9Eby7AHu1uZE5s\"",
		"mtime": "2026-11-13T06:59:53.628Z",
		"size": 243658,
		"path": "../public/nexus-full-logo.png"
	},
	"/nexus-icon.png": {
		"type": "image/png",
		"etag": "\"64786-0l9UV8+WAjReu9luXxjwszOCPZw\"",
		"mtime": "2026-11-15T17:01:45.050Z",
		"size": 411526,
		"path": "../public/nexus-icon.png"
	},
	"/assets/activity-f0Inv4sm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4-FA60YqW2vE1AOvxPYw+2iuHPNaQ\"",
		"mtime": "2026-11-16T08:00:13.998Z",
		"size": 228,
		"path": "../public/assets/activity-f0Inv4sm.js"
	},
	"/assets/analytics-CaRp9_MI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"202b-cKO1uG9TgQvPFdAqauA1skJJYG4\"",
		"mtime": "2026-11-16T08:00:14.000Z",
		"size": 8235,
		"path": "../public/assets/analytics-CaRp9_MI.js"
	},
	"/assets/apple-DgcVrhqL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-6vzB2Uejno2b3O8GfuddDKWyvKg\"",
		"mtime": "2026-11-16T08:00:14.002Z",
		"size": 308,
		"path": "../public/assets/apple-DgcVrhqL.js"
	},
	"/assets/arrow-left-ll4X2Wf3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-72euIpSRuHQbJaz/uoxBwNjIeVI\"",
		"mtime": "2026-11-16T08:00:14.003Z",
		"size": 159,
		"path": "../public/assets/arrow-left-ll4X2Wf3.js"
	},
	"/assets/api-client-BYLBHlrT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23317-iroAhc8G2AIP4XEayIVXR0ALRc4\"",
		"mtime": "2026-11-16T08:00:14.000Z",
		"size": 144151,
		"path": "../public/assets/api-client-BYLBHlrT.js"
	},
	"/nexus-official-logo.png": {
		"type": "image/png",
		"etag": "\"3b7ca-3Ma8GFQGFEwQh9Eby7AHu1uZE5s\"",
		"mtime": "2026-11-13T06:59:53.628Z",
		"size": 243658,
		"path": "../public/nexus-official-logo.png"
	},
	"/assets/building-2-guXpWM1n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179-pbRYHa4+5rDTiiFyXVuA5F71aBE\"",
		"mtime": "2026-11-16T08:00:14.004Z",
		"size": 377,
		"path": "../public/assets/building-2-guXpWM1n.js"
	},
	"/assets/button-BsVySrTj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1331-6XU2Olh4sTSbu9SvGTPZ63D2Irk\"",
		"mtime": "2026-11-16T08:00:14.006Z",
		"size": 4913,
		"path": "../public/assets/button-BsVySrTj.js"
	},
	"/assets/calendar-BcNrn_Tn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-D+kGTULxmcTNDBIHJMUgaglAMr0\"",
		"mtime": "2026-11-16T08:00:14.007Z",
		"size": 251,
		"path": "../public/assets/calendar-BcNrn_Tn.js"
	},
	"/assets/checkbox-DSvYXwTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e8-7n3yLAGRmT4nQShRBc5SlMAGlT4\"",
		"mtime": "2026-11-16T08:00:14.008Z",
		"size": 4584,
		"path": "../public/assets/checkbox-DSvYXwTG.js"
	},
	"/assets/chevron-up-8gf-1Iao.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-8OupqEcJ2dvSfjm8+jMX0KxlWvA\"",
		"mtime": "2026-11-16T08:00:14.009Z",
		"size": 122,
		"path": "../public/assets/chevron-up-8gf-1Iao.js"
	},
	"/assets/circle-check-CmZ3EBVV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac-jbl1iUEEXw3BrGTWhrUPlYEpnxc\"",
		"mtime": "2026-11-16T08:00:14.011Z",
		"size": 172,
		"path": "../public/assets/circle-check-CmZ3EBVV.js"
	},
	"/assets/ConfirmDialog-BiOftw_X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133a-J9zqca7MYT5MqpHyNk+J3pRY5ck\"",
		"mtime": "2026-11-16T08:00:13.989Z",
		"size": 4922,
		"path": "../public/assets/ConfirmDialog-BiOftw_X.js"
	},
	"/assets/copy-DmfgSYo1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-d3cZeOl30kWSmjOR0Dx9A5eUvFg\"",
		"mtime": "2026-11-16T08:00:14.013Z",
		"size": 230,
		"path": "../public/assets/copy-DmfgSYo1.js"
	},
	"/assets/customers-CYj6MQEy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f89-qYnuMC48OAOyFh2/STJnsDxGX+E\"",
		"mtime": "2026-11-16T08:00:14.015Z",
		"size": 12169,
		"path": "../public/assets/customers-CYj6MQEy.js"
	},
	"/assets/DataTable-DMSsY8OQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"402e-W3aU7FzhMhzpD225gmk27gBN+4A\"",
		"mtime": "2026-11-16T08:00:13.991Z",
		"size": 16430,
		"path": "../public/assets/DataTable-DMSsY8OQ.js"
	},
	"/assets/dealers-BI8Y9YvU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d20-HVJsLsXRQvEzdehGJbf/mKfnjsU\"",
		"mtime": "2026-11-16T08:00:14.016Z",
		"size": 15648,
		"path": "../public/assets/dealers-BI8Y9YvU.js"
	},
	"/assets/devices-EqzNHVqO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7335-PG0b0UsOpXqL6TOhR0SoH33NpzU\"",
		"mtime": "2026-11-16T08:00:14.016Z",
		"size": 29493,
		"path": "../public/assets/devices-EqzNHVqO.js"
	},
	"/assets/dialog-Cjo-4WN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"807-ShdU9a+HuKsHY9rtjL+qqIndHrw\"",
		"mtime": "2026-11-16T08:00:14.018Z",
		"size": 2055,
		"path": "../public/assets/dialog-Cjo-4WN2.js"
	},
	"/Dashboard-Background-old.png": {
		"type": "image/png",
		"etag": "\"8a063-uaDCaEUwlsEgnQ4M+J7PW/IIoKE\"",
		"mtime": "2026-11-13T06:59:12.954Z",
		"size": 565347,
		"path": "../public/Dashboard-Background-old.png"
	},
	"/nexus-dashboard-reference.png": {
		"type": "image/png",
		"etag": "\"14cc66-gS4J5t4SqT0vneIuQJXyiGv52UI\"",
		"mtime": "2026-11-13T06:59:37.749Z",
		"size": 1363046,
		"path": "../public/nexus-dashboard-reference.png"
	},
	"/assets/dist-CSH6NUJt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b8b-MxZz0vuZWcLB9YVSi8ni+2+vm2M\"",
		"mtime": "2026-11-16T08:00:14.018Z",
		"size": 7051,
		"path": "../public/assets/dist-CSH6NUJt.js"
	},
	"/assets/distributor-analytics-DYK3egB_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15eb-00GRbUFhzylTg1/MiJb8WdHQs4s\"",
		"mtime": "2026-11-16T08:00:14.021Z",
		"size": 5611,
		"path": "../public/assets/distributor-analytics-DYK3egB_.js"
	},
	"/assets/distributor-billing-aDLgKGQq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17fe-CjNotSL4o9bE3SsgpbmGh53ehJc\"",
		"mtime": "2026-11-16T08:00:14.022Z",
		"size": 6142,
		"path": "../public/assets/distributor-billing-aDLgKGQq.js"
	},
	"/assets/distributor-login-DkNlRcHB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22cf-gCLnRRYQzkoRVgoeO7DZYkDEUKs\"",
		"mtime": "2026-11-16T08:00:14.022Z",
		"size": 8911,
		"path": "../public/assets/distributor-login-DkNlRcHB.js"
	},
	"/assets/distributor-nRxTaCE9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"392b-QnXoVHvaWOZULCwqBxQtdy/cQKU\"",
		"mtime": "2026-11-16T08:00:14.023Z",
		"size": 14635,
		"path": "../public/assets/distributor-nRxTaCE9.js"
	},
	"/assets/eye-BfPbrsgb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-IbFLGPoki1Is4kuIb2xDtoQyrHQ\"",
		"mtime": "2026-11-16T08:00:14.023Z",
		"size": 250,
		"path": "../public/assets/eye-BfPbrsgb.js"
	},
	"/assets/eye-off-B7xzHT3s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-jgxeyDbB6kuSDJoyQnvl8NGEba4\"",
		"mtime": "2026-11-16T08:00:14.024Z",
		"size": 424,
		"path": "../public/assets/eye-off-B7xzHT3s.js"
	},
	"/assets/key-round-gGwsttWx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d-Uvzuu/9Q81RuKmsMJMMejQAZYn8\"",
		"mtime": "2026-11-16T08:00:14.027Z",
		"size": 349,
		"path": "../public/assets/key-round-gGwsttWx.js"
	},
	"/assets/generateCategoricalChart-qKkVggA_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bf64-JGVMw0se2pmP2jLKf3jy5HutdUA\"",
		"mtime": "2026-11-16T08:00:14.024Z",
		"size": 376676,
		"path": "../public/assets/generateCategoricalChart-qKkVggA_.js"
	},
	"/assets/index-B3fNk6Lc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cf76-lg8gNf5P2nv2SolOvzCel2ApcrM\"",
		"mtime": "2026-11-16T08:00:13.989Z",
		"size": 446326,
		"path": "../public/assets/index-B3fNk6Lc.js"
	},
	"/assets/KpiCard-CWRxpgbr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a09-gfB4KfEQ14XkZe0lP0Y37bz8w1E\"",
		"mtime": "2026-11-16T08:00:13.993Z",
		"size": 2569,
		"path": "../public/assets/KpiCard-CWRxpgbr.js"
	},
	"/assets/label-B7mpAxHt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-tMZXyxV7W9iTk1uv39n0ZagO/+k\"",
		"mtime": "2026-11-16T08:00:14.028Z",
		"size": 686,
		"path": "../public/assets/label-B7mpAxHt.js"
	},
	"/assets/layers-C21_E_Dw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-8az5bXQjhEYOypVdv09qhKkfxR4\"",
		"mtime": "2026-11-16T08:00:14.029Z",
		"size": 415,
		"path": "../public/assets/layers-C21_E_Dw.js"
	},
	"/assets/LineChart-DhBbxozU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45ac-gnADJPK3FZDCogi4pZ+GvEmwCuM\"",
		"mtime": "2026-11-16T08:00:13.994Z",
		"size": 17836,
		"path": "../public/assets/LineChart-DhBbxozU.js"
	},
	"/assets/login-LaJD-GIz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28f8-B02zA5m/vwtSqCAzXa0g5lt3dbQ\"",
		"mtime": "2026-11-16T08:00:14.030Z",
		"size": 10488,
		"path": "../public/assets/login-LaJD-GIz.js"
	},
	"/assets/map-pin-BjefMcmy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-pqkV7UrA7zpdNztF0abtoeCWf7E\"",
		"mtime": "2026-11-16T08:00:14.031Z",
		"size": 253,
		"path": "../public/assets/map-pin-BjefMcmy.js"
	},
	"/assets/notifications-Csi6u9hL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"392b-boDy7vgKmtat6Saz+fWOyc7zIRk\"",
		"mtime": "2026-11-16T08:00:14.032Z",
		"size": 14635,
		"path": "../public/assets/notifications-Csi6u9hL.js"
	},
	"/assets/PageHeader-UWMzMa68.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d3-nJa9VrR8j/V+3d05VcQAPsCQKLU\"",
		"mtime": "2026-11-16T08:00:13.995Z",
		"size": 1747,
		"path": "../public/assets/PageHeader-UWMzMa68.js"
	},
	"/assets/pencil-C7gX_4q5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e-PM4xFEYpfAb6ByBCQ5SbgoyW5Wc\"",
		"mtime": "2026-11-16T08:00:14.034Z",
		"size": 270,
		"path": "../public/assets/pencil-C7gX_4q5.js"
	},
	"/assets/plus-3f3pG-36.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-27XD2Q7ajdEu/zA/LNhJNvUfFW0\"",
		"mtime": "2026-11-16T08:00:14.036Z",
		"size": 147,
		"path": "../public/assets/plus-3f3pG-36.js"
	},
	"/assets/play-BtVnvdiz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138-jTWYgF0/G2F8dJRv3/jykZg6Rt8\"",
		"mtime": "2026-11-16T08:00:14.035Z",
		"size": 312,
		"path": "../public/assets/play-BtVnvdiz.js"
	},
	"/assets/nexus-icon-DUopGRoZ.png": {
		"type": "image/png",
		"etag": "\"64786-0l9UV8+WAjReu9luXxjwszOCPZw\"",
		"mtime": "2026-11-16T08:00:14.055Z",
		"size": 411526,
		"path": "../public/assets/nexus-icon-DUopGRoZ.png"
	},
	"/assets/privacy-tTCtbSW4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"996-HOcmMJq2fziUQY41qYw7937L1Yo\"",
		"mtime": "2026-11-16T08:00:14.036Z",
		"size": 2454,
		"path": "../public/assets/privacy-tTCtbSW4.js"
	},
	"/assets/profile-DDsa1423.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42b9-TOW+ssx2HnNF/zgUDO2npxTMliM\"",
		"mtime": "2026-11-16T08:00:14.038Z",
		"size": 17081,
		"path": "../public/assets/profile-DDsa1423.js"
	},
	"/assets/roles-sm5SR1Gz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3251-QFSgP+SGEslci1OJ/DG8HqrNWT8\"",
		"mtime": "2026-11-16T08:00:14.039Z",
		"size": 12881,
		"path": "../public/assets/roles-sm5SR1Gz.js"
	},
	"/assets/routes-CjfBm-cu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f891-g8Rc+Xg9ffI3h+In2lSeLD21+YM\"",
		"mtime": "2026-11-16T08:00:14.040Z",
		"size": 63633,
		"path": "../public/assets/routes-CjfBm-cu.js"
	},
	"/assets/save-Cv9HnbSw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-BtU9qFTfmp8MYqRQaxpMedweHzM\"",
		"mtime": "2026-11-16T08:00:14.041Z",
		"size": 321,
		"path": "../public/assets/save-Cv9HnbSw.js"
	},
	"/assets/select-78JF9yus.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5981-WfKjkxLd/PvwlR9p5dfXHQEV4Gk\"",
		"mtime": "2026-11-16T08:00:14.041Z",
		"size": 22913,
		"path": "../public/assets/select-78JF9yus.js"
	},
	"/assets/settings-jhZRTdLI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"62d0-RhzNPogx1fuS3XTWmXjvPbjJ/Xw\"",
		"mtime": "2026-11-16T08:00:14.041Z",
		"size": 25296,
		"path": "../public/assets/settings-jhZRTdLI.js"
	},
	"/assets/shield-off-b-KD28RM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"227-gvBDXdi6Ml9mXLY2HnWsH4Apw54\"",
		"mtime": "2026-11-16T08:00:14.044Z",
		"size": 551,
		"path": "../public/assets/shield-off-b-KD28RM.js"
	},
	"/assets/sliders-horizontal-CNhYDdWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-gXVKbIzBFkK0yNeXTDUB2r0i5h0\"",
		"mtime": "2026-11-16T08:00:14.045Z",
		"size": 418,
		"path": "../public/assets/sliders-horizontal-CNhYDdWR.js"
	},
	"/assets/sparkles-e-rjMA2Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e8-3AtMqL5mkeVEJ9PrRFunEs/K4Yg\"",
		"mtime": "2026-11-16T08:00:14.047Z",
		"size": 488,
		"path": "../public/assets/sparkles-e-rjMA2Y.js"
	},
	"/assets/StatusBadge-B-wguOBd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65f-mVXc8dZcGc2CFKqwxIJS6t6PuOw\"",
		"mtime": "2026-11-16T08:00:13.996Z",
		"size": 1631,
		"path": "../public/assets/StatusBadge-B-wguOBd.js"
	},
	"/assets/switch-DgkunCs7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112d-gWldSOt0Aa+gQL3BCStQJT4/xHg\"",
		"mtime": "2026-11-16T08:00:14.048Z",
		"size": 4397,
		"path": "../public/assets/switch-DgkunCs7.js"
	},
	"/assets/terms-DAS7ELOj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"983-4QkrvysPKWoGgYNcLFBknu9/27w\"",
		"mtime": "2026-11-16T08:00:14.049Z",
		"size": 2435,
		"path": "../public/assets/terms-DAS7ELOj.js"
	},
	"/assets/styles-C4P1lCQg.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1f2ad-inqRkGexCQ8zPjToStqJhjOaRD8\"",
		"mtime": "2026-11-16T08:00:14.056Z",
		"size": 127661,
		"path": "../public/assets/styles-C4P1lCQg.css"
	},
	"/assets/textarea-Dz8LdTHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5-voW0SzCqhM8Djtvbt6ht6h1gvKU\"",
		"mtime": "2026-11-16T08:00:14.050Z",
		"size": 485,
		"path": "../public/assets/textarea-Dz8LdTHK.js"
	},
	"/assets/use-crud-ui-BcyoUK-c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18e7-/fFpxtwrOpu1cudWGw9IIp1gwWE\"",
		"mtime": "2026-11-16T08:00:14.051Z",
		"size": 6375,
		"path": "../public/assets/use-crud-ui-BcyoUK-c.js"
	},
	"/assets/user-management-D01kVBZa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d76-Wdkm2/JE57OrmofBoqxb9H6Yn8U\"",
		"mtime": "2026-11-16T08:00:14.052Z",
		"size": 19830,
		"path": "../public/assets/user-management-D01kVBZa.js"
	},
	"/assets/zap-B_Ryctv8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-IJGdSWpyos1bc+1xpRn8xFAphN0\"",
		"mtime": "2026-11-16T08:00:14.054Z",
		"size": 256,
		"path": "../public/assets/zap-B_Ryctv8.js"
	}
};
// #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
// node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
// #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_X1oGqn = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_X1oGqn
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
// node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
// #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
// #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
// node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
// node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
// node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
export { cloudflare_module_default as default };
