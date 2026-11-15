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
	"/nexus-official-logo.png": {
		"type": "image/png",
		"etag": "\"3b7ca-3Ma8GFQGFEwQh9Eby7AHu1uZE5s\"",
		"mtime": "2026-11-13T06:59:53.628Z",
		"size": 243658,
		"path": "../public/nexus-official-logo.png"
	},
	"/assets/activity-f0Inv4sm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4-FA60YqW2vE1AOvxPYw+2iuHPNaQ\"",
		"mtime": "2026-11-15T17:39:05.297Z",
		"size": 228,
		"path": "../public/assets/activity-f0Inv4sm.js"
	},
	"/assets/analytics-C2WTRzCz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fec-3n9mnPEJ5CGpIOV2tEdC7vwyUEY\"",
		"mtime": "2026-11-15T17:39:05.297Z",
		"size": 8172,
		"path": "../public/assets/analytics-C2WTRzCz.js"
	},
	"/nexus-icon.png": {
		"type": "image/png",
		"etag": "\"64786-0l9UV8+WAjReu9luXxjwszOCPZw\"",
		"mtime": "2026-11-15T17:01:45.050Z",
		"size": 411526,
		"path": "../public/nexus-icon.png"
	},
	"/assets/apple-DgcVrhqL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-6vzB2Uejno2b3O8GfuddDKWyvKg\"",
		"mtime": "2026-11-15T17:39:05.299Z",
		"size": 308,
		"path": "../public/assets/apple-DgcVrhqL.js"
	},
	"/assets/api-client-BYLBHlrT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23317-iroAhc8G2AIP4XEayIVXR0ALRc4\"",
		"mtime": "2026-11-15T17:39:05.297Z",
		"size": 144151,
		"path": "../public/assets/api-client-BYLBHlrT.js"
	},
	"/assets/arrow-left-ll4X2Wf3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-72euIpSRuHQbJaz/uoxBwNjIeVI\"",
		"mtime": "2026-11-15T17:39:05.299Z",
		"size": 159,
		"path": "../public/assets/arrow-left-ll4X2Wf3.js"
	},
	"/assets/building-2-guXpWM1n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179-pbRYHa4+5rDTiiFyXVuA5F71aBE\"",
		"mtime": "2026-11-15T17:39:05.299Z",
		"size": 377,
		"path": "../public/assets/building-2-guXpWM1n.js"
	},
	"/assets/button-BsVySrTj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1331-6XU2Olh4sTSbu9SvGTPZ63D2Irk\"",
		"mtime": "2026-11-15T17:39:05.299Z",
		"size": 4913,
		"path": "../public/assets/button-BsVySrTj.js"
	},
	"/assets/calendar-BcNrn_Tn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-D+kGTULxmcTNDBIHJMUgaglAMr0\"",
		"mtime": "2026-11-15T17:39:05.300Z",
		"size": 251,
		"path": "../public/assets/calendar-BcNrn_Tn.js"
	},
	"/assets/checkbox-DWs2NJXT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e8-ivctuebFlAvHdS9K8G4VW9vl1vQ\"",
		"mtime": "2026-11-15T17:39:05.300Z",
		"size": 4584,
		"path": "../public/assets/checkbox-DWs2NJXT.js"
	},
	"/assets/chevron-up-8gf-1Iao.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-8OupqEcJ2dvSfjm8+jMX0KxlWvA\"",
		"mtime": "2026-11-15T17:39:05.300Z",
		"size": 122,
		"path": "../public/assets/chevron-up-8gf-1Iao.js"
	},
	"/assets/circle-check-CmZ3EBVV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac-jbl1iUEEXw3BrGTWhrUPlYEpnxc\"",
		"mtime": "2026-11-15T17:39:05.301Z",
		"size": 172,
		"path": "../public/assets/circle-check-CmZ3EBVV.js"
	},
	"/assets/ConfirmDialog-D5_-jS6X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134b-mmVUbW/aZOLaTIRCVyywLvsrK9Q\"",
		"mtime": "2026-11-15T17:39:05.294Z",
		"size": 4939,
		"path": "../public/assets/ConfirmDialog-D5_-jS6X.js"
	},
	"/assets/copy-DmfgSYo1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-d3cZeOl30kWSmjOR0Dx9A5eUvFg\"",
		"mtime": "2026-11-15T17:39:05.301Z",
		"size": 230,
		"path": "../public/assets/copy-DmfgSYo1.js"
	},
	"/assets/customers-Dohii2T2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f4a-ZyfV0ZKMTTey7EuAcAkpXxtb4NM\"",
		"mtime": "2026-11-15T17:39:05.301Z",
		"size": 12106,
		"path": "../public/assets/customers-Dohii2T2.js"
	},
	"/assets/DataTable-D8f69OwU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d26-4ESzHV0zBNllfADMJ1sccb+pBWM\"",
		"mtime": "2026-11-15T17:39:05.295Z",
		"size": 15654,
		"path": "../public/assets/DataTable-D8f69OwU.js"
	},
	"/assets/dealers-1aRizbZu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d20-O8NNYHAd2w+BG1LlJgKZLX9yy84\"",
		"mtime": "2026-11-15T17:39:05.302Z",
		"size": 15648,
		"path": "../public/assets/dealers-1aRizbZu.js"
	},
	"/assets/dialog-D9P7lhTQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"807-b1KQyBErjPT7w6hKFVU8/6NNTmI\"",
		"mtime": "2026-11-15T17:39:05.302Z",
		"size": 2055,
		"path": "../public/assets/dialog-D9P7lhTQ.js"
	},
	"/assets/devices-3emQ4G2e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"725a-zzcbaxhrc/TJMMULBwMFSgKKxwM\"",
		"mtime": "2026-11-15T17:39:05.302Z",
		"size": 29274,
		"path": "../public/assets/devices-3emQ4G2e.js"
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
		"mtime": "2026-11-15T17:39:05.303Z",
		"size": 7051,
		"path": "../public/assets/dist-CSH6NUJt.js"
	},
	"/assets/distributor-analytics-1tgVlFRm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1607-7/Pl+7zdFlUB2sFnywDOVFQ8fjM\"",
		"mtime": "2026-11-15T17:39:05.303Z",
		"size": 5639,
		"path": "../public/assets/distributor-analytics-1tgVlFRm.js"
	},
	"/assets/distributor-billing-ClH8ugEm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1855-eepUWSGZdUfqVK9C/oWKnRPz17g\"",
		"mtime": "2026-11-15T17:39:05.304Z",
		"size": 6229,
		"path": "../public/assets/distributor-billing-ClH8ugEm.js"
	},
	"/assets/distributor-CabOUiP_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"392b-dYfuknvwGZ5x6RIXPLn5U4RObJs\"",
		"mtime": "2026-11-15T17:39:05.303Z",
		"size": 14635,
		"path": "../public/assets/distributor-CabOUiP_.js"
	},
	"/assets/distributor-login-DKTTHyHF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fee-743JGVTMv/e9e3r6CbTua2Ac5rg\"",
		"mtime": "2026-11-15T17:39:05.304Z",
		"size": 8174,
		"path": "../public/assets/distributor-login-DKTTHyHF.js"
	},
	"/assets/eye-BfPbrsgb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-IbFLGPoki1Is4kuIb2xDtoQyrHQ\"",
		"mtime": "2026-11-15T17:39:05.305Z",
		"size": 250,
		"path": "../public/assets/eye-BfPbrsgb.js"
	},
	"/assets/eye-off-B7xzHT3s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-jgxeyDbB6kuSDJoyQnvl8NGEba4\"",
		"mtime": "2026-11-15T17:39:05.305Z",
		"size": 424,
		"path": "../public/assets/eye-off-B7xzHT3s.js"
	},
	"/assets/key-round-gGwsttWx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d-Uvzuu/9Q81RuKmsMJMMejQAZYn8\"",
		"mtime": "2026-11-15T17:39:05.306Z",
		"size": 349,
		"path": "../public/assets/key-round-gGwsttWx.js"
	},
	"/assets/generateCategoricalChart-qKkVggA_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bf64-JGVMw0se2pmP2jLKf3jy5HutdUA\"",
		"mtime": "2026-11-15T17:39:05.305Z",
		"size": 376676,
		"path": "../public/assets/generateCategoricalChart-qKkVggA_.js"
	},
	"/assets/KpiCard-BRQJp67_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b24-TvAwHgc5aWwy3VdkawO4qlJrN1I\"",
		"mtime": "2026-11-15T17:39:05.295Z",
		"size": 2852,
		"path": "../public/assets/KpiCard-BRQJp67_.js"
	},
	"/assets/label-Yv-4okBd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-dAgTw1rv7RsVU1V06xsIBrNj4ks\"",
		"mtime": "2026-11-15T17:39:05.306Z",
		"size": 686,
		"path": "../public/assets/label-Yv-4okBd.js"
	},
	"/assets/index-YLjK9k2q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6be14-umKWUSkP5o+rdLseljGIAS3d2BM\"",
		"mtime": "2026-11-15T17:39:05.294Z",
		"size": 441876,
		"path": "../public/assets/index-YLjK9k2q.js"
	},
	"/assets/layers-C21_E_Dw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-8az5bXQjhEYOypVdv09qhKkfxR4\"",
		"mtime": "2026-11-15T17:39:05.306Z",
		"size": 415,
		"path": "../public/assets/layers-C21_E_Dw.js"
	},
	"/assets/LineChart-DhBbxozU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45ac-gnADJPK3FZDCogi4pZ+GvEmwCuM\"",
		"mtime": "2026-11-15T17:39:05.296Z",
		"size": 17836,
		"path": "../public/assets/LineChart-DhBbxozU.js"
	},
	"/assets/login-DjCXNyc1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25ce-jEBgjaf2CL2dBnkGl8WvJy4Xwzk\"",
		"mtime": "2026-11-15T17:39:05.307Z",
		"size": 9678,
		"path": "../public/assets/login-DjCXNyc1.js"
	},
	"/assets/map-pin-BjefMcmy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-pqkV7UrA7zpdNztF0abtoeCWf7E\"",
		"mtime": "2026-11-15T17:39:05.307Z",
		"size": 253,
		"path": "../public/assets/map-pin-BjefMcmy.js"
	},
	"/assets/notifications-ud0MdFKT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3973-QdanoA6Kd0+ynlUPr1B2P3ULfHc\"",
		"mtime": "2026-11-15T17:39:05.307Z",
		"size": 14707,
		"path": "../public/assets/notifications-ud0MdFKT.js"
	},
	"/assets/PageHeader-B8LLfUwK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"681-4++TD+wqO7P5y3tcDkjEag7QF1Q\"",
		"mtime": "2026-11-15T17:39:05.296Z",
		"size": 1665,
		"path": "../public/assets/PageHeader-B8LLfUwK.js"
	},
	"/assets/pencil-C7gX_4q5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e-PM4xFEYpfAb6ByBCQ5SbgoyW5Wc\"",
		"mtime": "2026-11-15T17:39:05.307Z",
		"size": 270,
		"path": "../public/assets/pencil-C7gX_4q5.js"
	},
	"/assets/play-BtVnvdiz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138-jTWYgF0/G2F8dJRv3/jykZg6Rt8\"",
		"mtime": "2026-11-15T17:39:05.308Z",
		"size": 312,
		"path": "../public/assets/play-BtVnvdiz.js"
	},
	"/assets/nexus-icon-DUopGRoZ.png": {
		"type": "image/png",
		"etag": "\"64786-0l9UV8+WAjReu9luXxjwszOCPZw\"",
		"mtime": "2026-11-15T17:39:05.330Z",
		"size": 411526,
		"path": "../public/assets/nexus-icon-DUopGRoZ.png"
	},
	"/assets/plus-3f3pG-36.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-27XD2Q7ajdEu/zA/LNhJNvUfFW0\"",
		"mtime": "2026-11-15T17:39:05.308Z",
		"size": 147,
		"path": "../public/assets/plus-3f3pG-36.js"
	},
	"/assets/privacy-BMviyKrE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"996-sHFzZspWLun0NR7zBwicuMHHoSo\"",
		"mtime": "2026-11-15T17:39:05.308Z",
		"size": 2454,
		"path": "../public/assets/privacy-BMviyKrE.js"
	},
	"/assets/profile-5vzKMb6n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42a7-8GAEdDlYAZ4ZiL7mxOlT5rHhPlw\"",
		"mtime": "2026-11-15T17:39:05.309Z",
		"size": 17063,
		"path": "../public/assets/profile-5vzKMb6n.js"
	},
	"/assets/roles-Du7g0Iqo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327d-1Cbwr/wXY4no3A/jLHR7bOeb1kI\"",
		"mtime": "2026-11-15T17:39:05.309Z",
		"size": 12925,
		"path": "../public/assets/roles-Du7g0Iqo.js"
	},
	"/assets/routes-C1LIUCdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed1b-WgdUgioJSFs/H+j4rrs5Udz7RPg\"",
		"mtime": "2026-11-15T17:39:05.309Z",
		"size": 60699,
		"path": "../public/assets/routes-C1LIUCdZ.js"
	},
	"/assets/save-Cv9HnbSw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-BtU9qFTfmp8MYqRQaxpMedweHzM\"",
		"mtime": "2026-11-15T17:39:05.309Z",
		"size": 321,
		"path": "../public/assets/save-Cv9HnbSw.js"
	},
	"/assets/select-CfXHXYdn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5981-6oIbYY6nXwTNb+SzkQvksDH8gRY\"",
		"mtime": "2026-11-15T17:39:05.311Z",
		"size": 22913,
		"path": "../public/assets/select-CfXHXYdn.js"
	},
	"/assets/settings-BXDV70Ah.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"62d0-zzBt/aQMJnL3Tw0+BAOMohTHoOw\"",
		"mtime": "2026-11-15T17:39:05.311Z",
		"size": 25296,
		"path": "../public/assets/settings-BXDV70Ah.js"
	},
	"/assets/shield-off-b-KD28RM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"227-gvBDXdi6Ml9mXLY2HnWsH4Apw54\"",
		"mtime": "2026-11-15T17:39:05.312Z",
		"size": 551,
		"path": "../public/assets/shield-off-b-KD28RM.js"
	},
	"/assets/sliders-horizontal-CNhYDdWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-gXVKbIzBFkK0yNeXTDUB2r0i5h0\"",
		"mtime": "2026-11-15T17:39:05.312Z",
		"size": 418,
		"path": "../public/assets/sliders-horizontal-CNhYDdWR.js"
	},
	"/assets/StatusBadge-B-wguOBd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65f-mVXc8dZcGc2CFKqwxIJS6t6PuOw\"",
		"mtime": "2026-11-15T17:39:05.297Z",
		"size": 1631,
		"path": "../public/assets/StatusBadge-B-wguOBd.js"
	},
	"/assets/sparkles-e-rjMA2Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e8-3AtMqL5mkeVEJ9PrRFunEs/K4Yg\"",
		"mtime": "2026-11-15T17:39:05.312Z",
		"size": 488,
		"path": "../public/assets/sparkles-e-rjMA2Y.js"
	},
	"/assets/switch-BjMbWhRK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112d-IoTQ7NbhUSwN4GYjy/yBBN6Hu3U\"",
		"mtime": "2026-11-15T17:39:05.312Z",
		"size": 4397,
		"path": "../public/assets/switch-BjMbWhRK.js"
	},
	"/assets/terms-DJuSOx_d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"983-3bkh5+IThCf791xYBPkJ1VpKwHs\"",
		"mtime": "2026-11-15T17:39:05.313Z",
		"size": 2435,
		"path": "../public/assets/terms-DJuSOx_d.js"
	},
	"/assets/styles-Zap2W3Ei.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1c7c4-/ndDMBKgLGIRhx4sc99wqljw3Is\"",
		"mtime": "2026-11-15T17:39:05.331Z",
		"size": 116676,
		"path": "../public/assets/styles-Zap2W3Ei.css"
	},
	"/assets/textarea-Dz8LdTHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5-voW0SzCqhM8Djtvbt6ht6h1gvKU\"",
		"mtime": "2026-11-15T17:39:05.313Z",
		"size": 485,
		"path": "../public/assets/textarea-Dz8LdTHK.js"
	},
	"/assets/use-crud-ui-BmutPbd2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"190b-GodlP/W2SJbIm4h0VR4yeRd8tFI\"",
		"mtime": "2026-11-15T17:39:05.314Z",
		"size": 6411,
		"path": "../public/assets/use-crud-ui-BmutPbd2.js"
	},
	"/assets/user-management-ConKTsOV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4dee-bcP2q+5Na/FNGWoQR+jo4LJiN0Y\"",
		"mtime": "2026-11-15T17:39:05.323Z",
		"size": 19950,
		"path": "../public/assets/user-management-ConKTsOV.js"
	},
	"/assets/zap-B_Ryctv8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-IJGdSWpyos1bc+1xpRn8xFAphN0\"",
		"mtime": "2026-11-15T17:39:05.329Z",
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
