const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","orangesand.jpg","organesand.jpg","sand.jpg","sands.jpg","sandsand.jpg","seamless-sand.jpg","sundial.png"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.BSzrFVmx.js","app":"_app/immutable/entry/app.enc5IMH7.js","imports":["_app/immutable/entry/start.BSzrFVmx.js","_app/immutable/chunks/entry.DwOxhQln.js","_app/immutable/chunks/scheduler.5u_Fi6NP.js","_app/immutable/entry/app.enc5IMH7.js","_app/immutable/chunks/scheduler.5u_Fi6NP.js","_app/immutable/chunks/index.DN1ak2ji.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-BwOhcK1P.js')),
			__memo(() => import('./chunks/1-lEhGM4hR.js')),
			__memo(() => import('./chunks/2-BWLd8QTF.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
