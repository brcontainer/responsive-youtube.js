/*
 * Responsive-youtube.js 0.2.1
 *
 * Copyright (c) 2020 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (u) {
    "use strict";

    var players = [],
        genericIds = 0,
        setuped = false,
        paused = true,
        evts = {},
        dOpts = {},
        timeout,
        readytimeout,
        w = typeof window !== "undefined" ? window : {},
        d = w.document || {},
        elementProto = w.Element && w.Element.prototype,
        query = "[data-ry-video]:not(iframe)",
        ignoreData = ",with,height,ignore,video,cover,",
        MO = w.MutationObserver || w.WebKitMutationObserver;

    var main = {
        "start": start,
        "destroy": destroy,
        "supported": !!MO,
        "on": function (name, callback) {
            evt(name, callback);
        },
        "off": function (name, callback) {
            evt(name, callback, true);
        }
    };

    function updateSize(done)
    {
        if (done !== true) {
            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(updateSize, 300, true);
        } else if (players.length) {
            for (var i = 0, j = players.length; i < j; i++) {
                responsiveIframe(players[i].getIframe());
            }
        }
    }

    function responsiveIframe(el)
    {
        //Check if element is detached
        if (!el || !d.body.contains(el)) return;

        //Check if responsive is ignored in specific element
        if (data(el, "ignore") === true) return;

        var originalWidth = data(el, "width") || el.clientWidth;
        var originalHeight = data(el, "height") || el.clientHeight;

        el.setAttribute("data-ry-width", originalWidth);
        el.setAttribute("data-ry-height", originalHeight);

        el.width = "100%";

        if (originalWidth != originalHeight) {
            el.height = el.clientWidth / (originalWidth / originalHeight);
        } else {
            el.height = el.clientWidth;
        }
    }

    function forceResponsive(done)
    {
        if (done) return updateSize();

        clearTimeout(readytimeout);

        readytimeout = setTimeout(forceResponsive, 5000, true);
    }

    function putPlayer(elID, vID, cfg)
    {
        if (!cfg || typeof cfg !== "object") cfg = {};

        config(dOpts, cfg);

        var player = new YT.Player(elID, {
            videoId: vID,
            playerVars: cfg,
            events: {
                onReady: function (e) {
                    responsiveIframe(d.getElementById(elID));
                    trigger("ready", e, player);
                },
                onStateChange: function (e) {
                    trigger("state", e, player);
                },
                onPlaybackQualityChange: function (e) {
                    trigger("quality", e, player);
                },
                onPlaybackRateChange: function (e) {
                    trigger("rate", e, player);
                },
                onError: function (e) {
                    trigger("error", e, player);
                },
                onApiChange: function (e) {
                    trigger("api", e, player);
                }
            }
        });

        players.push(player);

        trigger("create", player);

        forceResponsive();
    }

    function dataVars(el)
    {
        var attrs = el.attributes, obj = {};

        for (var i = attrs.length - 1; i >= 0; i--) {
            var k = attrs[i].nodeName;

            if (k.indexOf("data-ry-") === 0) {
                k = k.substr(8);

                if (ignoreData.indexOf("," + k + ",") === -1) obj[k] = data(el, k);
            }
        }

        return obj;
    }

    function data(el, name)
    {
        var v = el.getAttribute("data-ry-" + name), resp;

        if (v === "true" || v === "false") {
            return v === "true";
        } else if (!isNaN(v)) {
            return parseFloat(v);
        }

        var first = v[0], last = v[v.length - 1];

        if ((first === "[" && last === "]") || (first === "{" && last === "}")) {
            try { resp = JSON.parse(v); } catch (e) {}
        }

        return resp || v;
    }

    function observer(m)
    {
        if (paused) return;

        var added = m.addedNodes, p = [], n = [], el;

        for (var i = added.length - 1; i >= 0; i--) {
            el = added[i];

            if (el.nodeType !== 1) continue;

            if (el.matches(query) && el.matches) {
                p.push(el);
            } else {
                n.push(el);
            }
        }

        el = u;

        createPlayers(p);
        findPlayers(n);
    }

    function findPlayers(els)
    {
        for (var i = 0, j = els.length; i < j; i++) {
            createPlayers(els[i].querySelectorAll(query));
        }
    }

    function createPlayers(els)
    {
        for (var i = 0, j = els.length; i < j; i++) {
            var el = els[i];

            if (!el.id) el.id = "responsive-youtube-" + (++genericIds);

            putPlayer(el.id, data(el, "video"), dataVars(el));
        }
    }

    function config(f, t)
    {
        for (var k in f) {
            if ([ "object", "function" ].indexOf(typeof f[k]) === -1) t[k] = f[k];
        }
    }

    function setup()
    {
        createPlayers(d.querySelectorAll(query));

        if (setuped) return;

        setuped = true;

        w.addEventListener("resize", updateSize);

        if (!MO) return trigger("error");

        (new MO(function (m) {
            m.forEach(observer);
        })).observe(d.body, { childList: true });

        trigger("done");
    }

    function start(opts)
    {
        if (typeof opts === "object") {
            config(opts, dOpts);
        } else {
            dOpts = {};
        }

        if (!paused) return;

        paused = false;

        if (w.YT && w.YT.Player) return setup();

        w.onYouTubeIframeAPIReady = setup;

        //Inject Youtube Iframe API
        var tag = d.createElement("script");
        tag.ansyc = true;
        tag.src = "https://www.youtube.com/iframe_api";
        var fs = d.getElementsByTagName("script")[0];
        fs.parentNode.insertBefore(tag, fs);
    }

    function destroy()
    {
        paused = true;

        dOpts = {};

        for (var i = players.length - 1; i >= 0; i--) players[i].destroy();

        players = [];
    }

    function trigger(name, arg1, arg2)
    {
        if (!evts[name]) return;

        for (var ce = evts[name], i = 0; i < ce.length; i++) ce[i](arg1, arg2);
    }

    function evt(name, callback, remove)
    {
        if (typeof callback !== "function") return;

        if (!evts[name]) evts[name] = [];

        if (!remove) {
            evts[name].push(callback);
            return;
        }

        evts[name] = evts[name].filter(function (item) {
            return item !== callback;
        });
    }

    if (elementProto && !elementProto.matches) {
        elementProto.matches = elementProto.matchesSelector || elementProto.mozMatchesSelector || elementProto.msMatchesSelector ||
        elementProto.oMatchesSelector || elementProto.webkitMatchesSelector || function (s) {
            var m = (this.document || this.ownerDocument).querySelectorAll(s), i = m.length;

            while (--i >= 0 && m[i] !== this);
            return i > -1;
        };
    }

    w.ResponsiveYoutube = main;

    // CommonJS
    if (typeof module !== "undefined" && module.exports) module.exports = main;

    // RequireJS
    if (typeof define !== "undefined") define(function () { return main; });
})();
