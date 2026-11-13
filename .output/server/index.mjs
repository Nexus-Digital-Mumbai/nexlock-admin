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
	"/assets/activity-EDXp3idJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4-1E8D2janUwx1510qGW4QqG/BZI8\"",
		"mtime": "2026-11-13T07:37:08.440Z",
		"size": 228,
		"path": "../public/assets/activity-EDXp3idJ.js"
	},
	"/nexus-official-logo.png": {
		"type": "image/png",
		"etag": "\"3b7ca-3Ma8GFQGFEwQh9Eby7AHu1uZE5s\"",
		"mtime": "2026-11-13T06:59:53.628Z",
		"size": 243658,
		"path": "../public/nexus-official-logo.png"
	},
	"/assets/analytics-CfwcL8j8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fec-Osc0uFIW32PMgxlpuK+Zu9zDhR0\"",
		"mtime": "2026-11-13T07:37:08.440Z",
		"size": 8172,
		"path": "../public/assets/analytics-CfwcL8j8.js"
	},
	"/assets/api-client-DHofKpmk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2335f-WB3t3aiuYMpzHsiQVNzd/SRZXAA\"",
		"mtime": "2026-11-13T07:37:08.441Z",
		"size": 144223,
		"path": "../public/assets/api-client-DHofKpmk.js"
	},
	"/assets/apple-DQScnQls.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-H/39L5E2TJoGe38hLrZThXf33CQ\"",
		"mtime": "2026-11-13T07:37:08.441Z",
		"size": 308,
		"path": "../public/assets/apple-DQScnQls.js"
	},
	"/assets/arrow-left-B7agOFJb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-SWonRZk7iBhfWGE8yo+idckAH7E\"",
		"mtime": "2026-11-13T07:37:08.442Z",
		"size": 159,
		"path": "../public/assets/arrow-left-B7agOFJb.js"
	},
	"/assets/button-DK_FWIUK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1331-2VNCibzkvF8dulyn2D+EkJNZ+Xo\"",
		"mtime": "2026-11-13T07:37:08.443Z",
		"size": 4913,
		"path": "../public/assets/button-DK_FWIUK.js"
	},
	"/assets/building-2-DgxLbsBB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179-ixSHjhTxVuV/hs5RISwCK6fWAWU\"",
		"mtime": "2026-11-13T07:37:08.442Z",
		"size": 377,
		"path": "../public/assets/building-2-DgxLbsBB.js"
	},
	"/assets/calendar-CBeKjwd0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-elISBUyzqAjTLMGr1Npyrspxzv4\"",
		"mtime": "2026-11-13T07:37:08.444Z",
		"size": 251,
		"path": "../public/assets/calendar-CBeKjwd0.js"
	},
	"/assets/checkbox-DxWujMK-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e8-NOaKd/hAk5u0EByUZY8sQCFKmlo\"",
		"mtime": "2026-11-13T07:37:08.444Z",
		"size": 4584,
		"path": "../public/assets/checkbox-DxWujMK-.js"
	},
	"/assets/chevron-up-kGaNULPo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-FnygKumNJ6/mex8P6EMp+AotdsU\"",
		"mtime": "2026-11-13T07:37:08.445Z",
		"size": 122,
		"path": "../public/assets/chevron-up-kGaNULPo.js"
	},
	"/assets/circle-check-CtvwBKBo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac-cSTyZxLa1iVZMv1cvHJWMMgJK+o\"",
		"mtime": "2026-11-13T07:37:08.445Z",
		"size": 172,
		"path": "../public/assets/circle-check-CtvwBKBo.js"
	},
	"/assets/ConfirmDialog-BZqlmSvR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134b-/sKtikUL1ad+aMYI2vnsMYb4ia0\"",
		"mtime": "2026-11-13T07:37:08.436Z",
		"size": 4939,
		"path": "../public/assets/ConfirmDialog-BZqlmSvR.js"
	},
	"/assets/copy-D8saP5bR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-EtKDiFeYfuxeC6xyXV9pHcclU3s\"",
		"mtime": "2026-11-13T07:37:08.446Z",
		"size": 230,
		"path": "../public/assets/copy-D8saP5bR.js"
	},
	"/assets/customers-Cpt4Z6bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f4a-QBfrA7+zg55OLjJP61kH9vydj2k\"",
		"mtime": "2026-11-13T07:37:08.447Z",
		"size": 12106,
		"path": "../public/assets/customers-Cpt4Z6bX.js"
	},
	"/assets/DataTable-CMI50cLq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d26-joCE8baGFqrh1EDkMGMpDLV/w5w\"",
		"mtime": "2026-11-13T07:37:08.438Z",
		"size": 15654,
		"path": "../public/assets/DataTable-CMI50cLq.js"
	},
	"/assets/dealers-y2ejbHtS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d20-5qKSxsi6ToqxIHuCgbu1ODmzn5k\"",
		"mtime": "2026-11-13T07:37:08.448Z",
		"size": 15648,
		"path": "../public/assets/dealers-y2ejbHtS.js"
	},
	"/assets/devices-DAp33z_N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73a1-HCGNUfTr4veU1j9JRJ82ed/M90Y\"",
		"mtime": "2026-11-13T07:37:08.449Z",
		"size": 29601,
		"path": "../public/assets/devices-DAp33z_N.js"
	},
	"/assets/dialog-BOZ9_OAh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"807-ymoZzY2iH9w8ujP2nA2zDjP//Xo\"",
		"mtime": "2026-11-13T07:37:08.450Z",
		"size": 2055,
		"path": "../public/assets/dialog-BOZ9_OAh.js"
	},
	"/assets/dist-CA4jXPIQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b8b-B0G5rsDBHkH3/OW8aEQhaPoOMJ4\"",
		"mtime": "2026-11-13T07:37:08.450Z",
		"size": 7051,
		"path": "../public/assets/dist-CA4jXPIQ.js"
	},
	"/assets/distributor-analytics-iyBWX5BP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1607-2Xa1ZcNLRW2Py1n802mNwtq1CZc\"",
		"mtime": "2026-11-13T07:37:08.451Z",
		"size": 5639,
		"path": "../public/assets/distributor-analytics-iyBWX5BP.js"
	},
	"/assets/distributor-billing-kP2zd7ST.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1855-LxE51UGx2Mc/6CMlEOx1kwVmyYA\"",
		"mtime": "2026-11-13T07:37:08.451Z",
		"size": 6229,
		"path": "../public/assets/distributor-billing-kP2zd7ST.js"
	},
	"/assets/distributor-C_QBnM4q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"392b-6+DcaKizJkPobZ256wQMPX23aPQ\"",
		"mtime": "2026-11-13T07:37:08.450Z",
		"size": 14635,
		"path": "../public/assets/distributor-C_QBnM4q.js"
	},
	"/Dashboard-Background.png": {
		"type": "image/png",
		"etag": "\"8a063-uaDCaEUwlsEgnQ4M+J7PW/IIoKE\"",
		"mtime": "2026-11-13T06:59:12.954Z",
		"size": 565347,
		"path": "../public/Dashboard-Background.png"
	},
	"/nexus-dashboard-reference.png": {
		"type": "image/png",
		"etag": "\"14cc66-gS4J5t4SqT0vneIuQJXyiGv52UI\"",
		"mtime": "2026-11-13T06:59:37.749Z",
		"size": 1363046,
		"path": "../public/nexus-dashboard-reference.png"
	},
	"/assets/distributor-login-BWhhZwXF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2026-q7/l9vMHcdiZC9RDrqTuIhp9vpE\"",
		"mtime": "2026-11-13T07:37:08.452Z",
		"size": 8230,
		"path": "../public/assets/distributor-login-BWhhZwXF.js"
	},
	"/assets/eye-D7AWfPGV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-871rgs7I1M4o1cammEk71zjtD/4\"",
		"mtime": "2026-11-13T07:37:08.452Z",
		"size": 250,
		"path": "../public/assets/eye-D7AWfPGV.js"
	},
	"/assets/key-round-BvSWQibd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d-1mwR8/5gzjWrMn7cU+yPJ1Pflfk\"",
		"mtime": "2026-11-13T07:37:08.457Z",
		"size": 349,
		"path": "../public/assets/key-round-BvSWQibd.js"
	},
	"/assets/generateCategoricalChart-CzvK7Cg1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bf64-kYi8YdWLF10xq8pOxTnOaB3O/WA\"",
		"mtime": "2026-11-13T07:37:08.453Z",
		"size": 376676,
		"path": "../public/assets/generateCategoricalChart-CzvK7Cg1.js"
	},
	"/assets/index-CHq1O_Cy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bb75-2comjw/8VmbPpjadxqNNAmEmo5c\"",
		"mtime": "2026-11-13T07:37:08.436Z",
		"size": 441205,
		"path": "../public/assets/index-CHq1O_Cy.js"
	},
	"/assets/eye-off-Csl1fMcp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-uyUxH8AskhaVowhQ2CUwyfHnWVc\"",
		"mtime": "2026-11-13T07:37:08.452Z",
		"size": 424,
		"path": "../public/assets/eye-off-Csl1fMcp.js"
	},
	"/assets/KpiCard-hQeYjvnG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b28-s8OYNzeCsURIF4q0g90hPfSzZr8\"",
		"mtime": "2026-11-13T07:37:08.438Z",
		"size": 2856,
		"path": "../public/assets/KpiCard-hQeYjvnG.js"
	},
	"/assets/label-B0ARA0gX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-x0ZnQnbX3lcd04tX7I0UT/hnmWY\"",
		"mtime": "2026-11-13T07:37:08.458Z",
		"size": 686,
		"path": "../public/assets/label-B0ARA0gX.js"
	},
	"/assets/layers-_KpuF6FR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-hRInAN2qpnmW0vCi7qOaiyW2sUo\"",
		"mtime": "2026-11-13T07:37:08.458Z",
		"size": 415,
		"path": "../public/assets/layers-_KpuF6FR.js"
	},
	"/assets/LineChart-DcBo31nd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45ac-ADNIY+x9DGTjw3DnJ4ipjIUYiTc\"",
		"mtime": "2026-11-13T07:37:08.439Z",
		"size": 17836,
		"path": "../public/assets/LineChart-DcBo31nd.js"
	},
	"/assets/lock-open-B-1WKyn1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc-VW4wviI4yPaUfcq+DckVumhFfg4\"",
		"mtime": "2026-11-13T07:37:08.459Z",
		"size": 204,
		"path": "../public/assets/lock-open-B-1WKyn1.js"
	},
	"/assets/map-pin-D7wyeCoI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-eKmQxo8mQyhU5siQ7hznVFKDvik\"",
		"mtime": "2026-11-13T07:37:08.460Z",
		"size": 253,
		"path": "../public/assets/map-pin-D7wyeCoI.js"
	},
	"/assets/login-RsYM73P8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25f8-fHUxYmNp+XoXreFTGsRofGpiYp8\"",
		"mtime": "2026-11-13T07:37:08.459Z",
		"size": 9720,
		"path": "../public/assets/login-RsYM73P8.js"
	},
	"/assets/notifications-Gqrxd-Pn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3973-lTHfR6OLeLqGbgEbVuzh4M3xE6E\"",
		"mtime": "2026-11-13T07:37:08.460Z",
		"size": 14707,
		"path": "../public/assets/notifications-Gqrxd-Pn.js"
	},
	"/assets/PageHeader-D03SJyI-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"681-Z+XbPHrTij/VTeL1G0yQhmVlHVk\"",
		"mtime": "2026-11-13T07:37:08.439Z",
		"size": 1665,
		"path": "../public/assets/PageHeader-D03SJyI-.js"
	},
	"/assets/nexlock-logo-D-35vrbC.jpeg": {
		"type": "image/jpeg",
		"etag": "\"1a4d2-rtUKTi4smIfOQ5jRMfGbDwHCIgc\"",
		"mtime": "2026-11-13T07:37:08.473Z",
		"size": 107730,
		"path": "../public/assets/nexlock-logo-D-35vrbC.jpeg"
	},
	"/assets/pencil-DttxLK2Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e-MEr4nJwhhqyZGLXVPSIFO0htFVM\"",
		"mtime": "2026-11-13T07:37:08.460Z",
		"size": 270,
		"path": "../public/assets/pencil-DttxLK2Z.js"
	},
	"/assets/play-C1NQV5mr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138-EOsmELTh3yrBjCbcuDHjDb3dGJE\"",
		"mtime": "2026-11-13T07:37:08.461Z",
		"size": 312,
		"path": "../public/assets/play-C1NQV5mr.js"
	},
	"/assets/plus-CQNZcoyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-72F1Lta1iOFGOqupTupvP/7MJ+Y\"",
		"mtime": "2026-11-13T07:37:08.462Z",
		"size": 147,
		"path": "../public/assets/plus-CQNZcoyr.js"
	},
	"/assets/privacy-CoMOoDqg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"996-1RSgv4ZZfqX/gkZh38Sf7s3vdM4\"",
		"mtime": "2026-11-13T07:37:08.462Z",
		"size": 2454,
		"path": "../public/assets/privacy-CoMOoDqg.js"
	},
	"/assets/profile-CQICigAT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42a7-J0oLs+0Mg0zCc0N8xY9hCS6vSpQ\"",
		"mtime": "2026-11-13T07:37:08.463Z",
		"size": 17063,
		"path": "../public/assets/profile-CQICigAT.js"
	},
	"/assets/roles-RD4_Sa8N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327d-hq6VTq7nFebJ+TzjtJ/wbPOZI7E\"",
		"mtime": "2026-11-13T07:37:08.464Z",
		"size": 12925,
		"path": "../public/assets/roles-RD4_Sa8N.js"
	},
	"/assets/routes-B5SzKWM0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e311-Z1MheCOwE5+h/Chn6NBE8er1wtU\"",
		"mtime": "2026-11-13T07:37:08.466Z",
		"size": 58129,
		"path": "../public/assets/routes-B5SzKWM0.js"
	},
	"/assets/save-C0QLWq64.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-vylFqVX1Fa6ZbisGG5EuzuF7TBg\"",
		"mtime": "2026-11-13T07:37:08.466Z",
		"size": 321,
		"path": "../public/assets/save-C0QLWq64.js"
	},
	"/assets/select-X2KFg9q6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5981-CrCjsnnJNzVn51Pf6N/me9iYX5I\"",
		"mtime": "2026-11-13T07:37:08.467Z",
		"size": 22913,
		"path": "../public/assets/select-X2KFg9q6.js"
	},
	"/assets/settings-DmMPXHTI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"62d0-f0rimDgylDJK0EOuuonzxRJ7Uic\"",
		"mtime": "2026-11-13T07:37:08.467Z",
		"size": 25296,
		"path": "../public/assets/settings-DmMPXHTI.js"
	},
	"/assets/sliders-horizontal-HnUMrLv1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-zj5QA+/+wQOqP3cFpy9E6otmeCg\"",
		"mtime": "2026-11-13T07:37:08.468Z",
		"size": 418,
		"path": "../public/assets/sliders-horizontal-HnUMrLv1.js"
	},
	"/assets/StatusBadge-UVzMJhbN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65f-Wffk4kjI1GzQ41AwB22cWk3aUxI\"",
		"mtime": "2026-11-13T07:37:08.440Z",
		"size": 1631,
		"path": "../public/assets/StatusBadge-UVzMJhbN.js"
	},
	"/assets/styles-s6YZMD_s.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1c5f0-zgagAhnOmRvMwebiPQ0AK2PQwPY\"",
		"mtime": "2026-11-13T07:37:08.473Z",
		"size": 116208,
		"path": "../public/assets/styles-s6YZMD_s.css"
	},
	"/assets/switch-CR1AN8j-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112d-fzcMVjLTBlJw3mWkr9Coh6MtYzw\"",
		"mtime": "2026-11-13T07:37:08.469Z",
		"size": 4397,
		"path": "../public/assets/switch-CR1AN8j-.js"
	},
	"/assets/terms-RNWjcV6P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"983-PAc/qPt4UlZbelApTC+019my7PI\"",
		"mtime": "2026-11-13T07:37:08.470Z",
		"size": 2435,
		"path": "../public/assets/terms-RNWjcV6P.js"
	},
	"/assets/textarea-CkCgIDZ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5-lm/k/WctVTst2sGQtpXPoQPSIhM\"",
		"mtime": "2026-11-13T07:37:08.470Z",
		"size": 485,
		"path": "../public/assets/textarea-CkCgIDZ2.js"
	},
	"/assets/sparkles-BCF6BjRz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e8-A3r50q2XZQIkdFPAdGCoVe04JF0\"",
		"mtime": "2026-11-13T07:37:08.469Z",
		"size": 488,
		"path": "../public/assets/sparkles-BCF6BjRz.js"
	},
	"/assets/user-management-BR0S0j9A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4dee-ZdyCZqQsTKj3uuoj2XIyL1y2L1w\"",
		"mtime": "2026-11-13T07:37:08.472Z",
		"size": 19950,
		"path": "../public/assets/user-management-BR0S0j9A.js"
	},
	"/assets/zap-BTT_T52p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-x86DZJyjG2+ezZ5IILUgb+dAvaw\"",
		"mtime": "2026-11-13T07:37:08.472Z",
		"size": 256,
		"path": "../public/assets/zap-BTT_T52p.js"
	},
	"/assets/use-crud-ui-CZrw3P2Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"190b-fU+XNpinb+2WIIyoTnYoLiEF7zo\"",
		"mtime": "2026-11-13T07:37:08.471Z",
		"size": 6411,
		"path": "../public/assets/use-crud-ui-CZrw3P2Y.js"
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
