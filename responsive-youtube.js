/*
 * Responsive-Youtube.js 0.0.1
 *
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (w, d, u) {
    "use strict";

    var iframes = [],
        genericIds = 0,
        started = false,
        setuped = false,
        evts = {},
        dOpts = {},
        m = w.Element && w.Element.prototype,
        query = "[data-ry-video]:not(iframe)";

    function responsiveIframe(el) {
        //Check if element is detached
        if (!el || !d.contains(el)) return;

        //Check if responsive is ignored in specific element
        if (data(el, "ry-ignore") === true) return;

        var originalWidth = data(el, "ry-width") || el.clientWidth;
        var originalHeight = data(el, "ry-height") || el.clientHeight;

        el.setAttribute("data-ry-width", originalWidth);
        el.setAttribute("data-ry-height", originalHeight);

        el.width = "100%";

        if (originalWidth != originalHeight) {
            el.height = el.clientWidth / (originalWidth / originalHeight);
        } else {
            el.height = el.clientWidth;
        }
    }

    function putPlayer(elID, vID, cfg) {
        if (!cfg || typeof cfg !== "object") {
            cfg = {};
        }

        config(dOpts, cfg);

        var player = new YT.Player(elID, {
            videoId: vID,
            playerVars: cfg,
            events: {
                onReady: function(e) {
                    var el = d.getElementById(elID);
                    responsiveIframe(el);
                    iframes.push(el);

                    ryTrigger("ready", e, player);
                },
                onStateChange: function (e) {
                    ryTrigger("state", e, player);
                },
                onPlaybackQualityChange: function (e) {
                    ryTrigger("quality", e, player);
                },
                onPlaybackRateChange: function (e) {
                    ryTrigger("rate", e, player);
                },
                onError: function (e) {
                    ryTrigger("error", e, player);
                },
                onApiChange: function (e) {
                    ryTrigger("api", e, player);
                }
            }
        });

        ryTrigger("create", player);
    }

    function data(el, name) {
        var d = el.getAttribute("data-" + name), resp;

        if (d === "true" || d === "false") {
            return d === "true";
        } else if (/^\[[\s\S]+\]$|^\{[\s\S]+\}$/.test(d)) {
            try { resp = JSON.parse(d); } catch (e) {}
        }

        return resp || d;
    }

    function observer(m) {
        var added = m.addedNodes, p = [], n = [];

        for (var i = added.length - 1; i >= 0; i--) {
            if (added[i].matches(query)) {
                p.push(added[i]);
            } else {
                n.push(added[i]);
            }
        }

        createPlayers(p);
        findPlayers(p);
    }

    function setup() {
        if (setuped) return;

        setuped = true;

        w.addEventListener("resize", function() {
            if (iframes.length) {
                for (var i = 0, j = iframes.length; i < j; i++) {
                    responsiveIframe(iframes[i]);
                }
            }
        });

        (new MutationObserver(function (m) {
            m.forEach(observer);
        })).observe(d.body, { childList: true });

        ryTrigger("done");
    }

    function findPlayers(els) {
        for (var i = 0, j = els.length; i < j; i++) {
            createPlayers(els[i].querySelectorAll(query));
        }
    }

    function createPlayers(els) {
        for (var i = 0, j = els.length; i < j; i++) {
            var el = els[i];

            if (!el.id) {
                genericIds++;
                el.id = "responsive-youtube-" + genericIds;
            }

            putPlayer(el.id, data(el, "ry-video"), data(el, "ry-config"));
        }
    }

    function config(f, t)
    {
        for (var k in f) {
            if (!/^(object|function)$/i.test(typeof f[k])) t[k] = f[k];
        }
    }

    function start(opts) {
        if (typeof opts === "object") {
            config(opts, dOpts);
        } else {
            dOpts = {};
        }

        w.onYouTubeIframeAPIReady = function () {
            createPlayers(d.querySelectorAll(query));
            setup();
        };

        if (started) {
            return;
        }

        started = true;

        //Inject Youtube Iframe API
        var tag = d.createElement("script");
        tag.ansyc = true;
        tag.src = "https://www.youtube.com/iframe_api";
        var fs = d.getElementsByTagName("script")[0];
        fs.parentNode.insertBefore(tag, fs);
    }

    function ryTrigger(name, arg1, arg2) {
        if (!evts[name]) return;

        for (var ce = evts[name], i = 0; i < ce.length; i++) ce[i](arg1, arg2);
    }

    function ryEvent(name, callback, remove) {
        if (typeof callback !== "function") return;

        if (!evts[name]) evts[name] = [];

        var ce = evts[name];

        if (!remove) {
            ce.push(callback);
            return;
        }

        var fr = [], i;

        for (i = ce.length - 1; i >= 0; i--) {
            if (ce[i] === callback) fr.push(i);
        }

        for (i = fr.length - 1; i >= 0; i--) ce.splice(fr[i], 1);
    }

    w.ResponsiveYoutube = {
        "start": start,
        "on": function (name, callback) {
            ryEvent(name, callback);
        },
        "off": function (name, callback) {
            ryEvent(name, callback, true);
        }
    };

    if (!m || m.matches) return;

    m.matches = m.matchesSelector || m.mozMatchesSelector || m.msMatchesSelector ||
    m.oMatchesSelector || m.webkitMatchesSelector || function(s) {
        var m = (this.document || this.ownerDocument).querySelectorAll(s), i = m.length;

        while (--i >= 0 && m[i] !== this);
        return i > -1;
    };
})(window, document);
