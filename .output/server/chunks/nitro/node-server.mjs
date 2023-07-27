globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import gracefulShutdown from 'http-graceful-shutdown';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection] " + err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro]  [uncaughtException] " + err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": "\"160-YKC76/cuiIV0bkf4M8MBeHPMk+I\"",
    "mtime": "2023-07-26T14:44:59.256Z",
    "size": 352,
    "path": "../public/favicon.svg"
  },
  "/manifest.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"2d7-VzdeNThAlAmz0UBN7Tfy4bJeMoE\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 727,
    "path": "../public/manifest.webmanifest"
  },
  "/og.png": {
    "type": "image/png",
    "etag": "\"209ed-sIBmHbBnVceTJyM6zhuy/Bp5UOg\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 133613,
    "path": "../public/og.png"
  },
  "/sw.js": {
    "type": "application/javascript",
    "etag": "\"7e0-rpfo07td/zCP5NmnZ98mr/PDZXo\"",
    "mtime": "2023-07-26T14:45:00.616Z",
    "size": 2016,
    "path": "../public/sw.js"
  },
  "/transparent.png": {
    "type": "image/png",
    "etag": "\"253-7kpdAdK2triFnH2WMyC7Kw1z4H0\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 595,
    "path": "../public/transparent.png"
  },
  "/workbox-56a10583.js": {
    "type": "application/javascript",
    "etag": "\"3ae2-tLvjAaX/ZfsnG3m8j+HRxuoeR90\"",
    "mtime": "2023-07-26T14:45:00.616Z",
    "size": 15074,
    "path": "../public/workbox-56a10583.js"
  },
  "/_nuxt/crosshair.d2c25dec.svg": {
    "type": "image/svg+xml",
    "etag": "\"281-jhOtuQ72i09pajdZvsDVln6Eu84\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 641,
    "path": "../public/_nuxt/crosshair.d2c25dec.svg"
  },
  "/_nuxt/entry.d78408f3.js": {
    "type": "application/javascript",
    "etag": "\"24bed-S5zKEVJm5Pc14wt86wZqtZ4BflQ\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 150509,
    "path": "../public/_nuxt/entry.d78408f3.js"
  },
  "/_nuxt/error-404.1dfe7e06.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-1IaF6m3aQ2UwZg/SLXgkgMu7x/8\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.1dfe7e06.css"
  },
  "/_nuxt/error-404.34ef972d.js": {
    "type": "application/javascript",
    "etag": "\"8d2-8dFn+s65LeCWyEOHknd6QmeDCxQ\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 2258,
    "path": "../public/_nuxt/error-404.34ef972d.js"
  },
  "/_nuxt/error-500.65a8b1e7.js": {
    "type": "application/javascript",
    "etag": "\"756-PCXvWeTu6J4Z6tbU50RYrw/7nxw\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.65a8b1e7.js"
  },
  "/_nuxt/error-500.7376934c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-JVFAikodhqgGDFLa2T3V1zs27cE\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.7376934c.css"
  },
  "/_nuxt/exo-2-v20-latin-700.a9bdf5e5.woff2": {
    "type": "font/woff2",
    "etag": "\"3d60-YvRCQKKv4fT9O+iDjbBnAiEDF/o\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 15712,
    "path": "../public/_nuxt/exo-2-v20-latin-700.a9bdf5e5.woff2"
  },
  "/_nuxt/exo-2-v20-latin-regular.bf93ee91.woff2": {
    "type": "font/woff2",
    "etag": "\"3b34-genX6BrQoJSxK3MLmt/3xLDtWkc\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 15156,
    "path": "../public/_nuxt/exo-2-v20-latin-regular.bf93ee91.woff2"
  },
  "/_nuxt/index.60a8b017.js": {
    "type": "application/javascript",
    "etag": "\"30d7-2PljZd3uisSqfq1XCVFgjPL3058\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 12503,
    "path": "../public/_nuxt/index.60a8b017.js"
  },
  "/_nuxt/index.d92d4079.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"89e-7ruN6hkqp4Hgs0o79pTXpJ4WSRI\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 2206,
    "path": "../public/_nuxt/index.d92d4079.css"
  },
  "/_nuxt/merriweather-v30-latin-regular.5c2d662e.woff2": {
    "type": "font/woff2",
    "etag": "\"4e3c-jv/SPkglEeJJw/jpHNxQNym5NZg\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 20028,
    "path": "../public/_nuxt/merriweather-v30-latin-regular.5c2d662e.woff2"
  },
  "/_nuxt/nuxt-link.e53320c9.js": {
    "type": "application/javascript",
    "etag": "\"10fc-+1vS+yCFUJczTNKXKFrwXMN/BYo\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 4348,
    "path": "../public/_nuxt/nuxt-link.e53320c9.js"
  },
  "/_nuxt/pixel.825960b6.png": {
    "type": "image/png",
    "etag": "\"3c650-/onPTVfoqesxuNU2pV3sPTMeYh4\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 247376,
    "path": "../public/_nuxt/pixel.825960b6.png"
  },
  "/_nuxt/silkscreen-v1-latin-regular.3337f800.woff2": {
    "type": "font/woff2",
    "etag": "\"1fe4-NHqfDh8m/Y3P+Ts8ZlkgTDDuzoQ\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 8164,
    "path": "../public/_nuxt/silkscreen-v1-latin-regular.3337f800.woff2"
  },
  "/_nuxt/studio.ae9a65f6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"32fe-mLFetr1lrsMN/m9UvKmyouNT3cE\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 13054,
    "path": "../public/_nuxt/studio.ae9a65f6.css"
  },
  "/_nuxt/studio.ffe2b9aa.js": {
    "type": "application/javascript",
    "etag": "\"3740f-Fh20IF7b3oCFGS+qzlThaC3I8vM\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 226319,
    "path": "../public/_nuxt/studio.ffe2b9aa.js"
  },
  "/_nuxt/workbox-window.prod.es5.a7b12eab.js": {
    "type": "application/javascript",
    "etag": "\"14a9-PgD6LVq3AWVnktFTXJIaapz+xFw\"",
    "mtime": "2023-07-26T14:44:59.248Z",
    "size": 5289,
    "path": "../public/_nuxt/workbox-window.prod.es5.a7b12eab.js"
  },
  "/icons/icon-192x192.png": {
    "type": "image/png",
    "etag": "\"2b6-G/lkgriMmzvY5hyCjkFSGt6cTC8\"",
    "mtime": "2023-07-26T14:44:59.256Z",
    "size": 694,
    "path": "../public/icons/icon-192x192.png"
  },
  "/icons/icon-256x256.png": {
    "type": "image/png",
    "etag": "\"3e9-Jis4jJ7aZ8jPfCeCjtQxeqsvpDI\"",
    "mtime": "2023-07-26T14:44:59.256Z",
    "size": 1001,
    "path": "../public/icons/icon-256x256.png"
  },
  "/icons/icon-384x384.png": {
    "type": "image/png",
    "etag": "\"5f9-+xtSjSgJngFyKah+PkvVYY8jCJY\"",
    "mtime": "2023-07-26T14:44:59.256Z",
    "size": 1529,
    "path": "../public/icons/icon-384x384.png"
  },
  "/icons/icon-512x512.png": {
    "type": "image/png",
    "etag": "\"928-4mI28MLl2Ci6JFtolX6QXUU2L5s\"",
    "mtime": "2023-07-26T14:44:59.256Z",
    "size": 2344,
    "path": "../public/icons/icon-512x512.png"
  },
  "/palettes/aap64.json": {
    "type": "application/json",
    "etag": "\"5ac-3I8lCp7/HbndpzoMTRt8f2XtNbc\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1452,
    "path": "../public/palettes/aap64.json"
  },
  "/palettes/android-arts.json": {
    "type": "application/json",
    "etag": "\"d3-It3aKHFxSe1kIMnGP+TPAB8eO04\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 211,
    "path": "../public/palettes/android-arts.json"
  },
  "/palettes/cga.json": {
    "type": "application/json",
    "etag": "\"d3-kLhRu/olX08nq9himPG9oESRgVQ\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 211,
    "path": "../public/palettes/cga.json"
  },
  "/palettes/commodore64.json": {
    "type": "application/json",
    "etag": "\"170-zd0XCg9l/F8EDi09iQ6nRuXdPWc\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 368,
    "path": "../public/palettes/commodore64.json"
  },
  "/palettes/edg16.json": {
    "type": "application/json",
    "etag": "\"d3-y1Q2iA8KeL8D6afyP8YWg0/wKJA\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 211,
    "path": "../public/palettes/edg16.json"
  },
  "/palettes/edg32.json": {
    "type": "application/json",
    "etag": "\"2d6-DyjGHd+Uu8FLEuP2HI6CkP1W9mg\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 726,
    "path": "../public/palettes/edg32.json"
  },
  "/palettes/edg77.json": {
    "type": "application/json",
    "etag": "\"3ec-exM19urgmlJlNGfWKrlCwYL6TLo\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1004,
    "path": "../public/palettes/edg77.json"
  },
  "/palettes/endesga32.json": {
    "type": "application/json",
    "etag": "\"2d6-DyjGHd+Uu8FLEuP2HI6CkP1W9mg\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 726,
    "path": "../public/palettes/endesga32.json"
  },
  "/palettes/gameboy.json": {
    "type": "application/json",
    "etag": "\"37-9IwyHl7BNnp1ypKiEra3eiiIwFE\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 55,
    "path": "../public/palettes/gameboy.json"
  },
  "/palettes/journey.json": {
    "type": "application/json",
    "etag": "\"583-8QhgAw7Gp3NCJLpkqTcbmYWZ+VA\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1411,
    "path": "../public/palettes/journey.json"
  },
  "/palettes/lospec500.json": {
    "type": "application/json",
    "etag": "\"3c2-6y3cG48MqUAJvOznsPF9/ZBEXoU\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 962,
    "path": "../public/palettes/lospec500.json"
  },
  "/palettes/pico8.json": {
    "type": "application/json",
    "etag": "\"166-W1EJmaTtBM+kWPel1dfAi0CiWxs\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 358,
    "path": "../public/palettes/pico8.json"
  },
  "/palettes/resurrect64.json": {
    "type": "application/json",
    "etag": "\"5b8-fYAgpAOnYfneDGQ6zYSFeAzA8QA\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 1464,
    "path": "../public/palettes/resurrect64.json"
  },
  "/palettes/sweetie16.json": {
    "type": "application/json",
    "etag": "\"16f-bjaPU11rOj4TxADTH+oNUk/LOn0\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 367,
    "path": "../public/palettes/sweetie16.json"
  },
  "/palettes/vinik24.json": {
    "type": "application/json",
    "etag": "\"22f-nEU9H+/kh4TkiRjF6qARBrG5M5k\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 559,
    "path": "../public/palettes/vinik24.json"
  },
  "/palettes/zughy32.json": {
    "type": "application/json",
    "etag": "\"2d7-Sa1aimhEEwatc4T16HV0d/hM3xk\"",
    "mtime": "2023-07-26T14:44:59.252Z",
    "size": 727,
    "path": "../public/palettes/zughy32.json"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_BAZ12B = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_BAZ12B, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_BAZ12B, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
