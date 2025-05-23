( () => {
    var f = self.Ultraviolet
      , S = ["cross-origin-embedder-policy", "cross-origin-opener-policy", "cross-origin-resource-policy", "content-security-policy", "content-security-policy-report-only", "expect-ct", "feature-policy", "origin-isolation", "strict-transport-security", "upgrade-insecure-requests", "x-content-type-options", "x-download-options", "x-frame-options", "x-permitted-cross-domain-policies", "x-powered-by", "x-xss-protection"]
      , C = ["GET", "HEAD"]
      , g = class extends f.EventEmitter {
        constructor(t=__uv$config) {
            super(),
            t.bare || (t.bare = "/bare/"),
            t.prefix || (t.prefix = "/service/"),
            this.config = t;
            let i = (Array.isArray(t.bare) ? t.bare : [t.bare]).map(e => new URL(e,location).toString());
            this.address = i[~~(Math.random() * i.length)],
            this.bareClient = new f.BareClient(this.address)
        }
        async fetch({request: t}) {
            let i;
            try {
                if (!t.url.startsWith(location.origin + this.config.prefix))
                    return await fetch(t);
                let e = new f(this.config,this.address);
                typeof this.config.construct == "function" && this.config.construct(e, "service");
                let a = await e.cookie.db();
                e.meta.origin = location.origin,
                e.meta.base = e.meta.url = new URL(e.sourceUrl(t.url));
                let r = new w(t,this,e,C.includes(t.method.toUpperCase()) ? null : await t.blob());
                if (e.meta.url.protocol === "blob:" && (r.blob = !0,
                r.base = r.url = new URL(r.url.pathname)),
                t.referrer && t.referrer.startsWith(location.origin)) {
                    let s = new URL(e.sourceUrl(t.referrer));
                    (r.headers.origin || e.meta.url.origin !== s.origin && t.mode === "cors") && (r.headers.origin = s.origin),
                    r.headers.referer = s.href
                }
                let c = await e.cookie.getCookies(a) || []
                  , d = e.cookie.serialize(c, e.meta, !1);
                r.headers["user-agent"] = navigator.userAgent,
                d && (r.headers.cookie = d);
                let p = new m(r,null,null);
                if (this.emit("request", p),
                p.intercepted)
                    return p.returnValue;
                i = r.blob ? "blob:" + location.origin + r.url.pathname : r.url;
                let b = new Request(i,{
                    headers: r.headers,
                    method: r.method,
                    body: r.body,
                    credentials: r.credentials,
                    mode: location.origin !== r.address.origin ? "cors" : r.mode,
                    cache: r.cache,
                    redirect: r.redirect
                });
                if (typeof this.config.middleware == "function") {
                    let s = this.config.middleware(b);
                    if (s instanceof Response)
                        return s;
                    s instanceof Request && (b = s)
                }
                let u = await this.bareClient.fetch(b, {
                    headers: r.headers,
                    method: r.method,
                    body: r.body,
                    credentials: r.credentials,
                    mode: location.origin !== r.address.origin ? "cors" : r.mode,
                    cache: r.cache,
                    redirect: r.redirect
                })
                  , o = new v(r,u)
                  , h = new m(o,null,null);
                if (this.emit("beforemod", h),
                h.intercepted)
                    return h.returnValue;
                for (let s of S)
                    o.headers[s] && delete o.headers[s];
                if (o.headers.location && (o.headers.location = e.rewriteUrl(o.headers.location)),
                t.destination === "document") {
                    let s = o.headers["content-disposition"];
                    if (!/\s*?((inline|attachment);\s*?)filename=/i.test(s)) {
                        let l = /^\s*?attachment/i.test(s) ? "attachment" : "inline"
                          , [y] = new URL(u.finalURL).pathname.split("/").slice(-1);
                        o.headers["content-disposition"] = `${l}; filename=${JSON.stringify(y)}`
                    }
                }
                if (o.headers["set-cookie"] && (Promise.resolve(e.cookie.setCookies(o.headers["set-cookie"], a, e.meta)).then( () => {
                    self.clients.matchAll().then(function(s) {
                        s.forEach(function(l) {
                            l.postMessage({
                                msg: "updateCookies",
                                url: e.meta.url.href
                            })
                        })
                    })
                }
                ),
                delete o.headers["set-cookie"]),
                o.body)
                    switch (t.destination) {
                    case "script":
                    case "worker":
                        {
                            let s = [e.bundleScript, e.clientScript, e.configScript, e.handlerScript].map(l => JSON.stringify(l)).join(",");
                            o.body = `if (!self.__uv && self.importScripts) { ${e.createJsInject(this.address, this.bareClient.manifest, e.cookie.serialize(c, e.meta, !0), t.referrer)} importScripts(${s}); }
`,
                            o.body += e.js.rewrite(await u.text())
                        }
                        break;
                    case "style":
                        o.body = e.rewriteCSS(await u.text());
                        break;
                    case "iframe":
                    case "document":
                        if (U(e.meta.url, o.headers["content-type"] || "")) {
                            let s = await u.text();
                            if (typeof this.config.inject == "function") {
                                let l = s.indexOf("</head>")
                                  , y = s.indexOf("</HEAD>")
                                  , x = await this.config.inject(new URL(i));
                                (l !== -1 || y !== -1) && (s = s.slice(0, l) + `${await x}` + s.slice(l))
                            }
                            o.body = e.rewriteHtml(s, {
                                document: !0,
                                injectHead: e.createHtmlInject(e.handlerScript, e.bundleScript, e.clientScript, e.configScript, this.address, this.bareClient.manifest, e.cookie.serialize(c, e.meta, !0), t.referrer)
                            })
                        }
                    }
                return r.headers.accept === "text/event-stream" && (o.headers["content-type"] = "text/event-stream"),
                crossOriginIsolated && (o.headers["Cross-Origin-Embedder-Policy"] = "require-corp"),
                this.emit("response", h),
                h.intercepted ? h.returnValue : new Response(o.body,{
                    headers: o.headers,
                    status: o.status,
                    statusText: o.statusText
                })
            } catch (e) {
                return ["document", "iframe"].includes(t.destination) ? (console.error(e),
                k(e, i, this.address)) : new Response(void 0,{
                    status: 500
                })
            }
        }
        static Ultraviolet = f
    }
    ;
    self.UVServiceWorker = g;
    var v = class {
        constructor(t, i) {
            this.request = t,
            this.raw = i,
            this.ultraviolet = t.ultraviolet,
            this.headers = {};
            for (let e in i.rawHeaders)
                this.headers[e.toLowerCase()] = i.rawHeaders[e];
            this.status = i.status,
            this.statusText = i.statusText,
            this.body = i.body
        }
        get url() {
            return this.request.url
        }
        get base() {
            return this.request.base
        }
        set base(t) {
            this.request.base = t
        }
    }
      , w = class {
        constructor(t, i, e, a=null) {
            this.ultraviolet = e,
            this.request = t,
            this.headers = Object.fromEntries(t.headers.entries()),
            this.method = t.method,
            this.address = i.address,
            this.body = a || null,
            this.cache = t.cache,
            this.redirect = t.redirect,
            this.credentials = "omit",
            this.mode = t.mode === "cors" ? t.mode : "same-origin",
            this.blob = !1
        }
        get url() {
            return this.ultraviolet.meta.url
        }
        set url(t) {
            this.ultraviolet.meta.url = t
        }
        get base() {
            return this.ultraviolet.meta.base
        }
        set base(t) {
            this.ultraviolet.meta.base = t
        }
    }
    ;
    function U(n, t="") {
        return (f.mime.contentType(t || n.pathname) || "text/html").split(";")[0] === "text/html"
    }
    var m = class {
        #e;
        #t;
        constructor(t={}, i=null, e=null) {
            this.#e = !1,
            this.#t = null,
            this.data = t,
            this.target = i,
            this.that = e
        }
        get intercepted() {
            return this.#e
        }
        get returnValue() {
            return this.#t
        }
        respondWith(t) {
            this.#t = t,
            this.#e = !0
        }
    }
    ;
    function E(n, t) {
        let i = new URL(n)
          , e = `remoteHostname.textContent = ${JSON.stringify(i.hostname)};bareServer.href = ${JSON.stringify(t)};uvHostname.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify("2.0.0 | Void 3.3.4")};`;
        return `<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1>This site can\u2019t be reached</h1><hr /><p><b id="remoteHostname"></b>\u2019s server IP address could not be found.</p><p>Try:</p><ul><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="uvHostname"></b>'s administrator</li><li>Verifying the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</li></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet v<span>2.0.0 | Void 3.3.4</span></i></p><script src="${"data:application/javascript," + encodeURIComponent(e)}"><\/script></body></html>`
    }
    function O(n, t, i, e, a, r, c) {
        if (e === "The specified host could not be resolved.")
            return E(r, c);
        let d = `errorTitle.textContent = ${JSON.stringify(n)};errorCode.textContent = ${JSON.stringify(t)};` + (i ? `errorId.textContent = ${JSON.stringify(i)};` : "") + `errorMessage.textContent =  ${JSON.stringify(e)};errorTrace.value = ${JSON.stringify(a)};fetchedURL.textContent = ${JSON.stringify(r)};bareServer.href = ${JSON.stringify(c)};for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify(" | Void 3.3.4")};`;
        return `<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1 id='errorTitle'></h1><hr /><p>Failed to load <b id="fetchedURL"></b></p><p id="errorMessage"></p><table><tbody><tr><td>Code:</td><td id="errorCode"></td></tr>` + (i ? '<tr><td>ID:</td><td id="errorId"></td></tr>' : "") + `</tbody></table><textarea id="errorTrace" cols="40" rows="10" readonly></textarea><p>Try:</p><ul><li>Checking your internet connection</li><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="uvHostname"></b>'s administrator</li><li>Verify the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</li></ul><p>If you're the administrator of <b id="uvHostname"></b>, try:</p><ul><li>Restarting your Bare server</li><li>Updating Ultraviolet</li><li>Troubleshooting the error on the <a href="https://github.com/titaniumnetwork-dev/Ultraviolet" target="_blank">GitHub repository</a></li></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript," + encodeURIComponent(d)}"><\/script></body></html>`
    }
    function R(n) {
        return n instanceof Error && typeof n.body == "object"
    }
    function k(n, t, i) {
        let e, a, r, c = "", d;
        return R(n) ? (e = n.status,
        a = "Error communicating with the Bare server",
        d = n.body.message,
        r = n.body.code,
        c = n.body.id) : (e = 500,
        a = "Error processing your request",
        d = "Internal Server Error",
        r = n instanceof Error ? n.name : "UNKNOWN"),
        new Response(O(a, r, c, d, String(n), t, i),{
            status: e,
            headers: {
                "content-type": "text/html"
            }
        })
    }
}
)();
//# sourceMappingURL=uv.sw.js.map
