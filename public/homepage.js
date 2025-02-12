(HA = (function (a) {
  return a;
})(window.HA || {})),
  (function (a, b) {
    function c(a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
    }
    function d(a) {
      return "undefined" == typeof a;
    }
    if (a) {
      var e = {},
        f = a.TraceKit,
        g = [].slice,
        h = "?";
      (e.noConflict = function () {
        return (a.TraceKit = f), e;
      }),
        (e.wrap = function (a) {
          function b() {
            try {
              return a.apply(this, arguments);
            } catch (b) {
              throw (e.report(b), b);
            }
          }
          return b;
        }),
        (e.report = (function () {
          function b(a) {
            i(), n.push(a);
          }
          function d(a) {
            for (var b = n.length - 1; b >= 0; --b)
              n[b] === a && n.splice(b, 1);
          }
          function f(a, b) {
            var d = null;
            if (!b || e.collectWindowErrors) {
              for (var f in n)
                if (c(n, f))
                  try {
                    n[f].apply(null, [a].concat(g.call(arguments, 2)));
                  } catch (h) {
                    d = h;
                  }
              if (d) throw d;
            }
          }
          function h(a, b, c, d, g) {
            var h = null;
            if (q)
              e.computeStackTrace.augmentStackTraceWithInitialElement(
                q,
                b,
                c,
                a
              ),
                j();
            else if (g) (h = e.computeStackTrace(g)), f(h, !0);
            else {
              var i = { url: b, line: c, column: d };
              (i.func = e.computeStackTrace.guessFunctionName(i.url, i.line)),
                (i.context = e.computeStackTrace.gatherContext(i.url, i.line)),
                (h = { mode: "onerror", message: a, stack: [i] }),
                f(h, !0);
            }
            return !!l && l.apply(this, arguments);
          }
          function i() {
            m !== !0 && ((l = a.onerror), (a.onerror = h), (m = !0));
          }
          function j() {
            var a = q,
              b = o;
            (o = null),
              (q = null),
              (p = null),
              f.apply(null, [a, !1].concat(b));
          }
          function k(b) {
            if (q) {
              if (p === b) return;
              j();
            }
            var c = e.computeStackTrace(b);
            throw (
              ((q = c),
              (p = b),
              (o = g.call(arguments, 1)),
              a.setTimeout(
                function () {
                  p === b && j();
                },
                c.incomplete ? 2e3 : 0
              ),
              b)
            );
          }
          var l,
            m,
            n = [],
            o = null,
            p = null,
            q = null;
          return (k.subscribe = b), (k.unsubscribe = d), k;
        })()),
        (e.computeStackTrace = (function () {
          function b(b) {
            if (!e.remoteFetching) return "";
            try {
              var c = function () {
                  try {
                    return new a.XMLHttpRequest();
                  } catch (b) {
                    return new a.ActiveXObject("Microsoft.XMLHTTP");
                  }
                },
                d = c();
              return d.open("GET", b, !1), d.send(""), d.responseText;
            } catch (f) {
              return "";
            }
          }
          function f(a) {
            if ("string" != typeof a) return [];
            if (!c(w, a)) {
              var d = "",
                e = "";
              try {
                e = document.domain;
              } catch (f) {}
              var g = /(.*)\:\/\/([^\/]+)\/{0,1}([\s\S]*)/.exec(a);
              g && g[2] === e && (d = b(a)), (w[a] = d ? d.split("\n") : []);
            }
            return w[a];
          }
          function g(a, b) {
            var c,
              e = /function ([^(]*)\(([^)]*)\)/,
              g =
                /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
              i = "",
              j = 10,
              k = f(a);
            if (!k.length) return h;
            for (var l = 0; l < j; ++l)
              if (((i = k[b - l] + i), !d(i))) {
                if ((c = g.exec(i))) return c[1];
                if ((c = e.exec(i))) return c[1];
              }
            return h;
          }
          function i(a, b) {
            var c = f(a);
            if (!c.length) return null;
            var g = [],
              h = Math.floor(e.linesOfContext / 2),
              i = h + (e.linesOfContext % 2),
              j = Math.max(0, b - h - 1),
              k = Math.min(c.length, b + i - 1);
            b -= 1;
            for (var l = j; l < k; ++l) d(c[l]) || g.push(c[l]);
            return g.length > 0 ? g : null;
          }
          function j(a) {
            return a.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&");
          }
          function k(a) {
            return j(a)
              .replace("<", "(?:<|&lt;)")
              .replace(">", "(?:>|&gt;)")
              .replace("&", "(?:&|&amp;)")
              .replace('"', '(?:"|&quot;)')
              .replace(/\s+/g, "\\s+");
          }
          function l(a, b) {
            for (var c, d, e = 0, g = b.length; e < g; ++e)
              if ((c = f(b[e])).length && ((c = c.join("\n")), (d = a.exec(c))))
                return {
                  url: b[e],
                  line: c.substring(0, d.index).split("\n").length,
                  column: d.index - c.lastIndexOf("\n", d.index) - 1,
                };
            return null;
          }
          function m(a, b, c) {
            var d,
              e = f(b),
              g = new RegExp("\\b" + j(a) + "\\b");
            return (
              (c -= 1), e && e.length > c && (d = g.exec(e[c])) ? d.index : null
            );
          }
          function n(b) {
            if (!d(document)) {
              for (
                var c,
                  e,
                  f,
                  g,
                  h = [a.location.href],
                  i = document.getElementsByTagName("script"),
                  m = "" + b,
                  n =
                    /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
                  o =
                    /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
                  p = 0;
                p < i.length;
                ++p
              ) {
                var q = i[p];
                q.src && h.push(q.src);
              }
              if ((f = n.exec(m))) {
                var r = f[1] ? "\\s+" + f[1] : "",
                  s = f[2].split(",").join("\\s*,\\s*");
                (c = j(f[3]).replace(/;$/, ";?")),
                  (e = new RegExp(
                    "function" +
                      r +
                      "\\s*\\(\\s*" +
                      s +
                      "\\s*\\)\\s*{\\s*" +
                      c +
                      "\\s*}"
                  ));
              } else e = new RegExp(j(m).replace(/\s+/g, "\\s+"));
              if ((g = l(e, h))) return g;
              if ((f = o.exec(m))) {
                var t = f[1];
                if (
                  ((c = k(f[2])),
                  (e = new RegExp(
                    "on" + t + "=[\\'\"]\\s*" + c + "\\s*[\\'\"]",
                    "i"
                  )),
                  (g = l(e, h[0])))
                )
                  return g;
                if (((e = new RegExp(c)), (g = l(e, h)))) return g;
              }
              return null;
            }
          }
          function o(a) {
            if (!a.stack) return null;
            for (
              var b,
                c,
                e =
                  /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                f =
                  /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|\[).*?)(?::(\d+))?(?::(\d+))?\s*$/i,
                j =
                  /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:ms-appx|https?|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                k = a.stack.split("\n"),
                l = [],
                n = /^(.*) is undefined$/.exec(a.message),
                o = 0,
                p = k.length;
              o < p;
              ++o
            ) {
              if ((b = e.exec(k[o]))) {
                var q = b[2] && b[2].indexOf("native") !== -1;
                c = {
                  url: q ? null : b[2],
                  func: b[1] || h,
                  args: q ? [b[2]] : [],
                  line: b[3] ? +b[3] : null,
                  column: b[4] ? +b[4] : null,
                };
              } else if ((b = j.exec(k[o])))
                c = {
                  url: b[2],
                  func: b[1] || h,
                  args: [],
                  line: +b[3],
                  column: b[4] ? +b[4] : null,
                };
              else {
                if (!(b = f.exec(k[o]))) continue;
                c = {
                  url: b[3],
                  func: b[1] || h,
                  args: b[2] ? b[2].split(",") : [],
                  line: b[4] ? +b[4] : null,
                  column: b[5] ? +b[5] : null,
                };
              }
              !c.func && c.line && (c.func = g(c.url, c.line)),
                c.line && (c.context = i(c.url, c.line)),
                l.push(c);
            }
            return l.length
              ? (l[0] && l[0].line && !l[0].column && n
                  ? (l[0].column = m(n[1], l[0].url, l[0].line))
                  : l[0].column ||
                    d(a.columnNumber) ||
                    (l[0].column = a.columnNumber + 1),
                { mode: "stack", name: a.name, message: a.message, stack: l })
              : null;
          }
          function p(a) {
            var b = a.stacktrace;
            if (b) {
              for (
                var c,
                  d =
                    / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
                  e =
                    / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i,
                  f = b.split("\n"),
                  h = [],
                  j = 0;
                j < f.length;
                j += 2
              ) {
                var k = null;
                if (
                  ((c = d.exec(f[j]))
                    ? (k = {
                        url: c[2],
                        line: +c[1],
                        column: null,
                        func: c[3],
                        args: [],
                      })
                    : (c = e.exec(f[j])) &&
                      (k = {
                        url: c[6],
                        line: +c[1],
                        column: +c[2],
                        func: c[3] || c[4],
                        args: c[5] ? c[5].split(",") : [],
                      }),
                  k)
                ) {
                  if (
                    (!k.func && k.line && (k.func = g(k.url, k.line)), k.line)
                  )
                    try {
                      k.context = i(k.url, k.line);
                    } catch (l) {}
                  k.context || (k.context = [f[j + 1]]), h.push(k);
                }
              }
              return h.length
                ? {
                    mode: "stacktrace",
                    name: a.name,
                    message: a.message,
                    stack: h,
                  }
                : null;
            }
          }
          function q(b) {
            var d = b.message.split("\n");
            if (d.length < 4) return null;
            var e,
              h =
                /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
              j =
                /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
              m = /^\s*Line (\d+) of function script\s*$/i,
              n = [],
              o = document.getElementsByTagName("script"),
              p = [];
            for (var q in o) c(o, q) && !o[q].src && p.push(o[q]);
            for (var r = 2; r < d.length; r += 2) {
              var s = null;
              if ((e = h.exec(d[r])))
                s = {
                  url: e[2],
                  func: e[3],
                  args: [],
                  line: +e[1],
                  column: null,
                };
              else if ((e = j.exec(d[r]))) {
                s = {
                  url: e[3],
                  func: e[4],
                  args: [],
                  line: +e[1],
                  column: null,
                };
                var t = +e[1],
                  u = p[e[2] - 1];
                if (u) {
                  var v = f(s.url);
                  if (v) {
                    v = v.join("\n");
                    var w = v.indexOf(u.innerText);
                    w >= 0 &&
                      (s.line = t + v.substring(0, w).split("\n").length);
                  }
                }
              } else if ((e = m.exec(d[r]))) {
                var x = a.location.href.replace(/#.*$/, ""),
                  y = new RegExp(k(d[r + 1])),
                  z = l(y, [x]);
                s = {
                  url: x,
                  func: "",
                  args: [],
                  line: z ? z.line : e[1],
                  column: null,
                };
              }
              if (s) {
                s.func || (s.func = g(s.url, s.line));
                var A = i(s.url, s.line),
                  B = A ? A[Math.floor(A.length / 2)] : null;
                A && B.replace(/^\s*/, "") === d[r + 1].replace(/^\s*/, "")
                  ? (s.context = A)
                  : (s.context = [d[r + 1]]),
                  n.push(s);
              }
            }
            return n.length
              ? { mode: "multiline", name: b.name, message: d[0], stack: n }
              : null;
          }
          function r(a, b, c, d) {
            var e = { url: b, line: c };
            if (e.url && e.line) {
              (a.incomplete = !1),
                e.func || (e.func = g(e.url, e.line)),
                e.context || (e.context = i(e.url, e.line));
              var f = / '([^']+)' /.exec(d);
              if (
                (f && (e.column = m(f[1], e.url, e.line)),
                a.stack.length > 0 && a.stack[0].url === e.url)
              ) {
                if (a.stack[0].line === e.line) return !1;
                if (!a.stack[0].line && a.stack[0].func === e.func)
                  return (
                    (a.stack[0].line = e.line),
                    (a.stack[0].context = e.context),
                    !1
                  );
              }
              return a.stack.unshift(e), (a.partial = !0), !0;
            }
            return (a.incomplete = !0), !1;
          }
          function s(a, b) {
            for (
              var c,
                d,
                f,
                i =
                  /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                j = [],
                k = {},
                l = !1,
                o = s.caller;
              o && !l;
              o = o.caller
            )
              if (o !== t && o !== e.report) {
                if (
                  ((d = {
                    url: null,
                    func: h,
                    args: [],
                    line: null,
                    column: null,
                  }),
                  o.name
                    ? (d.func = o.name)
                    : (c = i.exec(o.toString())) && (d.func = c[1]),
                  "undefined" == typeof d.func)
                )
                  try {
                    d.func = c.input.substring(0, c.input.indexOf("{"));
                  } catch (p) {}
                if ((f = n(o))) {
                  (d.url = f.url),
                    (d.line = f.line),
                    d.func === h && (d.func = g(d.url, d.line));
                  var q = / '([^']+)' /.exec(a.message || a.description);
                  q && (d.column = m(q[1], f.url, f.line));
                }
                k["" + o] ? (l = !0) : (k["" + o] = !0), j.push(d);
              }
            b && j.splice(0, b);
            var u = {
              mode: "callers",
              name: a.name,
              message: a.message,
              stack: j,
            };
            return (
              r(
                u,
                a.sourceURL || a.fileName,
                a.line || a.lineNumber,
                a.message || a.description
              ),
              u
            );
          }
          function t(a, b) {
            var c = null;
            b = null == b ? 0 : +b;
            try {
              if ((c = p(a))) return c;
            } catch (d) {
              if (v) throw d;
            }
            try {
              if ((c = o(a))) return c;
            } catch (d) {
              if (v) throw d;
            }
            try {
              if ((c = q(a))) return c;
            } catch (d) {
              if (v) throw d;
            }
            try {
              if ((c = s(a, b + 1))) return c;
            } catch (d) {
              if (v) throw d;
            }
            return { mode: "failed" };
          }
          function u(a) {
            a = (null == a ? 0 : +a) + 1;
            try {
              throw new Error();
            } catch (b) {
              return t(b, a + 1);
            }
          }
          var v = !1,
            w = {};
          return (
            (t.augmentStackTraceWithInitialElement = r),
            (t.guessFunctionName = g),
            (t.gatherContext = i),
            (t.ofCaller = u),
            (t.getSource = f),
            t
          );
        })()),
        (e.extendToAsynchronousCallbacks = function () {
          var b = function (b) {
            var c = a[b];
            a[b] = function () {
              var a = g.call(arguments),
                b = a[0];
              return (
                "function" == typeof b && (a[0] = e.wrap(b)),
                c.apply ? c.apply(this, a) : c(a[0], a[1])
              );
            };
          };
          b("setTimeout"), b("setInterval");
        }),
        e.remoteFetching || (e.remoteFetching = !0),
        e.collectWindowErrors || (e.collectWindowErrors = !0),
        (!e.linesOfContext || e.linesOfContext < 1) && (e.linesOfContext = 11),
        (a.TraceKit = e);
    }
  })("undefined" != typeof window ? window : global),
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define(b)
      : "object" == typeof exports
      ? (module.exports = b)
      : (a.atomic = b(a));
  })(HA, function (a) {
    "use strict";
    var b = {},
      c = { contentType: "application/json;charset=UTF-8" },
      d = function (a) {
        var b;
        try {
          b = JSON.parse(a.responseText);
        } catch (c) {
          b = a.responseText;
        }
        return [b, a];
      },
      e = function (a, b, e, f, g) {
        var h = {
            success: function () {},
            error: function () {},
            always: function () {},
          },
          i = window.XMLHttpRequest || ActiveXObject,
          j = new i("MSXML2.XMLHTTP.3.0");
        j.open(a, b, !0);
        var k = {};
        "string" == typeof f
          ? (k["Content-Type"] = f)
          : "object" == typeof f && (k = f),
          g ||
            (k.hasOwnProperty("Content-Type") ||
              j.setRequestHeader(
                "Content-Type",
                "undefined" == typeof k["Content-Type"]
                  ? c.contentType
                  : k["Content-Type"]
              ),
            j.setRequestHeader("Accept", c.contentType),
            j.setRequestHeader("X-Requested-With", "XMLHttpRequest"));
        for (var l in k) k.hasOwnProperty(l) && j.setRequestHeader(l, k[l]);
        (j.onreadystatechange = function () {
          var a;
          4 === j.readyState &&
            ((a = d(j)),
            j.status >= 200 && j.status < 300
              ? h.success.apply(h, a, j)
              : h.error.apply(h, a, j),
            h.always.apply(h, a, j));
        }),
          g || (e = "object" == typeof e ? JSON.stringify(e) : e),
          j.send(e);
        var m = {
          success: function (a) {
            return (h.success = a), m;
          },
          error: function (a) {
            return (h.error = a), m;
          },
          always: function (a) {
            return (h.always = a), m;
          },
        };
        return m;
      };
    return (
      (b.get = function (a, b, c) {
        return e("GET", a, b, c);
      }),
      (b.put = function (a, b, c) {
        return e("PUT", a, b, c);
      }),
      (b.post = function (a, b, c, d) {
        return e("POST", a, b, c, d);
      }),
      (b["delete"] = function (a, b, c) {
        return e("DELETE", a, b, c);
      }),
      (b.setContentType = function (a) {
        c.contentType = a;
      }),
      b
    );
  }),
  (HA.util = (function (a, b, c) {
    var d = function (a) {
        for (var b = 1, c = a.length; b < c; ++b) {
          var d = a[b],
            e = a[0];
          for (var f in d) {
            var g =
              "object" != HA.util.getType(e[f]) &&
              "object" != HA.util.getType(d[f]);
            g
              ? (e[f] = d[f])
              : (e[f] = HA.util.extend(
                  HA.util.isUndefined(e[f]) ? {} : e[f],
                  d[f]
                ));
          }
        }
        return a.length ? a[0] : {};
      },
      e = function (a) {
        a.removeAttribute("data-simplebindcollected");
      };
    return (
      (c.stripBindingMarkers = function (a) {
        var b = a.getElementsByTagName("*");
        e(a);
        for (var c = 0; c < b.length; ++c) e(b[c]);
      }),
      (c.extend = function () {
        return d(arguments);
      }),
      (c.sortByDate = function (a) {
        return function (b, c) {
          var d = new Date(b[a]).getTime(),
            e = new Date(c[a]).getTime();
          return d < e ? -1 : d > e ? 1 : 0;
        };
      }),
      (c.each = function (a, b) {
        var c = HA.util.getType(a);
        if ("array" == c || "nodelist" == c)
          for (var d = 0; d < a.length; ++d) b(a[d], d);
        else if ("object" == c) {
          var e = 0;
          for (var f in a) a.hasOwnProperty(f) && b(a[f], ++e, f);
        }
      }),
      (c.debounce = function (a, b) {
        var c;
        return function () {
          var d = this,
            e = arguments,
            f = function () {
              (c = null), a.apply(d, e);
            };
          clearTimeout(c), (c = setTimeout(f, b));
        };
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    var d = function (a, b, d) {
        "array" !== c.getType(a[b]) && (a[b] = [a[b]]), a[b].push(d);
      },
      e = function (a, b, c) {
        return (
          (a += a ? "&" : ""),
          (a += encodeURIComponent(b)),
          "" != c && (a += "=" + encodeURIComponent(String(c))),
          a
        );
      },
      f = function (a, b, d) {
        return (
          "array" === c.getType(b[d])
            ? c.each(b[d], function (b) {
                a = e(a, d, b);
              })
            : (a = e(a, d, b[d])),
          a
        );
      };
    c.querystring = function (a) {
      if ("string" == typeof a) {
        var b = {};
        if (a.indexOf("?") == -1) return b;
        a = a.split("?").pop().split("&");
        for (var c = 0; c < a.length; ++c) {
          var e = a[c].split("="),
            g = decodeURIComponent(e[0]);
          (val = e.length > 1 ? decodeURIComponent(e[1]) : ""),
            "undefined" == typeof b[g] ? (b[g] = val) : d(b, g, val);
        }
        return b;
      }
      var h = "";
      for (var g in a) a.hasOwnProperty(g) && (h = f(h, a, g));
      return h;
    };
    var g = "-";
    return (
      (c.slugify = function (a) {
        return a.replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, g);
      }),
      (c.urlString = function (a) {
        return (obj = {
          hash: a.indexOf("#") > -1 ? "#" + a.split("#").pop() : "",
          querystring:
            a.indexOf("?") > -1 ? a.split("?").pop().split("#").shift() : "",
          baseURL: a.split("?").shift().split("#").shift(),
        });
      }),
      (c.isValidCanadianZip = function (a) {
        var b = [3, 6];
        return (
          b.indexOf(a.replace(/\s/g, "").length) > -1 &&
          /^[A-Z]\d[A-Z][\s-]?/i.test(a)
        );
      }),
      (c.isValidUSZip = function (a) {
        return !isNaN(a) && 5 == a.replace(/\s+/g, "").length;
      }),
      (c.isValidZip = function (a) {
        return c.isValidCanadianZip(a) || c.isValidUSZip(a);
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    (c.isUndefined = function (a) {
      return "undefined" == typeof a;
    }),
      (c.isDefined = function (a) {
        return !c.isUndefined(a);
      });
    var d = function (a) {
        return "number" == typeof a.length && "function" == typeof a.item;
      },
      e = function (a) {
        return "object" == typeof HTMLElement
          ? a instanceof HTMLElement
          : a &&
              "object" == typeof a &&
              null !== a &&
              1 === a.nodeType &&
              "string" == typeof a.nodeName;
      },
      f = function (a) {
        return "object" == typeof Node
          ? a instanceof Node
          : a &&
              "object" == typeof a &&
              "number" == typeof a.nodeType &&
              "string" == typeof a.nodeName;
      };
    return (
      (c.getType = function (a) {
        var b = typeof a;
        switch (b) {
          case "object":
            return null == a
              ? "null"
              : a instanceof Array
              ? "array"
              : a instanceof RegExp
              ? "regexp"
              : a instanceof Date
              ? "date"
              : a.self == window
              ? "window"
              : d(a)
              ? "nodelist"
              : e(a)
              ? "element"
              : f(a)
              ? "node"
              : "object";
          default:
            return b;
        }
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    return (
      (c.findFirstInArray = function (a, b) {
        for (var c = void 0, d = 0; d < a.length; ++d)
          if (b(a[d])) {
            c = a[d];
            break;
          }
        return c;
      }),
      (c.findAllInArray = function (a, b) {
        for (var c = [], d = 0; d < a.length; ++d) b(a[d]) && c.push(a[d]);
        return c;
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    var d = { script: {}, link: {}, img: {} },
      e = { script: {}, link: {}, img: {} },
      f = function (a, b) {
        return "undefined" != typeof d[a] && "undefined" != typeof d[a][b];
      },
      g = function (a, b) {
        return "undefined" != typeof e[a] && "undefined" != typeof e[a][b];
      },
      h = function (c, h, i) {
        var j = null,
          k = !1,
          l = null;
        switch (c) {
          case "image":
          case "img":
            if (((l = "img"), (k = f(l, h)))) break;
            if (((alreadyLoading = g(l, h)), alreadyLoading)) break;
            (j = b.createElement(l)), j.setAttribute("src", h);
            break;
          case "javascript":
          case "js":
            if (((l = "script"), (k = f(l, h)))) break;
            if (((alreadyLoading = g(l, h)), alreadyLoading)) break;
            (j = b.createElement(l)), j.setAttribute("src", h);
            break;
          case "stylesheet":
          case "css":
            if (((l = "link"), (k = f(l, h)))) break;
            if (((alreadyLoading = g(l, h)), alreadyLoading)) break;
            (j = b.createElement(l)),
              j.setAttribute("rel", "stylesheet"),
              j.setAttribute("type", "text/css"),
              j.setAttribute("href", h);
        }
        return (
          (i = "function" == typeof i ? i : null),
          k
            ? (i && a.setTimeout(i, 0), d[l][h])
            : alreadyLoading
            ? (i && e[l][h].cbs.push(i), e[l][h].newElem)
            : (j &&
                ((cbs = i ? [i] : []),
                (e[l][h] = { newElem: j, cbs: cbs }),
                (j.onload = function () {
                  for (var a = 0; a < e[l][h].cbs.length; ++a)
                    e[l][h].cbs[a](null);
                  (d[l][h] = e[l][h].newElem), delete e[l][h];
                }),
                (j.onerror = function () {
                  for (var a = 0; a < e[l][h].cbs.length; ++a)
                    e[l][h].cbs[a](!0);
                  delete e[l][h];
                }),
                b.getElementsByTagName("head")[0].appendChild(j)),
              j)
        );
      };
    return (
      (c.loadAsset = function (a, b, c) {
        return "string" != typeof a || "string" != typeof b ? null : h(a, b, c);
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    var d = function (a, b, c, d) {
      var e = Array.prototype.map.call(arguments, function (a) {
          return (a / 180) * Math.PI;
        }),
        f = e[0],
        g = e[1],
        h = e[2],
        i = e[3],
        j = 6372.8,
        k = h - f,
        l = i - g,
        m =
          Math.sin(k / 2) * Math.sin(k / 2) +
          Math.sin(l / 2) * Math.sin(l / 2) * Math.cos(f) * Math.cos(h),
        n = 2 * Math.asin(Math.sqrt(m));
      return j * n * 0.621371;
    };
    return (
      (c.geo = {}),
      (c.geo.getDistance = function () {
        var a = 0;
        return (
          c.each(arguments, function (b) {
            a += d(b[0][0], b[0][1], b[1][0], b[1][1]);
          }),
          a
        );
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.util = (function (a, b, c) {
    var d = function (a, b, c, d) {
        return (
          (a /= d / 2),
          a < 1 ? (c / 2) * a * a + b : (a--, (-c / 2) * (a * (a - 2) - 1) + b)
        );
      },
      e = function (b, e, f, g) {
        var h = null,
          i = 0;
        (e.top = { destination: e.top, initial: c.window.getScrollTop(b) }),
          (e.left = {
            destination: e.left,
            initial: c.window.getScrollLeft(b),
          }),
          (e.top.delta = e.top.destination - e.top.initial),
          (e.left.delta = e.left.destination - e.left.initial);
        var j = function (c) {
          ++i, h || (h = c);
          var k = c - h;
          k < f
            ? ((e.top.current = e.top.delta
                ? d(k, e.top.initial, e.top.delta, f)
                : e.top.destination),
              (e.left.current = e.left.delta
                ? d(k, e.left.initial, e.left.delta, f)
                : e.left.destination))
            : ((e.top.current = e.top.destination),
              (e.left.current = e.left.destination)),
            b !== a
              ? ((b.scrollTop = e.top.current), (b.scrollLeft = e.left.current))
              : a.scrollTo(e.left.current, e.top.current),
            k < f ? a.requestAnimationFrame(j) : "function" == typeof g && g();
        };
        a.requestAnimationFrame(j);
      },
      f = function (a) {
        for (var c = 0, d = 0; a; ) {
          if ("BODY" == a.tagName) {
            var e = a.scrollLeft || b.documentElement.scrollLeft,
              f = a.scrollTop || b.documentElement.scrollTop;
            (c += a.offsetLeft - e + a.clientLeft),
              (d += a.offsetTop - f + a.clientTop);
          } else
            (c += a.offsetLeft - a.scrollLeft + a.clientLeft),
              (d += a.offsetTop - a.scrollTop + a.clientTop);
          a = a.offsetParent;
        }
        return { left: c, top: d };
      };
    return (
      (c.window = {}),
      (c.window.getWidth = function () {
        return Math.max(b.documentElement.clientWidth, a.innerWidth || 0);
      }),
      (c.window.getHeight = function () {
        return Math.max(b.documentElement.clientHeight, a.innerHeight || 0);
      }),
      (c.window.getViewportSize = function () {
        return { width: c.window.getWidth(), height: c.window.getHeight() };
      }),
      (c.window.getScrollLeft = function (c) {
        return (
          (c = "undefined" == typeof c ? a : c),
          void 0 !== c.pageXOffset
            ? c.pageXOffset
            : (c == a ? b.documentElement || b.body.parentNode || b.body : c)
                .scrollLeft
        );
      }),
      (c.window.getScrollTop = function (c) {
        return (
          (c = "undefined" == typeof c ? a : c),
          void 0 !== c.pageYOffset
            ? c.pageYOffset
            : (c == a ? b.documentElement || b.body.parentNode || b.body : c)
                .scrollTop
        );
      }),
      (c.window.getScrollPosition = function (a) {
        if ("undefined" == typeof a)
          return {
            top: c.window.getScrollTop(),
            left: c.window.getScrollLeft(),
          };
        var b = f(a),
          d = c.window.getScrollPosition();
        return { top: d.top + b.top, left: d.left + b.left };
      }),
      (c.window.setScrollPosition = function (a, b, d, f) {
        (f = "undefined" == typeof f ? window : f),
          isNaN(a) || (a = { top: a, left: c.window.getScrollLeft() }),
          "undefined" == typeof b
            ? ((f.scrollTop = a.top), (f.scrollLeft = a.left))
            : e(f, a, b, d);
      }),
      (c.window.scrollToElem = function (a, b, d, e, f) {
        (d = "undefined" == typeof d ? { top: 0, left: 0 } : d),
          (f = "boolean" == typeof f && f);
        var g = c.window.getScrollPosition(a);
        (g.top += d.top),
          (g.left += d.left),
          (g.top = Math.max(0, g.top)),
          (g.left = Math.max(0, g.left)),
          f && (g.left = 0),
          c.window.setScrollPosition(g, b, e);
      }),
      (c.window.scrollContainerToElem = function (a, b, d, e, f) {
        e = "undefined" == typeof e ? { top: 0, left: 0 } : e;
        var g = c.window.getScrollPosition(b);
        (g.top += e.top),
          (g.left += e.left),
          c.window.setScrollPosition(g, d, f, a);
      }),
      (c.window.getScreenOrientation = function () {
        var a = window.screen.orientation;
        return (
          90 == a.angle || a.angle == -90
            ? ((a.isLandscape = !0), (a.isPortrait = !1))
            : ((a.isLandscape = !1), (a.isPortrait = !0)),
          a
        );
      }),
      c
    );
  })(window, document, HA.util || {})),
  (HA.dom = (function (a, b, c) {
    var d = c.each,
      e = {
        filters: {
          ":visible": function (a, b) {
            return 0 != a.offsetHeight && 0 != a.offsetWidth;
          },
        },
      };
    Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (a) {
          for (
            var b = (this.document || this.ownerDocument).querySelectorAll(a),
              c = b.length;
            --c >= 0 && b.item(c) !== this;

          );
          return c > -1;
        });
    var f = function (a, c, d) {
        if (("undefined" == typeof d && (d = a.target), d.matches(c))) return d;
        var e = d.parentNode;
        return a.bubbles && e && e != b ? f(a, c, e) : null;
      },
      g = function (a, b) {
        return function (c) {
          var d = f(c, a);
          d && b.call(d, c);
        };
      },
      h = function (a, b, c, e) {
        d(a, function (a) {
          d(b.split(/\s+/), function (b) {
            e ? a.removeEventListener(b, c, !1) : a.addEventListener(b, c);
          });
        });
      },
      i = function (a) {
        for (var b = [], c = a.attributes, d = 0; d < c.length; ++d)
          b.push(c[d].nodeName);
        return b;
      },
      j = function (a) {
        var b = {};
        return (
          d(a, function (a, c) {
            d(i(a), function (c, d) {
              if (0 == c.indexOf("data-")) {
                var e = a.getAttribute(c);
                isNaN(e) || (e = +e),
                  (b[
                    c.substring(5).replace(/-([a-z])/gi, function (a) {
                      return a[1].toUpperCase();
                    })
                  ] = e);
              }
            });
          }),
          b
        );
      },
      k = function (a, b) {
        d(b, function (a, c, d) {
          delete b[d],
            (b[d.replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2")] =
              a);
        }),
          d(a, function (a, c) {
            d(b, function (b, c, d) {
              a.setAttribute("data-" + d, b);
            });
          });
      },
      l = (function () {
        return "createEvent" in document
          ? function (a, b) {
              var c = document.createEvent("HTMLEvents");
              c.initEvent(b, !1, !0), a.dispatchEvent(c);
            }
          : function (a, b) {
              a.fireEvent("on" + b);
            };
      })(),
      m = function (a, b) {
        d(a, function (a) {
          l(a, b);
        });
      },
      n = function (a, b) {
        var c = " " + a.getAttribute("class") + " ";
        return c.indexOf(" " + b + " ") > -1;
      },
      o = function (a, b) {
        var c = b.split(/\s+/),
          e = !0;
        return (
          d(a, function (a, b) {
            d(c, function (b) {
              n(a, b) || (e = !1);
            });
          }),
          e
        );
      },
      p = function (a, b, c) {
        var d = " " + a.getAttribute("class") + " ";
        (d = d.replace(" " + b + " ", " " + c + " ")),
          a.setAttribute("class", d.replace(/^\s+|\s+$/g, ""));
      },
      q = function (a, b) {
        d(a, function (a, c) {
          d(b, function (b, c) {
            if (!n(a, b)) {
              var d = a.getAttribute("class");
              a.setAttribute("class", d ? d + " " + b : b);
            }
          });
        });
      },
      r = function (a, b) {
        d(a, function (a, c) {
          d(b, function (b, c) {
            n(a, b) && p(a, b, "");
          });
        });
      },
      s = function (a, b) {
        d(a, function (a, c) {
          d(b, function (b, c, d) {
            "undefined" != typeof b
              ? a.setAttribute(d, b)
              : a.removeAttribute(d);
          });
        });
      },
      t = function (a) {
        for (var b = [], c = 0; c < a.length; ++c) b.push(a[c]);
        return b;
      },
      u = function (a, f) {
        if ("undefined" == typeof f)
          if ("string" == typeof a) f = b.querySelectorAll(a);
          else {
            var i = HA.util.getType(a);
            f = "array" == i || "object" == i ? a : [a];
          }
        var l = {};
        return (
          (l.find = function (a) {
            var b = [];
            return (
              d(f, function (c, e) {
                d(c.querySelectorAll(a), function (a, c) {
                  b.push(a);
                });
              }),
              u(a, b)
            );
          }),
          (l.filter = function (b) {
            if (
              ((b = "string" == typeof b ? e.filters[b] : b),
              "function" != typeof b)
            )
              return u(a, f);
            var c = [];
            return (
              d(f, function (a) {
                b(a) && c.push(a);
              }),
              u(a, c)
            );
          }),
          (l.registerFilter = function (b, c) {
            return "function" == typeof c && (e.filters[b] = c), u(a, f);
          }),
          (l.addClass = function (b) {
            var c = [];
            return (
              d(arguments, function (a) {
                c = c.concat(a.split(/\s+/));
              }),
              q(f, c),
              u(a, f)
            );
          }),
          (l.removeClass = function (b) {
            var c = [];
            return (
              d(arguments, function (a) {
                c = c.concat(a.split(/\s+/));
              }),
              r(f, c),
              u(a, f)
            );
          }),
          (l.toggleClass = function (b) {
            return (
              d(f, function (a) {
                n(a, b) ? p(a, b, "") : q([a], b.split(/\s+/));
              }),
              u(a, f)
            );
          }),
          (l.attrs = function (b) {
            return s(f, b), u(a, f);
          }),
          (l.on = function (b) {
            var c = [].slice.call(arguments);
            if (c.length >= 2)
              if ("function" == typeof c[1]) {
                var d = c.length >= 3 && "boolean" == typeof c[2] && c[2],
                  e = c[1];
                h(f, b, e, d);
              } else if ("string" == typeof c[1] && "function" == typeof c[2]) {
                var e = c[2],
                  i = c[1],
                  d = c.length >= 4 && "boolean" == typeof c[3] && c[3];
                h(f, b, g(i, e), d);
              }
            var j = typeof cb;
            return (
              "function" == j &&
                ((d = "boolean" == typeof d && d), h(f, b, cb, d)),
              u(a, f)
            );
          }),
          (l.first = function () {
            return f.length ? f[0] : null;
          }),
          (l.last = function () {
            return u(f.length ? [f[f.length - 1]] : []);
          }),
          (l.parent = function () {
            var a = [];
            return (
              d(f, function (b, c) {
                b.parentNode && a.push(b.parentNode);
              }),
              u(a)
            );
          }),
          (l.toArray = function () {
            return t(f);
          }),
          (l.hasClass = function (a) {
            return o(f, a);
          }),
          (l.each = function (b) {
            return d(f, b), u(a, f);
          }),
          (l.trigger = function (b) {
            return m(f, b), u(a, f);
          }),
          (l.offset = function () {
            return 0 == f.length ? null : c.window.getScrollPosition(f[0]);
          }),
          (l.data = function (b) {
            return "undefined" == typeof b ? j(f) : (k(f, b), u(a, f));
          }),
          (l.ready = function (a) {
            h(f, "DOMContentLoaded", a, !1);
          }),
          l
        );
      };
    return u;
  })(window, document, HA.util)),
  (HA.dom.extend = function (a) {
    return HA.util.extend.apply(this, arguments);
  }),
  (HA.dom.param = function (a) {
    return HA.util.querystring(a);
  }),
  (HA.dom.each = function (a, b) {
    return HA.util.each(a, b);
  }),
  (HA.dom.registerFilter = function (a, b) {
    HA.dom().registerFilter(a, b);
  }),
  (HA.services = (function (a, b, c, d, e) {
    var f,
      g,
      h = {},
      i = {},
      j = function () {
        var a = {},
          c = window.location.search;
        !c &&
          b.location.hash.indexOf("?") > -1 &&
          (c = "?" + b.location.hash.split("?").pop()),
          0 == c.indexOf("?") && (c = c.substring(1)),
          (c = c.split("&"));
        for (var d = 0; d < c.length; ++d) {
          var e = c[d].split("=");
          a[e[0]] = e.length > 1 ? e[1] : "";
        }
        return a;
      },
      k = function (a) {
        var b,
          c = [];
        for (b in a)
          a.hasOwnProperty(b) &&
            c.push(encodeURIComponent(b) + "=" + encodeURIComponent(a[b]));
        return c.join("&");
      },
      l = function (a) {
        return "r_username" == a || "r_accesskey" == a;
      },
      m = function (a, b) {
        for (var c in a)
          if (!(l(c) || (b.hasOwnProperty(c) && b[c] === a[c]))) return !1;
        for (var c in b)
          if (!(l(c) || (a.hasOwnProperty(c) && a[c] === b[c]))) return !1;
        return !0;
      },
      n = function (a, b) {
        var c = HA.util.getType(a),
          d = void 0;
        if (
          (("array" != c && "object" != c) ||
            (d = JSON.parse(JSON.stringify(a))),
          "undefined" != typeof d)
        )
          for (var e = 0; e < b.responseFilters.length; ++e)
            d = b.responseFilters[e](d);
        return "undefined" == typeof d ? a : d;
      },
      o = function (a) {
        var b = c.param(a),
          d = a.split("?").shift(),
          e = null;
        if ("undefined" != typeof i[a]) return (e = a);
        for (var f in i)
          if (f.split("?").shift() == d) {
            var g = c.param(f);
            if (m(b, g)) {
              e = f;
              break;
            }
          }
        return e;
      },
      p = function (a, b) {
        var c = o(a),
          d = void 0;
        return null != c && (d = n(i[c], b)), d;
      },
      q = function (a, b) {
        if ("object" == typeof b)
          try {
            var c = HA.util.getType(b);
            ("object" != c && "array" != c) ||
              (i[a] = JSON.parse(JSON.stringify(b)));
          } catch (d) {}
      },
      r = function (a) {
        var b = o(a);
        b && delete i[b];
      },
      s = function (b) {
        var c = b.getResponseHeader("Ar-Values");
        if (c && "object" == typeof a.s_sm) {
          var d = s_sm.list2 || "",
            e = d.split(",").reduce(function (a, b) {
              return (a[b] = !0), a;
            }, {});
          c.split(",").reduce(function (a, b) {
            return (e[b] = !0), a;
          }, e),
            c != d &&
              ((s_sm.linkTrackVars =
                s_sm.linkTrackVars && s_sm.linkTrackVars.length
                  ? ",list2"
                  : "list2"),
              (s_sm.list2 = c),
              s_sm.trackLinkWrapper(!0, "o", "API Action-Rule Logging"),
              (s_sm.linkTrackVars = s_sm.linkTrackVars
                .split(",")
                .filter(function (a) {
                  return "eVar2" != a;
                })
                .join(",")));
        }
      },
      t = function () {
        h = j();
      };
    c(b).ready(t),
      (f = {
        r_username:
          "undefined" != typeof a.userKey ? a.userKey : "cammlagoogle",
        r_accesskey:
          "undefined" != typeof a.accessKey ? a.accessKey : "43xNWjRy",
      }),
      (g = function (e, g) {
        var i, j;
        if (
          ((i = e.type),
          (j = new Date().getTime()),
          (m = !1),
          "undefined" != typeof h.simfail && e.name && "prod" != s_env)
        ) {
          var l = "," + h.simfail + ",";
          if (l.indexOf("," + e.name + ",") > -1) {
            var m = !0,
              n =
                "undefined" == typeof h.simfaildelay
                  ? 7e3 * Math.random()
                  : parseInt(h.simfaildelay),
              o = "undefined" == typeof h.simfailstatus ? 0 : h.simfailstatus;
            a.setTimeout(function () {
              g({ simfail: !0, message: "Simulated Error", statusId: o }, null);
            }, n);
          }
        }
        if (
          ("undefined" == typeof e.data ||
            e.multipart ||
            (e.formEncoded
              ? (e.data = k(e.data))
              : (e.data = JSON.stringify(e.data))),
          !m)
        ) {
          if (e.cleanParams) var r = c.param(e.params);
          else var r = c.param(c.extend({}, f, e.params));
          i = i.toLowerCase();
          var t = e.url.indexOf("?") === -1 ? "?" : "&",
            u = e.url + t + r,
            v = void 0;
          if (
            (e.cache && (v = p(e.cacheUrlClassifier(u, e), e)),
            "undefined" != typeof v)
          )
            a.setTimeout(function () {
              "function" == typeof g && g(null, v, 0);
            }, 0);
          else if ("function" == typeof d[i]) {
            var w = {
                "Content-Type": e.formEncoded
                  ? "application/x-www-form-urlencoded"
                  : "application/json;charset=UTF-8",
              },
              x = c.extend({}, w, e.headers);
            e.multiPartFormData && delete x["Content-Type"],
              d[i](u, e.data, x, e.multipart)
                .success(function (a, b) {
                  q(e.cacheUrlClassifier(u, e), a, e), s(b);
                  for (var c = 0; c < e.responseFilters.length; ++c)
                    a = e.responseFilters[c](a);
                  "function" == typeof g &&
                    g(null, a, new Date().getTime() - j, b);
                })
                .error(function (c, d) {
                  try {
                    c = JSON.parse(d.responseText);
                  } catch (f) {
                    c = {
                      message:
                        "string" == typeof d.responseText
                          ? "String: " + d.responseText
                          : "Unknown",
                      path: u,
                      statusTimeStamp: new Date().getTime(),
                      subStatusId: 0,
                    };
                  }
                  (c.responseTimeMS = new Date().getTime() - j),
                    "undefined" == typeof c.statusId &&
                      "undefined" != typeof d.status &&
                      (c.statusId = d.status);
                  var h =
                      "object" == typeof a.s_sm
                        ? s_sm.pageName || b.location.href
                        : b.location.href,
                    i = "API Error: " + e.name + ": " + c.statusId + ": " + h;
                  "function" == typeof e.errorFormatter &&
                    (i = e.errorFormatter(c, i));
                  var k = e.reportError;
                  "function" == typeof e.reportError &&
                    ((k = e.reportError(c)), console.log("here")),
                    k &&
                      "undefined" != typeof window.s_sm &&
                      "function" == typeof s_sm.trackLinkWrapper &&
                      s_sm.trackLinkWrapper(!0, "o", i),
                    k &&
                      "object" == typeof a.HA &&
                      "undefined" != typeof HA.errorReporter &&
                      HA.errorReporter["throw"](c, {
                        field_name: i,
                        page_name: h,
                      }),
                    "function" == typeof g && g(c, null);
                });
          }
        }
      });
    var u = {
      responseFilters: [],
      cache: !1,
      reportError: !0,
      type: "GET",
      headers: {},
      name: !1,
      params: {},
      formEncoded: !1,
      cleanParams: !1,
      multipart: !1,
      cacheUrlClassifier: function (a, b) {
        return a;
      },
      multiPartFormData: !1,
    };
    return (
      (e.performRequest = function (a, b) {
        if (((a.multipart = a.multipart || a.multiPartFormData), a.multipart)) {
          var d = a.data;
          delete a.data, (a = c.extend({}, u, a)), (a.data = d);
        } else a = c.extend({}, u, a);
        return g(a, b);
      }),
      (e.registerAuth = function (a) {
        c.extend(f, a);
      }),
      (e.auth = f),
      (e.getSearchObject = function () {
        return j();
      }),
      (e.purgeCachedData = function (a) {
        return r(a);
      }),
      (e.cache = i),
      e
    );
  })(window, document, HA.dom, HA.atomic, HA.services || {})),
  (HA.services = (function (a) {
    var b = {};
    return (
      (a.postToSiteLog = function (c, d) {
        var e = {
          url: "/api/resource/sitelog/log/",
          type: "POST",
          params: { r_username: "ob_cons_web_api", r_accesskey: "PBwebmRh" },
          reportError: !1,
          formEncoded: !0,
          data: c,
        };
        "undefined" != typeof c.error_data
          ? ("undefined" == typeof b[c.error_data] && (b[c.error_data] = 0),
            ++b[c.error_data],
            b[c.error_data] <= 10
              ? a.performRequest(e, d)
              : d({ message: "Request already fulfilled" }, null))
          : a.performRequest(e, d);
      }),
      a
    );
  })(HA.services || {})),
  (HA.errorReporter = (function (a, b, c, d) {
    var e = {
        pageName:
          "object" == typeof a.s_sm && "undefined" != typeof s_sm.pageName
            ? s_sm.pageName
            : b.location.href,
        tracekitErrors: {
          siteLogUrl:
            "/api/resource/sitelog/log/?r_username=ob_cons_web_api&r_accesskey=PBwebmRh",
          siteLogErrorId: 101,
          fieldLimits: { error_data: 3999, field_name: 199 },
        },
      },
      f = function (a) {
        (a.error_data = a.error_data.substring(
          0,
          e.tracekitErrors.fieldLimits.error_data
        )),
          (a.error_id = a.error_id || e.tracekitErrors.siteLogErrorId),
          (a.page_name = a.page_name || e.pageName),
          (a.field_name = a.field_name.substring(
            0,
            e.tracekitErrors.fieldLimits.field_name
          ));
        c.postToSiteLog(a, function (a, b) {});
        return !0;
      },
      g = function (a) {
        return f({ error_data: JSON.stringify(a), field_name: a.message }), !0;
      };
    return (
      TraceKit.report.subscribe(g),
      (d.setPageName = function (a) {
        e.pageName = a;
      }),
      (d["throw"] = function (a, b) {
        var c = {
          field_name: "Critical App Error for " + e.pageName,
          error_data: "object" == typeof a ? JSON.stringify(a) : a,
        };
        "object" == typeof b &&
          ((c.field_name = b.field_name || c.field_name),
          (c.error_data = b.error_data || c.error_data),
          b.error_id && (c.error_id = b.error_id),
          b.page_name && (c.page_name = b.page_name)),
          f(c);
      }),
      (d.settings = e),
      d
    );
  })(window, document, HA.services, HA.errorReporter || {})),
  (HA.services = (function (a, b, c, d) {
    var e = function (a, b) {
        a instanceof Array
          ? f(a, function (c, d) {
              c ? b(c, null, a) : b(null, d, a);
            })
          : "function" == typeof d[a.name]
          ? d[a.name](a.req, function (c, d) {
              c ? b(c, null, a) : b(null, d, a);
            })
          : (console.error("Type error: step.name is not a function."),
            b(
              { error: "Type error: step.name is not a function." },
              null,
              a.name
            ));
      },
      f = function (a, b) {
        for (
          var d = null,
            f = {},
            g = 0,
            h = function (e, h, i) {
              ++g;
              var j = "undefined" == typeof i.uid ? i.name : i.uid;
              e
                ? ((d = null == d ? {} : d), (d[j] = e), (f[j] = null))
                : "undefined" == typeof j
                ? (f = c.extend(f, h))
                : (f[j] = h),
                g == a.length && b(d, f);
            },
            i = 0;
          i < a.length;
          ++i
        )
          e(a[i], h);
      };
    return (
      (d.steps = function (a, b) {
        f(a, b);
      }),
      d
    );
  })(window, document, HA.dom, HA.services || {})),
  (HA.services = (function (a, b, c, d) {
    var e = "__cache.";
    if ("function" == typeof a.jsonCtrl) {
      var f = jsonCtrl().model;
      for (var g in f)
        if (0 == g.indexOf(e)) {
          var h = g.split(e).pop(),
            i = c.param(h);
          h.indexOf("?") > -1 && (h = h.split("?").shift() + "?" + c.param(i)),
            (d.cache[h] = f[g]),
            delete f[g];
        }
    }
    return d;
  })(window, document, HA.dom, HA.services || {})),
  (HA.services = (function (a, b, c, d) {
    var e = function (a, b) {
        if ("$base" == b || "" === b) return a;
        b = b.split(".");
        for (var c = 0; c < b.length; ++c) {
          if ("$base" == b[c]) return a;
          if (null == a) return "";
          if ("undefined" == typeof a[b[c]]) return "";
          if (null === a) return "";
          a = a[b[c]];
        }
        return a;
      },
      f = function (a, b) {
        var d = {};
        return (
          c.each(b, function (b, c, g) {
            d[g] = "string" == typeof b ? e(a, b) : f(a, b);
          }),
          d
        );
      };
    return (
      (d.transformRequest = function (a, b) {
        return "object" != typeof a || "object" != typeof b ? a : f(a, b);
      }),
      (d.transformerReverseLookup = function (a, b) {
        return e(b, a);
      }),
      d
    );
  })(window, document, HA.dom, HA.services || {}));
var EmitterFactory = (function (w, d, pub) {
  var Factory = function (module) {
    module = typeof module == "undefined" ? {} : module;
    var state = { eventSubscribers: {} };
    module.emit = function (evtName, evt) {
      if (typeof state.eventSubscribers[evtName] != "undefined") {
        for (var i = 0; i < state.eventSubscribers[evtName].length; ++i) {
          state.eventSubscribers[evtName][i](evt);
        }
      }
      return module;
    };
    module.on = function (evtName, cb) {
      if (typeof cb == "function") {
        state.eventSubscribers[evtName] =
          typeof state.eventSubscribers[evtName] == "undefined"
            ? []
            : state.eventSubscribers[evtName];
        state.eventSubscribers[evtName].push(cb);
      }
      return module;
    };
    return module;
  };
  return Factory;
})(window, document);
(function () {
  function h(a) {
    a = Array.isArray(a)
      ? { label: a[0], value: a[1] }
      : "object" === typeof a && "label" in a && "value" in a
      ? a
      : { label: a, value: a };
    this.label = a.label || a.value;
    this.value = a.value;
  }
  function n(a, b, d) {
    for (var g in b) {
      var f = b[g],
        c = a.input.getAttribute("data-" + g.toLowerCase());
      a[g] =
        "number" === typeof f
          ? parseInt(c)
          : !1 === f
          ? null !== c
          : f instanceof Function
          ? null
          : c;
      a[g] || 0 === a[g] || (a[g] = g in d ? d[g] : f);
    }
  }
  function c(a, b) {
    return "string" === typeof a ? (b || document).querySelector(a) : a || null;
  }
  function k(a, b) {
    return l.call((b || document).querySelectorAll(a));
  }
  function m() {
    k("input.awesomplete").forEach(function (a) {
      new e(a);
    });
  }
  var e = function (a, b) {
    var d = this;
    this.input = c(a);
    this.input.setAttribute("autocomplete", "off");
    this.input.setAttribute("aria-autocomplete", "list");
    b = b || {};
    n(
      this,
      {
        minChars: 2,
        maxItems: 10,
        autoFirst: !1,
        data: e.DATA,
        filter: e.FILTER_CONTAINS,
        sort: e.SORT_BYLENGTH,
        item: e.ITEM,
        replace: e.REPLACE,
      },
      b
    );
    this.index = -1;
    this.container = c.create("div", { className: "awesomplete", around: a });
    this.ul = c.create("ul", { hidden: "hidden", inside: this.container });
    this.status = c.create("span", {
      className: "visually-hidden",
      role: "status",
      "aria-live": "assertive",
      "aria-relevant": "additions",
      inside: this.container,
    });
    c.bind(this.input, {
      input: this.evaluate.bind(this),
      blur: this.close.bind(this),
      keydown: function (a) {
        var b = a.keyCode;
        if (d.opened)
          if (13 === b && d.selected) a.preventDefault(), d.select();
          else if (27 === b) d.close();
          else if (38 === b || 40 === b)
            a.preventDefault(), d[38 === b ? "previous" : "next"]();
      },
    });
    c.bind(this.input.form, { submit: this.close.bind(this) });
    c.bind(this.ul, {
      mousedown: function (a) {
        var b = a.target;
        if (b !== this) {
          for (; b && !/li/i.test(b.nodeName); ) b = b.parentNode;
          b && 0 === a.button && (a.preventDefault(), d.select(b, a.target));
        }
      },
    });
    this.input.hasAttribute("list")
      ? ((this.list = "#" + this.input.getAttribute("list")),
        this.input.removeAttribute("list"))
      : (this.list = this.input.getAttribute("data-list") || b.list || []);
    e.all.push(this);
  };
  e.prototype = {
    set list(a) {
      if (Array.isArray(a)) this._list = a;
      else if ("string" === typeof a && -1 < a.indexOf(","))
        this._list = a.split(/\s*,\s*/);
      else if ((a = c(a)) && a.children) {
        var b = [];
        l.apply(a.children).forEach(function (a) {
          if (!a.disabled) {
            var c = a.textContent.trim(),
              f = a.value || c;
            a = a.label || c;
            "" !== f && b.push({ label: a, value: f });
          }
        });
        this._list = b;
      }
      document.activeElement === this.input && this.evaluate();
    },
    get selected() {
      return -1 < this.index;
    },
    get opened() {
      return !this.ul.hasAttribute("hidden");
    },
    close: function () {
      this.ul.setAttribute("hidden", "");
      this.index = -1;
      c.fire(this.input, "awesomplete-close");
    },
    open: function () {
      this.ul.removeAttribute("hidden");
      this.autoFirst && -1 === this.index && this["goto"](0);
      c.fire(this.input, "awesomplete-open");
    },
    next: function () {
      this["goto"](
        this.index < this.ul.children.length - 1 ? this.index + 1 : -1
      );
    },
    previous: function () {
      var a = this.ul.children.length;
      this["goto"](this.selected ? this.index - 1 : a - 1);
    },
    goto: function (a) {
      var b = this.ul.children;
      this.selected && b[this.index].setAttribute("aria-selected", "false");
      this.index = a;
      -1 < a &&
        0 < b.length &&
        (b[a].setAttribute("aria-selected", "true"),
        (this.status.textContent = b[a].textContent),
        c.fire(this.input, "awesomplete-highlight", {
          text: this.suggestions[this.index],
        }));
    },
    select: function (a, b) {
      a ? (this.index = c.siblingIndex(a)) : (a = this.ul.children[this.index]);
      if (a) {
        var d = this.suggestions[this.index];
        c.fire(this.input, "awesomplete-select", { text: d, origin: b || a }) &&
          (this.replace(d),
          this.close(),
          c.fire(this.input, "awesomplete-selectcomplete", { text: d }));
      }
    },
    evaluate: function () {
      var a = this,
        b = this.input.value;
      b.length >= this.minChars && 0 < this._list.length
        ? ((this.index = -1),
          (this.ul.innerHTML = ""),
          (this.suggestions = this._list
            .map(function (d) {
              return new h(a.data(d, b));
            })
            .filter(function (d) {
              return a.filter(d, b);
            })
            .sort(this.sort)
            .slice(0, this.maxItems)),
          this.suggestions.forEach(function (d) {
            a.ul.appendChild(a.item(d, b));
          }),
          0 === this.ul.children.length ? this.close() : this.open())
        : this.close();
    },
  };
  e.all = [];
  e.FILTER_CONTAINS = function (a, b) {
    return RegExp(c.regExpEscape(b.trim()), "i").test(a);
  };
  e.FILTER_STARTSWITH = function (a, b) {
    return RegExp("^" + c.regExpEscape(b.trim()), "i").test(a);
  };
  e.SORT_BYLENGTH = function (a, b) {
    return a.length !== b.length ? a.length - b.length : a < b ? -1 : 1;
  };
  e.ITEM = function (a, b) {
    var d =
      "" === b
        ? a
        : a.replace(RegExp(c.regExpEscape(b.trim()), "gi"), "<mark>$&</mark>");
    return c.create("li", { innerHTML: d, "aria-selected": "false" });
  };
  e.REPLACE = function (a) {
    this.input.value = a.value;
  };
  e.DATA = function (a) {
    return a;
  };
  Object.defineProperty(
    (h.prototype = Object.create(String.prototype)),
    "length",
    {
      get: function () {
        return this.label.length;
      },
    }
  );
  h.prototype.toString = h.prototype.valueOf = function () {
    return "" + this.label;
  };
  var l = Array.prototype.slice;
  c.create = function (a, b) {
    var d = document.createElement(a),
      g;
    for (g in b) {
      var f = b[g];
      "inside" === g
        ? c(f).appendChild(d)
        : "around" === g
        ? ((f = c(f)), f.parentNode.insertBefore(d, f), d.appendChild(f))
        : g in d
        ? (d[g] = f)
        : d.setAttribute(g, f);
    }
    return d;
  };
  c.bind = function (a, b) {
    if (a)
      for (var d in b) {
        var c = b[d];
        d.split(/\s+/).forEach(function (b) {
          a.addEventListener(b, c);
        });
      }
  };
  c.fire = function (a, b, c) {
    var e = document.createEvent("HTMLEvents");
    e.initEvent(b, !0, !0);
    for (var f in c) e[f] = c[f];
    return a.dispatchEvent(e);
  };
  c.regExpEscape = function (a) {
    return a.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };
  c.siblingIndex = function (a) {
    for (var b = 0; (a = a.previousElementSibling); b++);
    return b;
  };
  "undefined" !== typeof Document &&
    ("loading" !== document.readyState
      ? m()
      : document.addEventListener("DOMContentLoaded", m));
  e.$ = c;
  e.$$ = k;
  "undefined" !== typeof self && (self.Awesomplete = e);
  "object" === typeof module && module.exports && (module.exports = e);
  return e;
})();
HA.services = (function (w, d, $, pub) {
  var prefix = "/api";
  var taskSearchDefaults = { count: 10 };
  pub.taskSearch = function (request, cb) {
    request = $.extend({}, taskSearchDefaults, request);
    var opts = {
      url: prefix + "/resource/task/siteSearch",
      name: "site_search_awesomplete",
      params: {
        query: encodeURIComponent(request.query),
        showAll: "y",
        popsort: true,
        count: request.count,
        entropy: false,
        recordSearch: false,
        includeGigEconomy: true,
        options: request.options,
      },
      responseFilters: [
        function (resp) {
          resp.tasks = resp.tasks.filter(function (task) {
            return task.taskOid > 0;
          });
          resp.tasks.push({ taskDescription: "View All Results", taskOid: -1 });
          return resp;
        },
      ],
      cache: true,
    };
    pub.performRequest(opts, cb);
  };
  pub.getTaskSearchSuggestions = function (request, cb) {
    request = $.extend({}, taskSearchDefaults, request);
    var opts = {
      url: prefix + "/resource/v1/site-search/suggest",
      name: "site_search_new_autocomplete",
      params: {
        query: encodeURIComponent(request.query),
        count: request.count,
        options: request.options,
      },
      responseFilters: [
        function (resp) {
          resp.tasks = resp.tasks.filter(function (task) {
            return task.oid > 0;
          });
          resp.tasks.push({ description: "View All Results", taskOid: -1 });
          return resp;
        },
      ],
      cache: true,
    };
    pub.performRequest(opts, cb);
  };
  pub.getPopularSearches = function (cb) {
    var options = {
      url: prefix + "/resource/v1/site-search/popular-searches",
      name: "site_search_popular_searches",
      params: {},
      responseFilters: [
        function (resp) {
          resp.unshift({
            taskDescription: "Popular Services",
            description: "Popular Services",
            url: "",
            taskOid: 0,
            isTitle: true,
          });
          return resp;
        },
      ],
      cache: true,
    };
    pub.performRequest(options, cb);
  };
  pub.sendSiteSearchAnalyticsEvents = function (request, cb) {
    var options = {
      url: prefix + "/resource/v1/site-search/analytics",
      name: "site_search_analytics",
      data: request,
      type: "POST",
      cache: true,
    };
    pub.performRequest(options, cb);
  };
  pub.getTask = function (request, cb) {
    var opts = {
      url: prefix + "/resource/task/" + request.taskOid + "/",
      name: "get_task_awesomplete",
      params: { r_version: 1 },
      cache: true,
    };
    pub.performRequest(opts, cb);
  };
  return pub;
})(window, document, HA.dom, HA.services || {});
HA = window.HA || {};
HA.analytics = (function (w, d, $, services, pub) {
  pub.triggerAutocompleteOMNIEvents = function (
    description,
    rank,
    placement,
    query
  ) {
    var addlVars = [
      { eVarName: "eVar130", value: description },
      { eVarName: "eVar131", value: rank },
      { eVarName: "eVar132", value: placement },
      { eVarName: "eVar42", value: query },
    ];
    s_sm.fireSimpleEvent("event7", "Autocomplete Item Selected", addlVars);
  };
  pub.triggerAutocompleteResultSelectionEvent = function (
    placement,
    searchQuery,
    rank,
    title,
    userAction,
    taskOid,
    catOid
  ) {
    var request = {
      displayName: placement + " Autocomplete Result Selection",
      userAction: userAction,
      pageName: placement,
      subType: "result_selection",
      query: searchQuery,
      taskOid: taskOid,
      categoryOid: catOid,
      eventMetadata: {
        placement: placement,
        resultRank: rank,
        elementTitle: title,
      },
    };
    fireSiteSearchAnalytics(request);
  };
  pub.triggerSRPResultSelectionEvent = function (
    searchQuery,
    taskRank,
    taskCount,
    taskTitle,
    startIndex,
    resultsSize
  ) {
    var request = {
      displayName: "Search Results Page Result Selection",
      userAction: "link_click",
      pageName: "Search Results",
      subType: "result_selection",
      query: searchQuery,
      eventMetadata: {
        placement: "Search Results Page",
        resultRank: taskRank,
        elementTitle: taskTitle,
        resultListStartIndex: startIndex + 1,
        resultListEndIndex: startIndex + taskCount,
        resultListSize: resultsSize,
      },
    };
    fireSiteSearchAnalytics(request);
  };
  pub.triggerSiteSearchSubmitEvent = function (
    placement,
    searchQuery,
    userAction,
    pageName
  ) {
    var request = {
      displayName: placement + " Search Submit",
      userAction: userAction,
      pageName: pageName,
      subType: "submit",
      query: searchQuery,
      eventMetadata: { placement: placement },
    };
    fireSiteSearchAnalytics(request);
  };
  pub.triggerSiteSearchEngagementEvent = function (placement) {
    var placementName = placement + " Search Engagement";
    var omniPlacementName = "Guest Home";
    var request = {
      subType: "engagement",
      displayName: placementName,
      userAction: "input_click",
      pageName: placement,
      eventMetadata: { placement: placement },
    };
    var addlVars = [{ eVarName: "eVar132", value: placement }];
    s_sm.fireSimpleEvent("event413", omniPlacementName, addlVars);
    fireSiteSearchAnalytics(request);
  };
  function fireSiteSearchAnalytics(request) {
    request = $.extend({}, getSiteSearchDefaults(), request);
    services.sendSiteSearchAnalyticsEvents(request);
  }
  function getSiteSearchDefaults() {
    var userID = "0";
    var sessionID = "unknown";
    if (
      dataLayer &&
      dataLayer[1] &&
      dataLayer[1].userID &&
      dataLayer[1].sessionID
    ) {
      userID = dataLayer[1].userID;
      sessionID = dataLayer[1].sessionID;
    }
    return {
      type: "search",
      userId: userID,
      sessionId: sessionID,
      pageUrl: w.location.href,
      clientData: {
        screenResolution:
          (w.innerWidth || d.body.clientWidth) +
          "x" +
          (w.innerHeight || d.body.clientHeight),
        browser: w.navigator.userAgent,
      },
      datetime: new Date().toISOString(),
    };
  }
  return pub;
})(window, document, HA.dom, HA.services, HA.analytics || {});
HA = window.HA || {};
HA.taskSearch = (function (w, d, $, api, util, analytics, pub) {
  var keyCodes = {
    DOWN_KEY: 40,
    UP_KEY: 38,
    ENTER_KEY: 13,
    TAB_KEY: 9,
    ARROW_RIGHT_KEY: 39,
  };
  var settings = {
    legacy_inputSelector: "[data-task-search]",
    legacy_headerInputSelector: "[data-task-header-search]",
    legacy_containerClass: "autocomplete-wrapper",
    legacy_headerContainerClass: "header-search-container",
    legacy_collectedFlag: "data-task-search-collected",
    legacy_minCharCount: 0,
    minAPICharCount: 3,
    maxAPICharCount: 100,
    maxItems: 5,
    searchPlacement: undefined,
    legacy_debounceDuration: 0,
    descriptionKey: "taskDescription",
    activeElementId: undefined,
  };
  var popularSearches = [];
  var queryString = window.location.search;
  var defaultPopularSearches = [
    {
      taskDescription: "Popular Services",
      description: "Popular Services",
      url: "",
      taskOid: 0,
      isTitle: true,
    },
    {
      taskDescription: "Roofing & Gutters",
      description: "Roofing & Gutters",
      url: "/category.Roofing-Siding-Gutters.10217.html",
      taskOid: 0,
    },
    {
      taskDescription: "Additions and Remodels",
      description: "Additions and Remodels",
      url: "/category.Additions-Remodeling.12001.html",
      taskOid: 0,
    },
    {
      taskDescription: "HVAC",
      description: "HVAC",
      url: "/category.Heating-Cooling.10211.html",
      taskOid: 0,
    },
    {
      taskDescription: "Plumbing",
      description: "Plumbing",
      url: "/category.Plumbing.10216.html",
      taskOid: 0,
    },
    {
      taskDescription: "Painting",
      description: "Painting",
      url: "/category.Painting-Staining.10215.html",
      taskOid: 0,
    },
  ];
  function autocomplete(inputElement) {
    var state = {
      inFlight: {},
      currentQuery: "",
      currentList: [],
      currentFocus: 0,
      formId: "searchFormDefault",
      typeahead: {
        enabled: false,
        index: undefined,
        item: undefined,
        maxInputCharCount: 20,
      },
      searchPlacement: undefined,
      mobileEnhancements: false,
      isMobileComponent: false,
      isSearchAnalyticsEnabled: false,
      isPopularSearchApiEnabled: false,
      enableMobileAutocompleteRedesign: false,
      pageName: undefined,
    };
    initialSetup();
    inputElement.addEventListener("input", function (e) {
      var value = e.target.value;
      var query = value.replace(/\s+$/g, "").replace(/\W+/g, " ");
      var searchOptions = inputElement.getAttribute("data-task-search-options");
      var request = {
        query: query,
        count: settings.maxItems,
        options: searchOptions,
      };
      state.currentFocus = -1;
      if (state.typeahead.enabled) {
        var typeaheadContainer = inputElement.parentNode.querySelector(
          ".typeahead-container"
        );
        clearTypeahead(typeaheadContainer);
      }
      var listContainer = getListContainer();
      if (
        query.length >= settings.minAPICharCount &&
        query.length <= settings.maxAPICharCount
      ) {
        if (state.inFlight[query]) {
          state.currentQuery = query;
          state.currentList = state.inFlight[query];
          populateList();
        } else {
          getSuggestions(request);
        }
        listContainer.classList.add("search-results");
      } else if (query.length > settings.maxAPICharCount) {
        state.currentQuery = query;
      } else if (query.length === 0) {
        state.currentQuery = "";
        state.currentList = popularSearches;
        listContainer.classList.remove("search-results");
        populateList();
      } else {
        listContainer.setAttribute("hidden", "");
      }
    });
    inputElement.addEventListener("change", function (e) {
      state.currentQuery = e.target.value;
    });
    inputElement.addEventListener("click", function (e) {
      var width =
        w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
      if (state.isSearchAnalyticsEnabled && !state.isMobileComponent) {
        analytics.triggerSiteSearchEngagementEvent(state.searchPlacement);
      }
      if (
        state.enableMobileAutocompleteRedesign &&
        width <= 768 &&
        !state.isMobileComponent
      ) {
        settings.activeElementId = inputElement.getAttribute("id");
        var mobileContainer = d.getElementById("mobileAutocompleteContainer");
        mobileContainer.classList.remove("hidden");
        state.currentList = popularSearches;
        populateList(true);
      } else {
        if (width <= 768 && "scrollTo" in w && state.mobileEnhancements) {
          setTimeout(function () {
            var y =
              inputElement.getBoundingClientRect().top +
              window.pageYOffset -
              20;
            w.scrollTo({ top: y, behavior: "smooth" });
          }, 250);
        }
        var listContainer = getListContainer();
        if (e.target.value.length === 0) {
          state.currentList = popularSearches;
          listContainer.classList.remove("search-results");
          populateList();
        } else {
          listContainer.classList.add("search-results");
          listContainer.removeAttribute("hidden");
        }
      }
    });
    inputElement.addEventListener("keydown", function (e) {
      var listContainer = getListContainer();
      var items = listContainer.getElementsByTagName("li");
      if (e.keyCode === keyCodes.ENTER_KEY) {
        e.preventDefault();
        if (state.currentFocus > -1) {
          if (state.isSearchAnalyticsEnabled) {
            var selectedItem = state.currentList[state.currentFocus];
            var taskOid = getTaskOidForItem(selectedItem);
            var catOid = getCatOidForItem(selectedItem);
            analytics.triggerAutocompleteResultSelectionEvent(
              state.searchPlacement,
              state.currentQuery,
              state.currentFocus,
              selectedItem[settings.descriptionKey],
              "key_press",
              taskOid,
              catOid
            );
          }
          items[state.currentFocus].click();
        } else {
          listContainer.setAttribute("hidden", "");
          if (state.isSearchAnalyticsEnabled) {
            analytics.triggerSiteSearchSubmitEvent(
              state.searchPlacement,
              state.currentQuery,
              "key_press",
              state.pageName
            );
          }
          handleFormSubmit();
        }
        if (state.typeahead.enabled) {
          var typeaheadContainer = inputElement.parentNode.querySelector(
            ".typeahead-container"
          );
          clearTypeahead(typeaheadContainer);
        }
      } else if (e.keyCode === keyCodes.DOWN_KEY) {
        state.currentFocus++;
        addActiveClass(items, e.keyCode);
      } else if (e.keyCode === keyCodes.UP_KEY) {
        state.currentFocus--;
        addActiveClass(items, e.keyCode);
      } else if (
        (e.keyCode === keyCodes.TAB_KEY ||
          e.keyCode === keyCodes.ARROW_RIGHT_KEY) &&
        state.typeahead.enabled &&
        state.typeahead.item
      ) {
        if (e.keyCode === keyCodes.TAB_KEY) {
          e.preventDefault();
        }
        var typeaheadContainer = inputElement.parentNode.querySelector(
          ".typeahead-container"
        );
        inputElement.value = state.typeahead.item[settings.descriptionKey];
        inputElement.setAttribute(
          "value",
          state.typeahead.item[settings.descriptionKey]
        );
        handleItemSelection(state.typeahead.index);
        clearTypeahead(typeaheadContainer);
      }
    });
    document.addEventListener("click", function (e) {
      deactivateInactiveElements(e.target);
    });
    function setupAutocompleteListEventListeners() {
      var listContainer = getListContainer();
      listContainer.addEventListener("click", function (e) {
        var element = e.target.nodeName.toLowerCase();
        if (element === "li" || element === "b") {
          var target = e.target;
          if (element === "b") {
            target = e.target.parentElement;
          }
          var selectedValue = target.getAttribute("data-value");
          if (selectedValue !== "View All Results") {
            inputElement.value = selectedValue;
            inputElement.setAttribute("value", selectedValue);
          }
          var listContainer = getListContainer();
          var items = listContainer.getElementsByTagName("li");
          var index = [].slice.call(items).indexOf(target);
          handleItemSelection(index);
          if (state.typeahead.enabled) {
            var typeaheadContainer = inputElement.parentNode.querySelector(
              ".typeahead-container"
            );
            clearTypeahead(typeaheadContainer);
          }
        }
      });
    }
    function addActiveClass(items, keyCode) {
      if (!items) return;
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
        items[i].setAttribute("aria-selected", "false");
      }
      if (state.currentFocus >= items.length) state.currentFocus = 0;
      if (state.currentFocus < 0) state.currentFocus = items.length - 1;
      if (items[state.currentFocus].classList.contains("title")) {
        if (keyCode === keyCodes.UP_KEY && state.currentFocus === 0) {
          state.currentFocus = items.length - 1;
        } else {
          state.currentFocus++;
        }
      }
      items[state.currentFocus].classList.add("active");
      items[state.currentFocus].setAttribute("aria-selected", "true");
    }
    function populateList(shouldGetMobileInput = false) {
      if (state.currentList === null || state.currentList.length === 0) return;
      var listContainer = null;
      if (shouldGetMobileInput) {
        var mobileInput = d.getElementById("mobileAutocompleteInput");
        listContainer =
          mobileInput.parentNode.parentNode.parentNode.querySelector("ul");
        setTimeout(function () {
          mobileInput.focus();
        }, 0);
      } else {
        listContainer = getListContainer();
      }
      listContainer.textContent = "";
      state.currentList.forEach(function (item) {
        var listItem = document.createElement("li");
        if (item.hasOwnProperty("isTitle") && item.isTitle)
          listItem.classList.add("title");
        if (typeof item[settings.descriptionKey] != "undefined") {
          listItem.innerHTML = highlightCharacters(
            item[settings.descriptionKey]
          );
          listItem.setAttribute("data-value", item[settings.descriptionKey]);
        } else if (typeof item.name != "undefined") {
          listItem.innerHTML = highlightCharacters(item.name);
          listItem.setAttribute("data-value", item.name);
        }
        listItem.setAttribute("aria-selected", false);
        listContainer.appendChild(listItem);
      });
      listContainer.removeAttribute("hidden");
      if (state.typeahead.enabled) {
        populateTypeahead();
      }
    }
    function populateTypeahead() {
      var typeaheadContainer = inputElement.parentNode.querySelector(
        ".typeahead-container"
      );
      if (
        state.currentQuery.length < settings.minAPICharCount ||
        state.currentQuery.length >= state.typeahead.maxInputCharCount
      ) {
        clearTypeahead(typeaheadContainer);
        return;
      }
      for (var i = 0; i < state.currentList.length; i++) {
        var description = "";
        if (
          typeof state.currentList[i][settings.descriptionKey] != "undefined"
        ) {
          description =
            state.currentList[i][settings.descriptionKey].toLowerCase();
        } else if (typeof state.currentList[i].name != "undefined") {
          description = state.currentList[i].name.toLowerCase();
        }
        if (description.startsWith(state.currentQuery.toLowerCase())) {
          typeaheadContainer.classList.remove("hide");
          var phrases = description.split(state.currentQuery.toLowerCase());
          if (phrases.length > 0) {
            var endingText = phrases
              .slice(1)
              .join(state.currentQuery.toLowerCase());
            typeaheadContainer.innerHTML =
              "<span>" + state.currentQuery + "</span>" + endingText;
          } else {
            typeaheadContainer.innerText = state.currentQuery;
          }
          state.typeahead.index = i;
          state.typeahead.item = state.currentList[i];
          break;
        } else {
          clearTypeahead(typeaheadContainer);
        }
      }
    }
    function clearTypeahead(typeaheadContainer) {
      typeaheadContainer.classList.add("hide");
      typeaheadContainer.innerText = "";
      state.typeahead.item = undefined;
    }
    function getSuggestions(request) {
      api.getTaskSearchSuggestions(request, function (error, response) {
        handleAPIResponse(error, response, request);
      });
    }
    function handleAPIResponse(error, response, request) {
      delete state.inFlight[request.query];
      if (error) {
        state.currentQuery = null;
      } else {
        state.currentQuery = request.query;
        if (response.tasks && response.tasks.length > 1) {
          state.currentList = response.tasks;
        } else {
          state.currentList = popularSearches.concat({
            description: "View All Results",
            taskOid: -1,
          });
        }
        state.inFlight[request.query] = response.tasks;
        populateList();
      }
    }
    function highlightCharacters(term) {
      return term.replace(
        new RegExp(state.currentQuery, "gi"),
        function (match) {
          if (state.currentQuery === "") return "";
          return "<b>" + match + "</b>";
        }
      );
    }
    function deactivateInactiveElements(activeElement) {
      var elements = document.getElementsByClassName("ha-autocomplete");
      for (var i = 0; i < elements.length; i++) {
        if (activeElement !== elements[i] && activeElement !== inputElement) {
          var elementId = elements[i].getAttribute("id");
          if (elementId !== "mobileAutocompleteInput") {
            var listContainer = d
              .getElementById(elementId)
              .parentNode.querySelector("ul");
            listContainer.setAttribute("hidden", "");
          }
        }
      }
    }
    function handleItemSelection(index) {
      if (!state.currentList || state.currentList.length === 0) {
        state.currentList = popularSearches;
      }
      var selectedItem = state.currentList[index];
      if (selectedItem.isTitle) return false;
      var selectedRank = index + 1;
      analytics.triggerAutocompleteOMNIEvents(
        selectedItem[settings.descriptionKey],
        selectedRank,
        state.searchPlacement,
        state.currentQuery
      );
      if (state.isSearchAnalyticsEnabled) {
        var taskOid = getTaskOidForItem(selectedItem);
        var catOid = getCatOidForItem(selectedItem);
        analytics.triggerAutocompleteResultSelectionEvent(
          state.searchPlacement,
          state.currentQuery,
          selectedRank,
          selectedItem[settings.descriptionKey],
          "link_click",
          taskOid,
          catOid
        );
      }
      handleItemSelectionAutoforward(selectedItem);
    }
    function handleItemSelectionAutoforward(item) {
      if (item.url) {
        document.location.href = item.url + queryString;
      } else {
        handleFormSubmit();
      }
    }
    function handleFormSubmit() {
      var form = document.getElementById(state.formId);
      if (form) form.submit();
    }
    function getTaskOidForItem(item) {
      var taskOid = null;
      if (
        typeof item.type != "undefined" &&
        typeof item.oid != "undefined" &&
        item.type === "task"
      ) {
        taskOid = item.oid;
      }
      return taskOid;
    }
    function getCatOidForItem(item) {
      var catOid = null;
      if (
        typeof item.type != "undefined" &&
        typeof item.oid != "undefined" &&
        item.type === "category"
      ) {
        catOid = item.oid;
      }
      return catOid;
    }
    function setMobileButtonClickEvents() {
      d.getElementById("maBackButton").addEventListener("click", function (e) {
        var value = d.getElementById("mobileAutocompleteInput").value;
        d.getElementById(settings.activeElementId).value = value;
        var mobileContainer = d.getElementById("mobileAutocompleteContainer");
        mobileContainer.classList.add("hidden");
      });
      d.getElementById("maClearButton").addEventListener("click", function (e) {
        d.getElementById("mobileAutocompleteInput").value = "";
        state.currentList = popularSearches;
        var listContainer = getListContainer();
        listContainer.classList.remove("search-results");
        populateList();
      });
    }
    function getListContainer() {
      var listContainer = "null";
      if (state.isMobileComponent) {
        listContainer =
          inputElement.parentNode.parentNode.parentNode.querySelector("ul");
      } else {
        listContainer = inputElement.parentNode.querySelector("ul");
      }
      return listContainer;
    }
    function initialSetup() {
      inputElement.setAttribute("autocomplete", "off");
      inputElement.setAttribute("aria-autocomplete", "list");
      var container = document.createElement("div");
      container.classList.add("autocomplete-container");
      state.searchPlacement = inputElement.getAttribute(
        "data-search-placement"
      );
      var pageTitle = document.getElementsByTagName("title");
      var sourcePages = document.getElementsByName("sourcePage");
      if (pageTitle.length > 0) {
        state.pageName = pageTitle[0].innerText;
      }
      if (sourcePages.length > 1) {
        for (var i = 0; i < sourcePages.length; i++) {
          if (sourcePages[i].value !== "Header") {
            state.pageName = sourcePages[i].value;
          }
        }
      }
      if (inputElement.hasAttribute("data-typeahead")) {
        var shouldEnable = inputElement.getAttribute("data-typeahead");
        if (shouldEnable === "true") {
          state.typeahead.enabled = true;
          var typeahead = document.createElement("div");
          typeahead.classList.add("typeahead-container");
          typeahead.classList.add("hide");
          container.appendChild(typeahead);
        }
      } else {
        state.typeahead.enabled = true;
        var typeahead = document.createElement("div");
        typeahead.classList.add("typeahead-container");
        typeahead.classList.add("hide");
        container.appendChild(typeahead);
      }
      inputElement.parentNode.insertBefore(container, inputElement);
      container.appendChild(inputElement);
      var wrapper = document.createElement("ul");
      wrapper.classList.add("autocomplete-list");
      wrapper.setAttribute("hidden", "");
      if (inputElement.getAttribute("data-mobile-component") === "true") {
        state.isMobileComponent = true;
        container.parentNode.parentNode.appendChild(wrapper);
      } else {
        container.appendChild(wrapper);
      }
      state.formId = inputElement.getAttribute("data-task-search-form-id");
      settings.descriptionKey = "description";
      if (inputElement.hasAttribute("data-mobile-enhancements")) {
        state.mobileEnhancements = true;
      }
      if (inputElement.hasAttribute("data-auto-focus")) {
        var autofocus = inputElement.getAttribute("data-auto-focus") === "true";
        if (autofocus && (window.innerWidth || d.body.clientWidth) > 768) {
          inputElement.focus();
        }
      }
      setupAutocompleteListEventListeners();
      if (inputElement.hasAttribute("data-search-analytics-enabled")) {
        state.isSearchAnalyticsEnabled =
          inputElement.getAttribute("data-search-analytics-enabled") === "true";
      }
      if (state.formId && state.isSearchAnalyticsEnabled) {
        $("#" + state.formId + " input.form-button").on("click", function (e) {
          analytics.triggerSiteSearchSubmitEvent(
            state.searchPlacement,
            state.currentQuery,
            "button_click",
            state.pageName
          );
        });
      }
      if (inputElement.hasAttribute("data-mobile-component")) {
        state.isMobileComponent =
          inputElement.getAttribute("data-mobile-component") === "true";
        if (state.isMobileComponent) {
          setMobileButtonClickEvents();
        }
      }
      if (inputElement.hasAttribute("data-mobile-redesign")) {
        state.enableMobileAutocompleteRedesign = true;
      }
      if (inputElement.hasAttribute("data-popular-search-api-enabled")) {
        state.isPopularSearchApiEnabled =
          inputElement.getAttribute("data-popular-search-api-enabled") ===
          "true";
      }
      setupPopularSearches();
    }
    function setupPopularSearches() {
      if (state.isPopularSearchApiEnabled) {
        api.getPopularSearches(function (error, response) {
          if (error) {
            popularSearches = defaultPopularSearches;
          } else {
            popularSearches = response;
          }
        });
      } else {
        popularSearches = defaultPopularSearches;
      }
    }
  }
  function handleSRPTaskClickListenerEvents(params) {
    var resultsSize = document
      .getElementById("search-results-section")
      .getAttribute("data-results-size");
    if (typeof resultsSize === "string") {
      resultsSize = Number(resultsSize);
    }
    var taskCount = 0;
    if (d.querySelector(".search-results-list") != null) {
      taskCount = d.querySelector(".search-results-list").children.length;
    }
    var startIndex = 0;
    if (params.startIndex.length > 0) {
      startIndex = Number(params.startIndex);
    }
    $(".search-results-list li a").on("click", function () {
      var taskRank = index(this.parentNode);
      analytics.triggerSRPResultSelectionEvent(
        params.query,
        taskRank,
        taskCount,
        this.textContent,
        startIndex,
        resultsSize
      );
    });
  }
  function index(el) {
    if (!el) return -1;
    var i = 0;
    do {
      i++;
    } while ((el = el.previousElementSibling));
    return i;
  }
  var overrideDefaultSettings = function () {
    if ($("[data-api-query-min]").first()) {
      var element = $("[data-api-query-min]").first();
      var minAPIQueryCharCount = parseInt(
        element.getAttribute("data-api-query-min")
      );
      if (!isNaN(minAPIQueryCharCount)) {
        settings.minAPICharCount = minAPIQueryCharCount;
      }
    }
    if ($("[data-api-query-max]").first()) {
      var element = $("[data-api-query-max]").first();
      var maxAPIQueryCharCount = parseInt(
        element.getAttribute("data-api-query-max")
      );
      if (!isNaN(maxAPIQueryCharCount)) {
        settings.maxAPICharCount = maxAPIQueryCharCount;
      }
    }
  };
  var init = function () {
    var autocompleteLists = document.getElementsByClassName("ha-autocomplete");
    Array.prototype.forEach.call(autocompleteLists, function (element) {
      autocomplete(element);
    });
    setupSearchInputs();
    overrideDefaultSettings();
    var enableSearchAnalytics =
      d
        .querySelector("[data-search-analytics-enabled]")
        .getAttribute("data-search-analytics-enabled") === "true";
    var params = getSearchParameters();
    if (params && params.action === "SEARCH" && enableSearchAnalytics) {
      handleSRPTaskClickListenerEvents(params);
    }
  };
  function getSearchParameters() {
    var params = window.location.search.substr(1);
    return params != null && params !== "" ? transformToArray(params) : {};
  }
  function transformToArray(parameters) {
    var params = {};
    var paramArray = parameters.split("&");
    for (var i = 0; i < paramArray.length; i++) {
      var list = paramArray[i].split("=");
      params[list[0]] = list[1];
    }
    return params;
  }
  $(d).ready(init);
  var formatTaskDescription = function (str) {
    str = str.replace("<br />", "");
    var colon = str.indexOf(":");
    if (colon > -1) str = str.substring(0, colon);
    return str;
  };
  var replaceFunction = function (selected) {
    var item = null;
    var selectedRank = null;
    for (var i = 0; i < this._list.length; ++i) {
      if (
        selected.value == formatTaskDescription(this._list[i].taskDescription)
      ) {
        item = this._list[i];
        selectedRank = i + 1;
        break;
      }
    }
    var taskOidFields = this.input.getAttribute("data-task-oid-fields");
    if (taskOidFields) {
      $(taskOidFields).each(function (field) {
        field.value = item.taskOid;
        $(field).trigger("change");
      });
    }
    if (!item) return;
    this.input.setAttribute("data-task-oid", item.taskOid);
    if (item.isTitle) return false;
    if (item.taskOid === 0) {
      this.input.setAttribute("data-task-url", item.url);
      selectedRank--;
    }
    analytics.triggerAutocompleteOMNIEvents(
      item.taskDescription,
      selectedRank,
      settings.searchPlacement,
      this.input.value
    );
    var bindResult = this.input.getAttribute("data-bind-result");
    if (selected.value == "View All Results") return false;
    if (bindResult) {
      var usingFullIntegration = bindResult.indexOf("${type}") > -1;
      if (usingFullIntegration)
        bindResult = bindResult.replace(
          "${type}",
          item.taskOid > 0 ? "selectedTask" : "selectedCategory"
        );
      bindResult = bindResult.split(".");
      var objName = bindResult.shift(),
        objKey = bindResult.join("."),
        boundObjects = simpleBind.getState().boundObjects,
        obj =
          typeof boundObjects[objName] != "undefined"
            ? boundObjects[objName]
            : {};
      var selectedObj = {
        oid: item.taskOid,
        description: item.taskDescription,
        name: item.taskName,
        urlName: util.slugify(item.taskName),
      };
      selectedObj.url =
        item.taskOid > 0
          ? "/task." + selectedObj.urlName + "." + selectedObj.oid + ".1.html"
          : "/category." +
            selectedObj.urlName +
            "." +
            selectedObj.oid +
            ".html";
      simpleBind.util.set(obj, objKey, selectedObj);
      if (usingFullIntegration)
        simpleBind.util.set(
          obj,
          item.taskOid > 0 ? "selectedCategory" : "selectedTask",
          null
        );
      simpleBind.bind(objName, obj);
    }
    this.input.value = selected.value;
  };
  var awesomepleteOptions = {
    minChars: settings.legacy_minCharCount,
    maxItems: settings.maxItems + 1,
    data: function (item, input) {
      var str = formatTaskDescription(item.taskDescription);
      return { value: str, label: str, something: 123 };
    },
    filter: function (text, input) {
      return true;
    },
    replace: replaceFunction,
    sort: function () {
      return 0;
    },
  };
  var checkIfCollected = function (el) {
    return !el.getAttribute(settings.legacy_collectedFlag);
  };
  var setupSearchInputs = function (ctx) {
    ctx = typeof ctx == "undefined" ? d : ctx;
    $(ctx)
      .find(settings.legacy_inputSelector)
      .filter(checkIfCollected)
      .each(function (el) {
        setupAutocompleteWidget(
          el,
          el.getAttribute("data-task-search-form-id"),
          settings.legacy_collectedFlag
        );
      });
    $(ctx)
      .find(settings.legacy_headerInputSelector)
      .filter(checkIfCollected)
      .each(function (el) {
        setupAutocompleteWidget(
          el,
          el.getAttribute("data-task-search-form-id"),
          settings.legacy_collectedFlag
        );
      });
  };
  var setupAutocompleteWidget = function (el, formID, collectedFlag) {
    var widget = new Awesomplete(el, awesomepleteOptions);
    el.setAttribute(collectedFlag, "true");
    if (el.getAttribute("data-task-search-inline"))
      el.parentNode.style.display = "inline-block";
    $(el)
      .on("keyup", dataSrc(widget, formID))
      .on("focus", setContainerFocus(true))
      .on("blur", setContainerFocus(false))
      .on("click", function () {
        prePopulateListClickHandler(widget, formID);
      });
  };
  var setContainerFocus = function (focused) {
    return function (evt, item) {
      item = typeof item == "undefined" ? this : item;
      $(item.parentNode)[focused ? "addClass" : "removeClass"]("focus");
      $(item.parentNode)[item.value.length ? "addClass" : "removeClass"](
        "valid"
      );
    };
  };
  var setupPopularListTitle = function (formID) {
    var element = $(`#` + formID + " .awesomplete ul li").first();
    if (!element) return;
    element.classList.add("title");
  };
  var prePopulateListClickHandler = function (widget, formID) {
    var element = $(`#` + formID + " .awesomplete ul").first();
    if (!element) return;
    if (widget._list.length === 0) {
      widget.list = popularSearches;
      setTimeout(setupPopularListTitle(formID), 500);
    }
    updateSearchPlacementValue(formID);
    element.removeAttribute("hidden");
  };
  var updateSearchPlacementValue = function (formID) {
    var element = $(`#` + formID + " .awesomplete input.search-field").first();
    if (!element) return;
    settings.searchPlacement = element.getAttribute("data-search-placement");
  };
  var dataSrc = function (widget, containerClass) {
    var state = { inFlight: {}, lastValue: "", currentList: null };
    $(widget.input).on("awesomplete-selectcomplete", function () {
      state.lastValue = widget.input.value;
    });
    var keyUpHandler = function (evt) {
      var ogValue = widget.input.value,
        query = ogValue.replace(/\s+$/g, ""),
        searchOptions = widget.input.getAttribute("data-task-search-options");
      updateSearchPlacementValue(containerClass);
      setContainerFocus(true)(null, widget.input);
      if (
        query.length >= settings.legacy_minCharCount &&
        typeof state.inFlight[query] == "undefined"
      ) {
        if (query == state.currentList || state.lastValue == query) return;
        state.lastValue = state.inFlight[query] = query;
        var req = {
          query: query.replace(/\W+/g, " "),
          count: settings.maxItems,
          options: searchOptions,
        };
        getSuggestions(req, query, ogValue);
      } else {
        if (query.length === 0) {
          state.lastValue = null;
          widget.list = popularSearches;
          setTimeout(setupPopularListTitle(containerClass), 500);
        } else {
          widget.list = [];
        }
        state.currentList = null;
      }
    };
    var getSuggestions = function (req, query, ogValue) {
      api.getTaskSearchSuggestions(req, function (err, resp) {
        delete state.inFlight[query];
        if (widget.input.value == ogValue) {
          if (err) {
            state.currentList = null;
            widget._list = [];
          } else {
            state.currentList = query;
            if (resp.tasks && resp.tasks.length > 1) {
              widget.list = resp.tasks;
            } else {
              widget.list = popularSearches.concat({
                description: "View All Results",
                taskOid: -1,
              });
            }
          }
        }
      });
    };
    return util.debounce(keyUpHandler, settings.legacy_debounceDuration);
  };
  pub.latentSetup = function (ctx) {
    setupSearchInputs(ctx);
    overrideDefaultSettings();
  };
  pub.settings = settings;
  return pub;
})(
  window,
  document,
  HA.dom,
  HA.services,
  HA.util,
  HA.analytics,
  new EmitterFactory(HA.taskSearch)
);
HA.taskSearch = (function (w, d, $, util, api, pub) {
  var init = function () {
    collect();
  };
  $(d).ready(init);
  var collect = function () {
    $(pub.settings.legacy_inputSelector)
      .filter(autoForwardFilter)
      .each(function (input) {
        input.setAttribute("data-task-search-autoforward-collected", "true");
        $(input).on("awesomplete-selectcomplete", forward);
      });
    $(pub.settings.legacy_headerInputSelector)
      .filter(autoForwardFilter)
      .each(function (input) {
        input.setAttribute("data-task-search-autoforward-collected", "true");
        $(input).on("awesomplete-selectcomplete", forward);
      });
  };
  var autoForwardFilter = function (input) {
    return (
      input.getAttribute("data-task-search-autoforward") &&
      !input.getAttribute("data-task-search-autoforward-collected")
    );
  };
  var submitSearchForm = function (formId) {
    if (formId) {
      var form = d.getElementById(formId);
      if (form) form.submit();
    }
  };
  var forward = function () {
    var formId = this.getAttribute("data-task-search-form-id"),
      taskOid = this.getAttribute("data-task-oid");
    if (taskOid == 0) {
      var url = this.getAttribute("data-task-url");
      if (url) {
        d.location.href = url;
      }
    } else if (taskOid == -1) {
      return submitSearchForm(formId);
    } else {
      api.getTask({ taskOid: taskOid }, function (err, resp) {
        if (!err) {
          d.location.href =
            "/task." + resp.urlName + "." + resp.taskOid + ".html";
        } else {
          submitSearchForm(formId);
        }
      });
    }
  };
  pub.handleFormSubmission = function () {
    $("#homepage-predictive-search").on("submit", function (evt) {
      var $input = document
        .getElementById("homepage-predictive-search")
        .querySelector("input.search-field");
      if ($input.value.replace(/\s+/g, "") === "") {
        evt.preventDefault();
        document.location.href = "/profinder/";
      }
    });
  };
  pub.collectLatentAutoforwardInputs = function () {
    collect();
  };
  return pub;
})(window, document, HA.dom, HA.util, HA.services, HA.taskSearch || {});
(function (a, b) {
  function cy(a) {
    return f.isWindow(a)
      ? a
      : a.nodeType === 9
      ? a.defaultView || a.parentWindow
      : !1;
  }
  function cu(a) {
    if (!cj[a]) {
      var b = c.body,
        d = f("<" + a + ">").appendTo(b),
        e = d.css("display");
      d.remove();
      if (e === "none" || e === "") {
        ck ||
          ((ck = c.createElement("iframe")),
          (ck.frameBorder = ck.width = ck.height = 0)),
          b.appendChild(ck);
        if (!cl || !ck.createElement)
          (cl = (ck.contentWindow || ck.contentDocument).document),
            cl.write(
              (f.support.boxModel ? "<!doctype html>" : "") + "<html><body>"
            ),
            cl.close();
        (d = cl.createElement(a)),
          cl.body.appendChild(d),
          (e = f.css(d, "display")),
          b.removeChild(ck);
      }
      cj[a] = e;
    }
    return cj[a];
  }
  function ct(a, b) {
    var c = {};
    f.each(cp.concat.apply([], cp.slice(0, b)), function () {
      c[this] = a;
    });
    return c;
  }
  function cs() {
    cq = b;
  }
  function cr() {
    setTimeout(cs, 0);
    return (cq = f.now());
  }
  function ci() {
    try {
      return new a.ActiveXObject("Microsoft.XMLHTTP");
    } catch (b) {}
  }
  function ch() {
    try {
      return new a.XMLHttpRequest();
    } catch (b) {}
  }
  function cb(a, c) {
    a.dataFilter && (c = a.dataFilter(c, a.dataType));
    var d = a.dataTypes,
      e = {},
      g,
      h,
      i = d.length,
      j,
      k = d[0],
      l,
      m,
      n,
      o,
      p;
    for (g = 1; g < i; g++) {
      if (g === 1)
        for (h in a.converters)
          typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
      (l = k), (k = d[g]);
      if (k === "*") k = l;
      else if (l !== "*" && l !== k) {
        (m = l + " " + k), (n = e[m] || e["* " + k]);
        if (!n) {
          p = b;
          for (o in e) {
            j = o.split(" ");
            if (j[0] === l || j[0] === "*") {
              p = e[j[1] + " " + k];
              if (p) {
                (o = e[o]), o === !0 ? (n = p) : p === !0 && (n = o);
                break;
              }
            }
          }
        }
        !n && !p && f.error("No conversion from " + m.replace(" ", " to ")),
          n !== !0 && (c = n ? n(c) : p(o(c)));
      }
    }
    return c;
  }
  function ca(a, c, d) {
    var e = a.contents,
      f = a.dataTypes,
      g = a.responseFields,
      h,
      i,
      j,
      k;
    for (i in g) i in d && (c[g[i]] = d[i]);
    while (f[0] === "*")
      f.shift(),
        h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
    if (h)
      for (i in e)
        if (e[i] && e[i].test(h)) {
          f.unshift(i);
          break;
        }
    if (f[0] in d) j = f[0];
    else {
      for (i in d) {
        if (!f[0] || a.converters[i + " " + f[0]]) {
          j = i;
          break;
        }
        k || (k = i);
      }
      j = j || k;
    }
    if (j) {
      j !== f[0] && f.unshift(j);
      return d[j];
    }
  }
  function b_(a, b, c, d) {
    if (f.isArray(b))
      f.each(b, function (b, e) {
        c || bD.test(a)
          ? d(a, e)
          : b_(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d);
      });
    else if (!c && f.type(b) === "object")
      for (var e in b) b_(a + "[" + e + "]", b[e], c, d);
    else d(a, b);
  }
  function b$(a, c) {
    var d,
      e,
      g = f.ajaxSettings.flatOptions || {};
    for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
    e && f.extend(!0, a, e);
  }
  function bZ(a, c, d, e, f, g) {
    (f = f || c.dataTypes[0]), (g = g || {}), (g[f] = !0);
    var h = a[f],
      i = 0,
      j = h ? h.length : 0,
      k = a === bS,
      l;
    for (; i < j && (k || !l); i++)
      (l = h[i](c, d, e)),
        typeof l == "string" &&
          (!k || g[l]
            ? (l = b)
            : (c.dataTypes.unshift(l), (l = bZ(a, c, d, e, l, g))));
    (k || !l) && !g["*"] && (l = bZ(a, c, d, e, "*", g));
    return l;
  }
  function bY(a) {
    return function (b, c) {
      typeof b != "string" && ((c = b), (b = "*"));
      if (f.isFunction(c)) {
        var d = b.toLowerCase().split(bO),
          e = 0,
          g = d.length,
          h,
          i,
          j;
        for (; e < g; e++)
          (h = d[e]),
            (j = /^\+/.test(h)),
            j && (h = h.substr(1) || "*"),
            (i = a[h] = a[h] || []),
            i[j ? "unshift" : "push"](c);
      }
    };
  }
  function bB(a, b, c) {
    var d = b === "width" ? a.offsetWidth : a.offsetHeight,
      e = b === "width" ? 1 : 0,
      g = 4;
    if (d > 0) {
      if (c !== "border")
        for (; e < g; e += 2)
          c || (d -= parseFloat(f.css(a, "padding" + bx[e])) || 0),
            c === "margin"
              ? (d += parseFloat(f.css(a, c + bx[e])) || 0)
              : (d -= parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0);
      return d + "px";
    }
    d = by(a, b);
    if (d < 0 || d == null) d = a.style[b];
    if (bt.test(d)) return d;
    d = parseFloat(d) || 0;
    if (c)
      for (; e < g; e += 2)
        (d += parseFloat(f.css(a, "padding" + bx[e])) || 0),
          c !== "padding" &&
            (d += parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0),
          c === "margin" && (d += parseFloat(f.css(a, c + bx[e])) || 0);
    return d + "px";
  }
  function bo(a) {
    var b = c.createElement("div");
    bh.appendChild(b), (b.innerHTML = a.outerHTML);
    return b.firstChild;
  }
  function bn(a) {
    var b = (a.nodeName || "").toLowerCase();
    b === "input"
      ? bm(a)
      : b !== "script" &&
        typeof a.getElementsByTagName != "undefined" &&
        f.grep(a.getElementsByTagName("input"), bm);
  }
  function bm(a) {
    if (a.type === "checkbox" || a.type === "radio")
      a.defaultChecked = a.checked;
  }
  function bl(a) {
    return typeof a.getElementsByTagName != "undefined"
      ? a.getElementsByTagName("*")
      : typeof a.querySelectorAll != "undefined"
      ? a.querySelectorAll("*")
      : [];
  }
  function bk(a, b) {
    var c;
    b.nodeType === 1 &&
      (b.clearAttributes && b.clearAttributes(),
      b.mergeAttributes && b.mergeAttributes(a),
      (c = b.nodeName.toLowerCase()),
      c === "object"
        ? (b.outerHTML = a.outerHTML)
        : c !== "input" || (a.type !== "checkbox" && a.type !== "radio")
        ? c === "option"
          ? (b.selected = a.defaultSelected)
          : c === "input" || c === "textarea"
          ? (b.defaultValue = a.defaultValue)
          : c === "script" && b.text !== a.text && (b.text = a.text)
        : (a.checked && (b.defaultChecked = b.checked = a.checked),
          b.value !== a.value && (b.value = a.value)),
      b.removeAttribute(f.expando),
      b.removeAttribute("_submit_attached"),
      b.removeAttribute("_change_attached"));
  }
  function bj(a, b) {
    if (b.nodeType === 1 && !!f.hasData(a)) {
      var c,
        d,
        e,
        g = f._data(a),
        h = f._data(b, g),
        i = g.events;
      if (i) {
        delete h.handle, (h.events = {});
        for (c in i)
          for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c, i[c][d]);
      }
      h.data && (h.data = f.extend({}, h.data));
    }
  }
  function bi(a, b) {
    return f.nodeName(a, "table")
      ? a.getElementsByTagName("tbody")[0] ||
          a.appendChild(a.ownerDocument.createElement("tbody"))
      : a;
  }
  function U(a) {
    var b = V.split("|"),
      c = a.createDocumentFragment();
    if (c.createElement) while (b.length) c.createElement(b.pop());
    return c;
  }
  function T(a, b, c) {
    b = b || 0;
    if (f.isFunction(b))
      return f.grep(a, function (a, d) {
        var e = !!b.call(a, d, a);
        return e === c;
      });
    if (b.nodeType)
      return f.grep(a, function (a, d) {
        return (a === b) === c;
      });
    if (typeof b == "string") {
      var d = f.grep(a, function (a) {
        return a.nodeType === 1;
      });
      if (O.test(b)) return f.filter(b, d, !c);
      b = f.filter(b, d);
    }
    return f.grep(a, function (a, d) {
      return f.inArray(a, b) >= 0 === c;
    });
  }
  function S(a) {
    return !a || !a.parentNode || a.parentNode.nodeType === 11;
  }
  function K() {
    return !0;
  }
  function J() {
    return !1;
  }
  function n(a, b, c) {
    var d = b + "defer",
      e = b + "queue",
      g = b + "mark",
      h = f._data(a, d);
    h &&
      (c === "queue" || !f._data(a, e)) &&
      (c === "mark" || !f._data(a, g)) &&
      setTimeout(function () {
        !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire());
      }, 0);
  }
  function m(a) {
    for (var b in a) {
      if (b === "data" && f.isEmptyObject(a[b])) continue;
      if (b !== "toJSON") return !1;
    }
    return !0;
  }
  function l(a, c, d) {
    if (d === b && a.nodeType === 1) {
      var e = "data-" + c.replace(k, "-$1").toLowerCase();
      d = a.getAttribute(e);
      if (typeof d == "string") {
        try {
          d =
            d === "true"
              ? !0
              : d === "false"
              ? !1
              : d === "null"
              ? null
              : f.isNumeric(d)
              ? +d
              : j.test(d)
              ? f.parseJSON(d)
              : d;
        } catch (g) {}
        f.data(a, c, d);
      } else d = b;
    }
    return d;
  }
  function h(a) {
    var b = (g[a] = {}),
      c,
      d;
    a = a.split(/\s+/);
    for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
    return b;
  }
  var c = a.document,
    d = a.navigator,
    e = a.location,
    f = (function () {
      function J() {
        if (!e.isReady) {
          try {
            c.documentElement.doScroll("left");
          } catch (a) {
            setTimeout(J, 1);
            return;
          }
          e.ready();
        }
      }
      var e = function (a, b) {
          return new e.fn.init(a, b, h);
        },
        f = a.jQuery,
        g = a.$,
        h,
        i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
        j = /\S/,
        k = /^\s+/,
        l = /\s+$/,
        m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
        n = /^[\],:{}\s]*$/,
        o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        q = /(?:^|:|,)(?:\s*\[)+/g,
        r = /(webkit)[ \/]([\w.]+)/,
        s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        t = /(msie) ([\w.]+)/,
        u = /(mozilla)(?:.*? rv:([\w.]+))?/,
        v = /-([a-z]|[0-9])/gi,
        w = /^-ms-/,
        x = function (a, b) {
          return (b + "").toUpperCase();
        },
        y = d.userAgent,
        z,
        A,
        B,
        C = Object.prototype.toString,
        D = Object.prototype.hasOwnProperty,
        E = Array.prototype.push,
        F = Array.prototype.slice,
        G = String.prototype.trim,
        H = Array.prototype.indexOf,
        I = {};
      (e.fn = e.prototype =
        {
          constructor: e,
          init: function (a, d, f) {
            var g, h, j, k;
            if (!a) return this;
            if (a.nodeType) {
              (this.context = this[0] = a), (this.length = 1);
              return this;
            }
            if (a === "body" && !d && c.body) {
              (this.context = c),
                (this[0] = c.body),
                (this.selector = a),
                (this.length = 1);
              return this;
            }
            if (typeof a == "string") {
              a.charAt(0) !== "<" ||
              a.charAt(a.length - 1) !== ">" ||
              a.length < 3
                ? (g = i.exec(a))
                : (g = [null, a, null]);
              if (g && (g[1] || !d)) {
                if (g[1]) {
                  (d = d instanceof e ? d[0] : d),
                    (k = d ? d.ownerDocument || d : c),
                    (j = m.exec(a)),
                    j
                      ? e.isPlainObject(d)
                        ? ((a = [c.createElement(j[1])]),
                          e.fn.attr.call(a, d, !0))
                        : (a = [k.createElement(j[1])])
                      : ((j = e.buildFragment([g[1]], [k])),
                        (a = (j.cacheable ? e.clone(j.fragment) : j.fragment)
                          .childNodes));
                  return e.merge(this, a);
                }
                h = c.getElementById(g[2]);
                if (h && h.parentNode) {
                  if (h.id !== g[2]) return f.find(a);
                  (this.length = 1), (this[0] = h);
                }
                (this.context = c), (this.selector = a);
                return this;
              }
              return !d || d.jquery
                ? (d || f).find(a)
                : this.constructor(d).find(a);
            }
            if (e.isFunction(a)) return f.ready(a);
            a.selector !== b &&
              ((this.selector = a.selector), (this.context = a.context));
            return e.makeArray(a, this);
          },
          selector: "",
          jquery: "1.7.2",
          length: 0,
          size: function () {
            return this.length;
          },
          toArray: function () {
            return F.call(this, 0);
          },
          get: function (a) {
            return a == null
              ? this.toArray()
              : a < 0
              ? this[this.length + a]
              : this[a];
          },
          pushStack: function (a, b, c) {
            var d = this.constructor();
            e.isArray(a) ? E.apply(d, a) : e.merge(d, a),
              (d.prevObject = this),
              (d.context = this.context),
              b === "find"
                ? (d.selector = this.selector + (this.selector ? " " : "") + c)
                : b && (d.selector = this.selector + "." + b + "(" + c + ")");
            return d;
          },
          each: function (a, b) {
            return e.each(this, a, b);
          },
          ready: function (a) {
            e.bindReady(), A.add(a);
            return this;
          },
          eq: function (a) {
            a = +a;
            return a === -1 ? this.slice(a) : this.slice(a, a + 1);
          },
          first: function () {
            return this.eq(0);
          },
          last: function () {
            return this.eq(-1);
          },
          slice: function () {
            return this.pushStack(
              F.apply(this, arguments),
              "slice",
              F.call(arguments).join(",")
            );
          },
          map: function (a) {
            return this.pushStack(
              e.map(this, function (b, c) {
                return a.call(b, c, b);
              })
            );
          },
          end: function () {
            return this.prevObject || this.constructor(null);
          },
          push: E,
          sort: [].sort,
          splice: [].splice,
        }),
        (e.fn.init.prototype = e.fn),
        (e.extend = e.fn.extend =
          function () {
            var a,
              c,
              d,
              f,
              g,
              h,
              i = arguments[0] || {},
              j = 1,
              k = arguments.length,
              l = !1;
            typeof i == "boolean" &&
              ((l = i), (i = arguments[1] || {}), (j = 2)),
              typeof i != "object" && !e.isFunction(i) && (i = {}),
              k === j && ((i = this), --j);
            for (; j < k; j++)
              if ((a = arguments[j]) != null)
                for (c in a) {
                  (d = i[c]), (f = a[c]);
                  if (i === f) continue;
                  l && f && (e.isPlainObject(f) || (g = e.isArray(f)))
                    ? (g
                        ? ((g = !1), (h = d && e.isArray(d) ? d : []))
                        : (h = d && e.isPlainObject(d) ? d : {}),
                      (i[c] = e.extend(l, h, f)))
                    : f !== b && (i[c] = f);
                }
            return i;
          }),
        e.extend({
          noConflict: function (b) {
            a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
            return e;
          },
          isReady: !1,
          readyWait: 1,
          holdReady: function (a) {
            a ? e.readyWait++ : e.ready(!0);
          },
          ready: function (a) {
            if ((a === !0 && !--e.readyWait) || (a !== !0 && !e.isReady)) {
              if (!c.body) return setTimeout(e.ready, 1);
              e.isReady = !0;
              if (a !== !0 && --e.readyWait > 0) return;
              A.fireWith(c, [e]),
                e.fn.trigger && e(c).trigger("ready").off("ready");
            }
          },
          bindReady: function () {
            if (!A) {
              A = e.Callbacks("once memory");
              if (c.readyState === "complete") return setTimeout(e.ready, 1);
              if (c.addEventListener)
                c.addEventListener("DOMContentLoaded", B, !1),
                  a.addEventListener("load", e.ready, !1);
              else if (c.attachEvent) {
                c.attachEvent("onreadystatechange", B),
                  a.attachEvent("onload", e.ready);
                var b = !1;
                try {
                  b = a.frameElement == null;
                } catch (d) {}
                c.documentElement.doScroll && b && J();
              }
            }
          },
          isFunction: function (a) {
            return e.type(a) === "function";
          },
          isArray:
            Array.isArray ||
            function (a) {
              return e.type(a) === "array";
            },
          isWindow: function (a) {
            return a != null && a == a.window;
          },
          isNumeric: function (a) {
            return !isNaN(parseFloat(a)) && isFinite(a);
          },
          type: function (a) {
            return a == null ? String(a) : I[C.call(a)] || "object";
          },
          isPlainObject: function (a) {
            if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a))
              return !1;
            try {
              if (
                a.constructor &&
                !D.call(a, "constructor") &&
                !D.call(a.constructor.prototype, "isPrototypeOf")
              )
                return !1;
            } catch (c) {
              return !1;
            }
            var d;
            for (d in a);
            return d === b || D.call(a, d);
          },
          isEmptyObject: function (a) {
            for (var b in a) return !1;
            return !0;
          },
          error: function (a) {
            throw new Error(a);
          },
          parseJSON: function (b) {
            if (typeof b != "string" || !b) return null;
            b = e.trim(b);
            if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
            if (n.test(b.replace(o, "@").replace(p, "]").replace(q, "")))
              return new Function("return " + b)();
            e.error("Invalid JSON: " + b);
          },
          parseXML: function (c) {
            if (typeof c != "string" || !c) return null;
            var d, f;
            try {
              a.DOMParser
                ? ((f = new DOMParser()),
                  (d = f.parseFromString(c, "text/xml")))
                : ((d = new ActiveXObject("Microsoft.XMLDOM")),
                  (d.async = "false"),
                  d.loadXML(c));
            } catch (g) {
              d = b;
            }
            (!d ||
              !d.documentElement ||
              d.getElementsByTagName("parsererror").length) &&
              e.error("Invalid XML: " + c);
            return d;
          },
          noop: function () {},
          globalEval: function (b) {
            b &&
              j.test(b) &&
              (
                a.execScript ||
                function (b) {
                  a.eval.call(a, b);
                }
              )(b);
          },
          camelCase: function (a) {
            return a.replace(w, "ms-").replace(v, x);
          },
          nodeName: function (a, b) {
            return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase();
          },
          each: function (a, c, d) {
            var f,
              g = 0,
              h = a.length,
              i = h === b || e.isFunction(a);
            if (d) {
              if (i) {
                for (f in a) if (c.apply(a[f], d) === !1) break;
              } else for (; g < h; ) if (c.apply(a[g++], d) === !1) break;
            } else if (i) {
              for (f in a) if (c.call(a[f], f, a[f]) === !1) break;
            } else for (; g < h; ) if (c.call(a[g], g, a[g++]) === !1) break;
            return a;
          },
          trim: G
            ? function (a) {
                return a == null ? "" : G.call(a);
              }
            : function (a) {
                return a == null ? "" : (a + "").replace(k, "").replace(l, "");
              },
          makeArray: function (a, b) {
            var c = b || [];
            if (a != null) {
              var d = e.type(a);
              a.length == null ||
              d === "string" ||
              d === "function" ||
              d === "regexp" ||
              e.isWindow(a)
                ? E.call(c, a)
                : e.merge(c, a);
            }
            return c;
          },
          inArray: function (a, b, c) {
            var d;
            if (b) {
              if (H) return H.call(b, a, c);
              (d = b.length), (c = c ? (c < 0 ? Math.max(0, d + c) : c) : 0);
              for (; c < d; c++) if (c in b && b[c] === a) return c;
            }
            return -1;
          },
          merge: function (a, c) {
            var d = a.length,
              e = 0;
            if (typeof c.length == "number")
              for (var f = c.length; e < f; e++) a[d++] = c[e];
            else while (c[e] !== b) a[d++] = c[e++];
            a.length = d;
            return a;
          },
          grep: function (a, b, c) {
            var d = [],
              e;
            c = !!c;
            for (var f = 0, g = a.length; f < g; f++)
              (e = !!b(a[f], f)), c !== e && d.push(a[f]);
            return d;
          },
          map: function (a, c, d) {
            var f,
              g,
              h = [],
              i = 0,
              j = a.length,
              k =
                a instanceof e ||
                (j !== b &&
                  typeof j == "number" &&
                  ((j > 0 && a[0] && a[j - 1]) || j === 0 || e.isArray(a)));
            if (k)
              for (; i < j; i++)
                (f = c(a[i], i, d)), f != null && (h[h.length] = f);
            else
              for (g in a) (f = c(a[g], g, d)), f != null && (h[h.length] = f);
            return h.concat.apply([], h);
          },
          guid: 1,
          proxy: function (a, c) {
            if (typeof c == "string") {
              var d = a[c];
              (c = a), (a = d);
            }
            if (!e.isFunction(a)) return b;
            var f = F.call(arguments, 2),
              g = function () {
                return a.apply(c, f.concat(F.call(arguments)));
              };
            g.guid = a.guid = a.guid || g.guid || e.guid++;
            return g;
          },
          access: function (a, c, d, f, g, h, i) {
            var j,
              k = d == null,
              l = 0,
              m = a.length;
            if (d && typeof d == "object") {
              for (l in d) e.access(a, c, l, d[l], 1, h, f);
              g = 1;
            } else if (f !== b) {
              (j = i === b && e.isFunction(f)),
                k &&
                  (j
                    ? ((j = c),
                      (c = function (a, b, c) {
                        return j.call(e(a), c);
                      }))
                    : (c.call(a, f), (c = null)));
              if (c)
                for (; l < m; l++)
                  c(a[l], d, j ? f.call(a[l], l, c(a[l], d)) : f, i);
              g = 1;
            }
            return g ? a : k ? c.call(a) : m ? c(a[0], d) : h;
          },
          now: function () {
            return new Date().getTime();
          },
          uaMatch: function (a) {
            a = a.toLowerCase();
            var b =
              r.exec(a) ||
              s.exec(a) ||
              t.exec(a) ||
              (a.indexOf("compatible") < 0 && u.exec(a)) ||
              [];
            return { browser: b[1] || "", version: b[2] || "0" };
          },
          sub: function () {
            function a(b, c) {
              return new a.fn.init(b, c);
            }
            e.extend(!0, a, this),
              (a.superclass = this),
              (a.fn = a.prototype = this()),
              (a.fn.constructor = a),
              (a.sub = this.sub),
              (a.fn.init = function (d, f) {
                f && f instanceof e && !(f instanceof a) && (f = a(f));
                return e.fn.init.call(this, d, f, b);
              }),
              (a.fn.init.prototype = a.fn);
            var b = a(c);
            return a;
          },
          browser: {},
        }),
        e.each(
          "Boolean Number String Function Array Date RegExp Object".split(" "),
          function (a, b) {
            I["[object " + b + "]"] = b.toLowerCase();
          }
        ),
        (z = e.uaMatch(y)),
        z.browser &&
          ((e.browser[z.browser] = !0), (e.browser.version = z.version)),
        e.browser.webkit && (e.browser.safari = !0),
        j.test(" ") && ((k = /^[\s\xA0]+/), (l = /[\s\xA0]+$/)),
        (h = e(c)),
        c.addEventListener
          ? (B = function () {
              c.removeEventListener("DOMContentLoaded", B, !1), e.ready();
            })
          : c.attachEvent &&
            (B = function () {
              c.readyState === "complete" &&
                (c.detachEvent("onreadystatechange", B), e.ready());
            });
      return e;
    })(),
    g = {};
  f.Callbacks = function (a) {
    a = a ? g[a] || h(a) : {};
    var c = [],
      d = [],
      e,
      i,
      j,
      k,
      l,
      m,
      n = function (b) {
        var d, e, g, h, i;
        for (d = 0, e = b.length; d < e; d++)
          (g = b[d]),
            (h = f.type(g)),
            h === "array"
              ? n(g)
              : h === "function" && (!a.unique || !p.has(g)) && c.push(g);
      },
      o = function (b, f) {
        (f = f || []),
          (e = !a.memory || [b, f]),
          (i = !0),
          (j = !0),
          (m = k || 0),
          (k = 0),
          (l = c.length);
        for (; c && m < l; m++)
          if (c[m].apply(b, f) === !1 && a.stopOnFalse) {
            e = !0;
            break;
          }
        (j = !1),
          c &&
            (a.once
              ? e === !0
                ? p.disable()
                : (c = [])
              : d && d.length && ((e = d.shift()), p.fireWith(e[0], e[1])));
      },
      p = {
        add: function () {
          if (c) {
            var a = c.length;
            n(arguments),
              j ? (l = c.length) : e && e !== !0 && ((k = a), o(e[0], e[1]));
          }
          return this;
        },
        remove: function () {
          if (c) {
            var b = arguments,
              d = 0,
              e = b.length;
            for (; d < e; d++)
              for (var f = 0; f < c.length; f++)
                if (b[d] === c[f]) {
                  j && f <= l && (l--, f <= m && m--), c.splice(f--, 1);
                  if (a.unique) break;
                }
          }
          return this;
        },
        has: function (a) {
          if (c) {
            var b = 0,
              d = c.length;
            for (; b < d; b++) if (a === c[b]) return !0;
          }
          return !1;
        },
        empty: function () {
          c = [];
          return this;
        },
        disable: function () {
          c = d = e = b;
          return this;
        },
        disabled: function () {
          return !c;
        },
        lock: function () {
          (d = b), (!e || e === !0) && p.disable();
          return this;
        },
        locked: function () {
          return !d;
        },
        fireWith: function (b, c) {
          d && (j ? a.once || d.push([b, c]) : (!a.once || !e) && o(b, c));
          return this;
        },
        fire: function () {
          p.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!i;
        },
      };
    return p;
  };
  var i = [].slice;
  f.extend({
    Deferred: function (a) {
      var b = f.Callbacks("once memory"),
        c = f.Callbacks("once memory"),
        d = f.Callbacks("memory"),
        e = "pending",
        g = { resolve: b, reject: c, notify: d },
        h = {
          done: b.add,
          fail: c.add,
          progress: d.add,
          state: function () {
            return e;
          },
          isResolved: b.fired,
          isRejected: c.fired,
          then: function (a, b, c) {
            i.done(a).fail(b).progress(c);
            return this;
          },
          always: function () {
            i.done.apply(i, arguments).fail.apply(i, arguments);
            return this;
          },
          pipe: function (a, b, c) {
            return f
              .Deferred(function (d) {
                f.each(
                  {
                    done: [a, "resolve"],
                    fail: [b, "reject"],
                    progress: [c, "notify"],
                  },
                  function (a, b) {
                    var c = b[0],
                      e = b[1],
                      g;
                    f.isFunction(c)
                      ? i[a](function () {
                          (g = c.apply(this, arguments)),
                            g && f.isFunction(g.promise)
                              ? g.promise().then(d.resolve, d.reject, d.notify)
                              : d[e + "With"](this === i ? d : this, [g]);
                        })
                      : i[a](d[e]);
                  }
                );
              })
              .promise();
          },
          promise: function (a) {
            if (a == null) a = h;
            else for (var b in h) a[b] = h[b];
            return a;
          },
        },
        i = h.promise({}),
        j;
      for (j in g) (i[j] = g[j].fire), (i[j + "With"] = g[j].fireWith);
      i
        .done(
          function () {
            e = "resolved";
          },
          c.disable,
          d.lock
        )
        .fail(
          function () {
            e = "rejected";
          },
          b.disable,
          d.lock
        ),
        a && a.call(i, i);
      return i;
    },
    when: function (a) {
      function m(a) {
        return function (b) {
          (e[a] = arguments.length > 1 ? i.call(arguments, 0) : b),
            j.notifyWith(k, e);
        };
      }
      function l(a) {
        return function (c) {
          (b[a] = arguments.length > 1 ? i.call(arguments, 0) : c),
            --g || j.resolveWith(j, b);
        };
      }
      var b = i.call(arguments, 0),
        c = 0,
        d = b.length,
        e = Array(d),
        g = d,
        h = d,
        j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
        k = j.promise();
      if (d > 1) {
        for (; c < d; c++)
          b[c] && b[c].promise && f.isFunction(b[c].promise)
            ? b[c].promise().then(l(c), j.reject, m(c))
            : --g;
        g || j.resolveWith(j, b);
      } else j !== a && j.resolveWith(j, d ? [a] : []);
      return k;
    },
  }),
    (f.support = (function () {
      var b,
        d,
        e,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p = c.createElement("div"),
        q = c.documentElement;
      p.setAttribute("className", "t"),
        (p.innerHTML =
          "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>"),
        (d = p.getElementsByTagName("*")),
        (e = p.getElementsByTagName("a")[0]);
      if (!d || !d.length || !e) return {};
      (g = c.createElement("select")),
        (h = g.appendChild(c.createElement("option"))),
        (i = p.getElementsByTagName("input")[0]),
        (b = {
          leadingWhitespace: p.firstChild.nodeType === 3,
          tbody: !p.getElementsByTagName("tbody").length,
          htmlSerialize: !!p.getElementsByTagName("link").length,
          style: /top/.test(e.getAttribute("style")),
          hrefNormalized: e.getAttribute("href") === "/a",
          opacity: /^0.55/.test(e.style.opacity),
          cssFloat: !!e.style.cssFloat,
          checkOn: i.value === "on",
          optSelected: h.selected,
          getSetAttribute: p.className !== "t",
          enctype: !!c.createElement("form").enctype,
          html5Clone:
            c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
          submitBubbles: !0,
          changeBubbles: !0,
          focusinBubbles: !1,
          deleteExpando: !0,
          noCloneEvent: !0,
          inlineBlockNeedsLayout: !1,
          shrinkWrapBlocks: !1,
          reliableMarginRight: !0,
          pixelMargin: !0,
        }),
        (f.boxModel = b.boxModel = c.compatMode === "CSS1Compat"),
        (i.checked = !0),
        (b.noCloneChecked = i.cloneNode(!0).checked),
        (g.disabled = !0),
        (b.optDisabled = !h.disabled);
      try {
        delete p.test;
      } catch (r) {
        b.deleteExpando = !1;
      }
      !p.addEventListener &&
        p.attachEvent &&
        p.fireEvent &&
        (p.attachEvent("onclick", function () {
          b.noCloneEvent = !1;
        }),
        p.cloneNode(!0).fireEvent("onclick")),
        (i = c.createElement("input")),
        (i.value = "t"),
        i.setAttribute("type", "radio"),
        (b.radioValue = i.value === "t"),
        i.setAttribute("checked", "checked"),
        i.setAttribute("name", "t"),
        p.appendChild(i),
        (j = c.createDocumentFragment()),
        j.appendChild(p.lastChild),
        (b.checkClone = j.cloneNode(!0).cloneNode(!0).lastChild.checked),
        (b.appendChecked = i.checked),
        j.removeChild(i),
        j.appendChild(p);
      if (p.attachEvent)
        for (n in { submit: 1, change: 1, focusin: 1 })
          (m = "on" + n),
            (o = m in p),
            o ||
              (p.setAttribute(m, "return;"), (o = typeof p[m] == "function")),
            (b[n + "Bubbles"] = o);
      j.removeChild(p),
        (j = g = h = p = i = null),
        f(function () {
          var d,
            e,
            g,
            h,
            i,
            j,
            l,
            m,
            n,
            q,
            r,
            s,
            t,
            u = c.getElementsByTagName("body")[0];
          !u ||
            ((m = 1),
            (t = "padding:0;margin:0;border:"),
            (r = "position:absolute;top:0;left:0;width:1px;height:1px;"),
            (s = t + "0;visibility:hidden;"),
            (n = "style='" + r + t + "5px solid #000;"),
            (q =
              "<div " +
              n +
              "display:block;'><div style='" +
              t +
              "0;display:block;overflow:hidden;'></div></div>" +
              "<table " +
              n +
              "' cellpadding='0' cellspacing='0'>" +
              "<tr><td></td></tr></table>"),
            (d = c.createElement("div")),
            (d.style.cssText =
              s +
              "width:0;height:0;position:static;top:0;margin-top:" +
              m +
              "px"),
            u.insertBefore(d, u.firstChild),
            (p = c.createElement("div")),
            d.appendChild(p),
            (p.innerHTML =
              "<table><tr><td style='" +
              t +
              "0;display:none'></td><td>t</td></tr></table>"),
            (k = p.getElementsByTagName("td")),
            (o = k[0].offsetHeight === 0),
            (k[0].style.display = ""),
            (k[1].style.display = "none"),
            (b.reliableHiddenOffsets = o && k[0].offsetHeight === 0),
            a.getComputedStyle &&
              ((p.innerHTML = ""),
              (l = c.createElement("div")),
              (l.style.width = "0"),
              (l.style.marginRight = "0"),
              (p.style.width = "2px"),
              p.appendChild(l),
              (b.reliableMarginRight =
                (parseInt(
                  (a.getComputedStyle(l, null) || { marginRight: 0 })
                    .marginRight,
                  10
                ) || 0) === 0)),
            typeof p.style.zoom != "undefined" &&
              ((p.innerHTML = ""),
              (p.style.width = p.style.padding = "1px"),
              (p.style.border = 0),
              (p.style.overflow = "hidden"),
              (p.style.display = "inline"),
              (p.style.zoom = 1),
              (b.inlineBlockNeedsLayout = p.offsetWidth === 3),
              (p.style.display = "block"),
              (p.style.overflow = "visible"),
              (p.innerHTML = "<div style='width:5px;'></div>"),
              (b.shrinkWrapBlocks = p.offsetWidth !== 3)),
            (p.style.cssText = r + s),
            (p.innerHTML = q),
            (e = p.firstChild),
            (g = e.firstChild),
            (i = e.nextSibling.firstChild.firstChild),
            (j = {
              doesNotAddBorder: g.offsetTop !== 5,
              doesAddBorderForTableAndCells: i.offsetTop === 5,
            }),
            (g.style.position = "fixed"),
            (g.style.top = "20px"),
            (j.fixedPosition = g.offsetTop === 20 || g.offsetTop === 15),
            (g.style.position = g.style.top = ""),
            (e.style.overflow = "hidden"),
            (e.style.position = "relative"),
            (j.subtractsBorderForOverflowNotVisible = g.offsetTop === -5),
            (j.doesNotIncludeMarginInBodyOffset = u.offsetTop !== m),
            a.getComputedStyle &&
              ((p.style.marginTop = "1%"),
              (b.pixelMargin =
                (a.getComputedStyle(p, null) || { marginTop: 0 }).marginTop !==
                "1%")),
            typeof d.style.zoom != "undefined" && (d.style.zoom = 1),
            u.removeChild(d),
            (l = p = d = null),
            f.extend(b, j));
        });
      return b;
    })());
  var j = /^(?:\{.*\}|\[.*\])$/,
    k = /([A-Z])/g;
  f.extend({
    cache: {},
    uuid: 0,
    expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: !0,
    },
    hasData: function (a) {
      a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
      return !!a && !m(a);
    },
    data: function (a, c, d, e) {
      if (!!f.acceptData(a)) {
        var g,
          h,
          i,
          j = f.expando,
          k = typeof c == "string",
          l = a.nodeType,
          m = l ? f.cache : a,
          n = l ? a[j] : a[j] && j,
          o = c === "events";
        if ((!n || !m[n] || (!o && !e && !m[n].data)) && k && d === b) return;
        n || (l ? (a[j] = n = ++f.uuid) : (n = j)),
          m[n] || ((m[n] = {}), l || (m[n].toJSON = f.noop));
        if (typeof c == "object" || typeof c == "function")
          e ? (m[n] = f.extend(m[n], c)) : (m[n].data = f.extend(m[n].data, c));
        (g = h = m[n]),
          e || (h.data || (h.data = {}), (h = h.data)),
          d !== b && (h[f.camelCase(c)] = d);
        if (o && !h[c]) return g.events;
        k ? ((i = h[c]), i == null && (i = h[f.camelCase(c)])) : (i = h);
        return i;
      }
    },
    removeData: function (a, b, c) {
      if (!!f.acceptData(a)) {
        var d,
          e,
          g,
          h = f.expando,
          i = a.nodeType,
          j = i ? f.cache : a,
          k = i ? a[h] : h;
        if (!j[k]) return;
        if (b) {
          d = c ? j[k] : j[k].data;
          if (d) {
            f.isArray(b) ||
              (b in d
                ? (b = [b])
                : ((b = f.camelCase(b)),
                  b in d ? (b = [b]) : (b = b.split(" "))));
            for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
            if (!(c ? m : f.isEmptyObject)(d)) return;
          }
        }
        if (!c) {
          delete j[k].data;
          if (!m(j[k])) return;
        }
        f.support.deleteExpando || !j.setInterval ? delete j[k] : (j[k] = null),
          i &&
            (f.support.deleteExpando
              ? delete a[h]
              : a.removeAttribute
              ? a.removeAttribute(h)
              : (a[h] = null));
      }
    },
    _data: function (a, b, c) {
      return f.data(a, b, c, !0);
    },
    acceptData: function (a) {
      if (a.nodeName) {
        var b = f.noData[a.nodeName.toLowerCase()];
        if (b) return b !== !0 && a.getAttribute("classid") === b;
      }
      return !0;
    },
  }),
    f.fn.extend({
      data: function (a, c) {
        var d,
          e,
          g,
          h,
          i,
          j = this[0],
          k = 0,
          m = null;
        if (a === b) {
          if (this.length) {
            m = f.data(j);
            if (j.nodeType === 1 && !f._data(j, "parsedAttrs")) {
              g = j.attributes;
              for (i = g.length; k < i; k++)
                (h = g[k].name),
                  h.indexOf("data-") === 0 &&
                    ((h = f.camelCase(h.substring(5))), l(j, h, m[h]));
              f._data(j, "parsedAttrs", !0);
            }
          }
          return m;
        }
        if (typeof a == "object")
          return this.each(function () {
            f.data(this, a);
          });
        (d = a.split(".", 2)),
          (d[1] = d[1] ? "." + d[1] : ""),
          (e = d[1] + "!");
        return f.access(
          this,
          function (c) {
            if (c === b) {
              (m = this.triggerHandler("getData" + e, [d[0]])),
                m === b && j && ((m = f.data(j, a)), (m = l(j, a, m)));
              return m === b && d[1] ? this.data(d[0]) : m;
            }
            (d[1] = c),
              this.each(function () {
                var b = f(this);
                b.triggerHandler("setData" + e, d),
                  f.data(this, a, c),
                  b.triggerHandler("changeData" + e, d);
              });
          },
          null,
          c,
          arguments.length > 1,
          null,
          !1
        );
      },
      removeData: function (a) {
        return this.each(function () {
          f.removeData(this, a);
        });
      },
    }),
    f.extend({
      _mark: function (a, b) {
        a &&
          ((b = (b || "fx") + "mark"), f._data(a, b, (f._data(a, b) || 0) + 1));
      },
      _unmark: function (a, b, c) {
        a !== !0 && ((c = b), (b = a), (a = !1));
        if (b) {
          c = c || "fx";
          var d = c + "mark",
            e = a ? 0 : (f._data(b, d) || 1) - 1;
          e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"));
        }
      },
      queue: function (a, b, c) {
        var d;
        if (a) {
          (b = (b || "fx") + "queue"),
            (d = f._data(a, b)),
            c &&
              (!d || f.isArray(c)
                ? (d = f._data(a, b, f.makeArray(c)))
                : d.push(c));
          return d || [];
        }
      },
      dequeue: function (a, b) {
        b = b || "fx";
        var c = f.queue(a, b),
          d = c.shift(),
          e = {};
        d === "inprogress" && (d = c.shift()),
          d &&
            (b === "fx" && c.unshift("inprogress"),
            f._data(a, b + ".run", e),
            d.call(
              a,
              function () {
                f.dequeue(a, b);
              },
              e
            )),
          c.length ||
            (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"));
      },
    }),
    f.fn.extend({
      queue: function (a, c) {
        var d = 2;
        typeof a != "string" && ((c = a), (a = "fx"), d--);
        if (arguments.length < d) return f.queue(this[0], a);
        return c === b
          ? this
          : this.each(function () {
              var b = f.queue(this, a, c);
              a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a);
            });
      },
      dequeue: function (a) {
        return this.each(function () {
          f.dequeue(this, a);
        });
      },
      delay: function (a, b) {
        (a = f.fx ? f.fx.speeds[a] || a : a), (b = b || "fx");
        return this.queue(b, function (b, c) {
          var d = setTimeout(b, a);
          c.stop = function () {
            clearTimeout(d);
          };
        });
      },
      clearQueue: function (a) {
        return this.queue(a || "fx", []);
      },
      promise: function (a, c) {
        function m() {
          --h || d.resolveWith(e, [e]);
        }
        typeof a != "string" && ((c = a), (a = b)), (a = a || "fx");
        var d = f.Deferred(),
          e = this,
          g = e.length,
          h = 1,
          i = a + "defer",
          j = a + "queue",
          k = a + "mark",
          l;
        while (g--)
          if (
            (l =
              f.data(e[g], i, b, !0) ||
              ((f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) &&
                f.data(e[g], i, f.Callbacks("once memory"), !0)))
          )
            h++, l.add(m);
        m();
        return d.promise(c);
      },
    });
  var o = /[\n\t\r]/g,
    p = /\s+/,
    q = /\r/g,
    r = /^(?:button|input)$/i,
    s = /^(?:button|input|object|select|textarea)$/i,
    t = /^a(?:rea)?$/i,
    u =
      /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    v = f.support.getSetAttribute,
    w,
    x,
    y;
  f.fn.extend({
    attr: function (a, b) {
      return f.access(this, f.attr, a, b, arguments.length > 1);
    },
    removeAttr: function (a) {
      return this.each(function () {
        f.removeAttr(this, a);
      });
    },
    prop: function (a, b) {
      return f.access(this, f.prop, a, b, arguments.length > 1);
    },
    removeProp: function (a) {
      a = f.propFix[a] || a;
      return this.each(function () {
        try {
          (this[a] = b), delete this[a];
        } catch (c) {}
      });
    },
    addClass: function (a) {
      var b, c, d, e, g, h, i;
      if (f.isFunction(a))
        return this.each(function (b) {
          f(this).addClass(a.call(this, b, this.className));
        });
      if (a && typeof a == "string") {
        b = a.split(p);
        for (c = 0, d = this.length; c < d; c++) {
          e = this[c];
          if (e.nodeType === 1)
            if (!e.className && b.length === 1) e.className = a;
            else {
              g = " " + e.className + " ";
              for (h = 0, i = b.length; h < i; h++)
                ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
              e.className = f.trim(g);
            }
        }
      }
      return this;
    },
    removeClass: function (a) {
      var c, d, e, g, h, i, j;
      if (f.isFunction(a))
        return this.each(function (b) {
          f(this).removeClass(a.call(this, b, this.className));
        });
      if ((a && typeof a == "string") || a === b) {
        c = (a || "").split(p);
        for (d = 0, e = this.length; d < e; d++) {
          g = this[d];
          if (g.nodeType === 1 && g.className)
            if (a) {
              h = (" " + g.className + " ").replace(o, " ");
              for (i = 0, j = c.length; i < j; i++)
                h = h.replace(" " + c[i] + " ", " ");
              g.className = f.trim(h);
            } else g.className = "";
        }
      }
      return this;
    },
    toggleClass: function (a, b) {
      var c = typeof a,
        d = typeof b == "boolean";
      if (f.isFunction(a))
        return this.each(function (c) {
          f(this).toggleClass(a.call(this, c, this.className, b), b);
        });
      return this.each(function () {
        if (c === "string") {
          var e,
            g = 0,
            h = f(this),
            i = b,
            j = a.split(p);
          while ((e = j[g++]))
            (i = d ? i : !h.hasClass(e)), h[i ? "addClass" : "removeClass"](e);
        } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), (this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || "");
      });
    },
    hasClass: function (a) {
      var b = " " + a + " ",
        c = 0,
        d = this.length;
      for (; c < d; c++)
        if (
          this[c].nodeType === 1 &&
          (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1
        )
          return !0;
      return !1;
    },
    val: function (a) {
      var c,
        d,
        e,
        g = this[0];
      {
        if (!!arguments.length) {
          e = f.isFunction(a);
          return this.each(function (d) {
            var g = f(this),
              h;
            if (this.nodeType === 1) {
              e ? (h = a.call(this, d, g.val())) : (h = a),
                h == null
                  ? (h = "")
                  : typeof h == "number"
                  ? (h += "")
                  : f.isArray(h) &&
                    (h = f.map(h, function (a) {
                      return a == null ? "" : a + "";
                    })),
                (c =
                  f.valHooks[this.type] ||
                  f.valHooks[this.nodeName.toLowerCase()]);
              if (!c || !("set" in c) || c.set(this, h, "value") === b)
                this.value = h;
            }
          });
        }
        if (g) {
          c = f.valHooks[g.type] || f.valHooks[g.nodeName.toLowerCase()];
          if (c && "get" in c && (d = c.get(g, "value")) !== b) return d;
          d = g.value;
          return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d;
        }
      }
    },
  }),
    f.extend({
      valHooks: {
        option: {
          get: function (a) {
            var b = a.attributes.value;
            return !b || b.specified ? a.value : a.text;
          },
        },
        select: {
          get: function (a) {
            var b,
              c,
              d,
              e,
              g = a.selectedIndex,
              h = [],
              i = a.options,
              j = a.type === "select-one";
            if (g < 0) return null;
            (c = j ? g : 0), (d = j ? g + 1 : i.length);
            for (; c < d; c++) {
              e = i[c];
              if (
                e.selected &&
                (f.support.optDisabled
                  ? !e.disabled
                  : e.getAttribute("disabled") === null) &&
                (!e.parentNode.disabled ||
                  !f.nodeName(e.parentNode, "optgroup"))
              ) {
                b = f(e).val();
                if (j) return b;
                h.push(b);
              }
            }
            if (j && !h.length && i.length) return f(i[g]).val();
            return h;
          },
          set: function (a, b) {
            var c = f.makeArray(b);
            f(a)
              .find("option")
              .each(function () {
                this.selected = f.inArray(f(this).val(), c) >= 0;
              }),
              c.length || (a.selectedIndex = -1);
            return c;
          },
        },
      },
      attrFn: {
        val: !0,
        css: !0,
        html: !0,
        text: !0,
        data: !0,
        width: !0,
        height: !0,
        offset: !0,
      },
      attr: function (a, c, d, e) {
        var g,
          h,
          i,
          j = a.nodeType;
        if (!!a && j !== 3 && j !== 8 && j !== 2) {
          if (e && c in f.attrFn) return f(a)[c](d);
          if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
          (i = j !== 1 || !f.isXMLDoc(a)),
            i &&
              ((c = c.toLowerCase()),
              (h = f.attrHooks[c] || (u.test(c) ? x : w)));
          if (d !== b) {
            if (d === null) {
              f.removeAttr(a, c);
              return;
            }
            if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g;
            a.setAttribute(c, "" + d);
            return d;
          }
          if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g;
          g = a.getAttribute(c);
          return g === null ? b : g;
        }
      },
      removeAttr: function (a, b) {
        var c,
          d,
          e,
          g,
          h,
          i = 0;
        if (b && a.nodeType === 1) {
          (d = b.toLowerCase().split(p)), (g = d.length);
          for (; i < g; i++)
            (e = d[i]),
              e &&
                ((c = f.propFix[e] || e),
                (h = u.test(e)),
                h || f.attr(a, e, ""),
                a.removeAttribute(v ? e : c),
                h && c in a && (a[c] = !1));
        }
      },
      attrHooks: {
        type: {
          set: function (a, b) {
            if (r.test(a.nodeName) && a.parentNode)
              f.error("type property can't be changed");
            else if (
              !f.support.radioValue &&
              b === "radio" &&
              f.nodeName(a, "input")
            ) {
              var c = a.value;
              a.setAttribute("type", b), c && (a.value = c);
              return b;
            }
          },
        },
        value: {
          get: function (a, b) {
            if (w && f.nodeName(a, "button")) return w.get(a, b);
            return b in a ? a.value : null;
          },
          set: function (a, b, c) {
            if (w && f.nodeName(a, "button")) return w.set(a, b, c);
            a.value = b;
          },
        },
      },
      propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        for: "htmlFor",
        class: "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable",
      },
      prop: function (a, c, d) {
        var e,
          g,
          h,
          i = a.nodeType;
        if (!!a && i !== 3 && i !== 8 && i !== 2) {
          (h = i !== 1 || !f.isXMLDoc(a)),
            h && ((c = f.propFix[c] || c), (g = f.propHooks[c]));
          return d !== b
            ? g && "set" in g && (e = g.set(a, d, c)) !== b
              ? e
              : (a[c] = d)
            : g && "get" in g && (e = g.get(a, c)) !== null
            ? e
            : a[c];
        }
      },
      propHooks: {
        tabIndex: {
          get: function (a) {
            var c = a.getAttributeNode("tabindex");
            return c && c.specified
              ? parseInt(c.value, 10)
              : s.test(a.nodeName) || (t.test(a.nodeName) && a.href)
              ? 0
              : b;
          },
        },
      },
    }),
    (f.attrHooks.tabindex = f.propHooks.tabIndex),
    (x = {
      get: function (a, c) {
        var d,
          e = f.prop(a, c);
        return e === !0 ||
          (typeof e != "boolean" &&
            (d = a.getAttributeNode(c)) &&
            d.nodeValue !== !1)
          ? c.toLowerCase()
          : b;
      },
      set: function (a, b, c) {
        var d;
        b === !1
          ? f.removeAttr(a, c)
          : ((d = f.propFix[c] || c),
            d in a && (a[d] = !0),
            a.setAttribute(c, c.toLowerCase()));
        return c;
      },
    }),
    v ||
      ((y = { name: !0, id: !0, coords: !0 }),
      (w = f.valHooks.button =
        {
          get: function (a, c) {
            var d;
            d = a.getAttributeNode(c);
            return d && (y[c] ? d.nodeValue !== "" : d.specified)
              ? d.nodeValue
              : b;
          },
          set: function (a, b, d) {
            var e = a.getAttributeNode(d);
            e || ((e = c.createAttribute(d)), a.setAttributeNode(e));
            return (e.nodeValue = b + "");
          },
        }),
      (f.attrHooks.tabindex.set = w.set),
      f.each(["width", "height"], function (a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
          set: function (a, c) {
            if (c === "") {
              a.setAttribute(b, "auto");
              return c;
            }
          },
        });
      }),
      (f.attrHooks.contenteditable = {
        get: w.get,
        set: function (a, b, c) {
          b === "" && (b = "false"), w.set(a, b, c);
        },
      })),
    f.support.hrefNormalized ||
      f.each(["href", "src", "width", "height"], function (a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
          get: function (a) {
            var d = a.getAttribute(c, 2);
            return d === null ? b : d;
          },
        });
      }),
    f.support.style ||
      (f.attrHooks.style = {
        get: function (a) {
          return a.style.cssText.toLowerCase() || b;
        },
        set: function (a, b) {
          return (a.style.cssText = "" + b);
        },
      }),
    f.support.optSelected ||
      (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function (a) {
          var b = a.parentNode;
          b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
          return null;
        },
      })),
    f.support.enctype || (f.propFix.enctype = "encoding"),
    f.support.checkOn ||
      f.each(["radio", "checkbox"], function () {
        f.valHooks[this] = {
          get: function (a) {
            return a.getAttribute("value") === null ? "on" : a.value;
          },
        };
      }),
    f.each(["radio", "checkbox"], function () {
      f.valHooks[this] = f.extend(f.valHooks[this], {
        set: function (a, b) {
          if (f.isArray(b)) return (a.checked = f.inArray(f(a).val(), b) >= 0);
        },
      });
    });
  var z = /^(?:textarea|input|select)$/i,
    A = /^([^\.]*)?(?:\.(.+))?$/,
    B = /(?:^|\s)hover(\.\S+)?\b/,
    C = /^key/,
    D = /^(?:mouse|contextmenu)|click/,
    E = /^(?:focusinfocus|focusoutblur)$/,
    F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    G = function (a) {
      var b = F.exec(a);
      b &&
        ((b[1] = (b[1] || "").toLowerCase()),
        (b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)")));
      return b;
    },
    H = function (a, b) {
      var c = a.attributes || {};
      return (
        (!b[1] || a.nodeName.toLowerCase() === b[1]) &&
        (!b[2] || (c.id || {}).value === b[2]) &&
        (!b[3] || b[3].test((c["class"] || {}).value))
      );
    },
    I = function (a) {
      return f.event.special.hover
        ? a
        : a.replace(B, "mouseenter$1 mouseleave$1");
    };
  (f.event = {
    add: function (a, c, d, e, g) {
      var h, i, j, k, l, m, n, o, p, q, r, s;
      if (
        !(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))
      ) {
        d.handler && ((p = d), (d = p.handler), (g = p.selector)),
          d.guid || (d.guid = f.guid++),
          (j = h.events),
          j || (h.events = j = {}),
          (i = h.handle),
          i ||
            ((h.handle = i =
              function (a) {
                return typeof f != "undefined" &&
                  (!a || f.event.triggered !== a.type)
                  ? f.event.dispatch.apply(i.elem, arguments)
                  : b;
              }),
            (i.elem = a)),
          (c = f.trim(I(c)).split(" "));
        for (k = 0; k < c.length; k++) {
          (l = A.exec(c[k]) || []),
            (m = l[1]),
            (n = (l[2] || "").split(".").sort()),
            (s = f.event.special[m] || {}),
            (m = (g ? s.delegateType : s.bindType) || m),
            (s = f.event.special[m] || {}),
            (o = f.extend(
              {
                type: m,
                origType: l[1],
                data: e,
                handler: d,
                guid: d.guid,
                selector: g,
                quick: g && G(g),
                namespace: n.join("."),
              },
              p
            )),
            (r = j[m]);
          if (!r) {
            (r = j[m] = []), (r.delegateCount = 0);
            if (!s.setup || s.setup.call(a, e, n, i) === !1)
              a.addEventListener
                ? a.addEventListener(m, i, !1)
                : a.attachEvent && a.attachEvent("on" + m, i);
          }
          s.add &&
            (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)),
            g ? r.splice(r.delegateCount++, 0, o) : r.push(o),
            (f.event.global[m] = !0);
        }
        a = null;
      }
    },
    global: {},
    remove: function (a, b, c, d, e) {
      var g = f.hasData(a) && f._data(a),
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s;
      if (!!g && !!(o = g.events)) {
        b = f.trim(I(b || "")).split(" ");
        for (h = 0; h < b.length; h++) {
          (i = A.exec(b[h]) || []), (j = k = i[1]), (l = i[2]);
          if (!j) {
            for (j in o) f.event.remove(a, j + b[h], c, d, !0);
            continue;
          }
          (p = f.event.special[j] || {}),
            (j = (d ? p.delegateType : p.bindType) || j),
            (r = o[j] || []),
            (m = r.length),
            (l = l
              ? new RegExp(
                  "(^|\\.)" +
                    l.split(".").sort().join("\\.(?:.*\\.)?") +
                    "(\\.|$)"
                )
              : null);
          for (n = 0; n < r.length; n++)
            (s = r[n]),
              (e || k === s.origType) &&
                (!c || c.guid === s.guid) &&
                (!l || l.test(s.namespace)) &&
                (!d || d === s.selector || (d === "**" && s.selector)) &&
                (r.splice(n--, 1),
                s.selector && r.delegateCount--,
                p.remove && p.remove.call(a, s));
          r.length === 0 &&
            m !== r.length &&
            ((!p.teardown || p.teardown.call(a, l) === !1) &&
              f.removeEvent(a, j, g.handle),
            delete o[j]);
        }
        f.isEmptyObject(o) &&
          ((q = g.handle),
          q && (q.elem = null),
          f.removeData(a, ["events", "handle"], !0));
      }
    },
    customEvent: { getData: !0, setData: !0, changeData: !0 },
    trigger: function (c, d, e, g) {
      if (!e || (e.nodeType !== 3 && e.nodeType !== 8)) {
        var h = c.type || c,
          i = [],
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s;
        if (E.test(h + f.event.triggered)) return;
        h.indexOf("!") >= 0 && ((h = h.slice(0, -1)), (k = !0)),
          h.indexOf(".") >= 0 &&
            ((i = h.split(".")), (h = i.shift()), i.sort());
        if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
        (c =
          typeof c == "object"
            ? c[f.expando]
              ? c
              : new f.Event(h, c)
            : new f.Event(h)),
          (c.type = h),
          (c.isTrigger = !0),
          (c.exclusive = k),
          (c.namespace = i.join(".")),
          (c.namespace_re = c.namespace
            ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)")
            : null),
          (o = h.indexOf(":") < 0 ? "on" + h : "");
        if (!e) {
          j = f.cache;
          for (l in j)
            j[l].events &&
              j[l].events[h] &&
              f.event.trigger(c, d, j[l].handle.elem, !0);
          return;
        }
        (c.result = b),
          c.target || (c.target = e),
          (d = d != null ? f.makeArray(d) : []),
          d.unshift(c),
          (p = f.event.special[h] || {});
        if (p.trigger && p.trigger.apply(e, d) === !1) return;
        r = [[e, p.bindType || h]];
        if (!g && !p.noBubble && !f.isWindow(e)) {
          (s = p.delegateType || h),
            (m = E.test(s + h) ? e : e.parentNode),
            (n = null);
          for (; m; m = m.parentNode) r.push([m, s]), (n = m);
          n &&
            n === e.ownerDocument &&
            r.push([n.defaultView || n.parentWindow || a, s]);
        }
        for (l = 0; l < r.length && !c.isPropagationStopped(); l++)
          (m = r[l][0]),
            (c.type = r[l][1]),
            (q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle")),
            q && q.apply(m, d),
            (q = o && m[o]),
            q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
        (c.type = h),
          !g &&
            !c.isDefaultPrevented() &&
            (!p._default || p._default.apply(e.ownerDocument, d) === !1) &&
            (h !== "click" || !f.nodeName(e, "a")) &&
            f.acceptData(e) &&
            o &&
            e[h] &&
            ((h !== "focus" && h !== "blur") || c.target.offsetWidth !== 0) &&
            !f.isWindow(e) &&
            ((n = e[o]),
            n && (e[o] = null),
            (f.event.triggered = h),
            e[h](),
            (f.event.triggered = b),
            n && (e[o] = n));
        return c.result;
      }
    },
    dispatch: function (c) {
      c = f.event.fix(c || a.event);
      var d = (f._data(this, "events") || {})[c.type] || [],
        e = d.delegateCount,
        g = [].slice.call(arguments, 0),
        h = !c.exclusive && !c.namespace,
        i = f.event.special[c.type] || {},
        j = [],
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u;
      (g[0] = c), (c.delegateTarget = this);
      if (!i.preDispatch || i.preDispatch.call(this, c) !== !1) {
        if (e && (!c.button || c.type !== "click")) {
          (n = f(this)), (n.context = this.ownerDocument || this);
          for (m = c.target; m != this; m = m.parentNode || this)
            if (m.disabled !== !0) {
              (p = {}), (r = []), (n[0] = m);
              for (k = 0; k < e; k++)
                (s = d[k]),
                  (t = s.selector),
                  p[t] === b && (p[t] = s.quick ? H(m, s.quick) : n.is(t)),
                  p[t] && r.push(s);
              r.length && j.push({ elem: m, matches: r });
            }
        }
        d.length > e && j.push({ elem: this, matches: d.slice(e) });
        for (k = 0; k < j.length && !c.isPropagationStopped(); k++) {
          (q = j[k]), (c.currentTarget = q.elem);
          for (
            l = 0;
            l < q.matches.length && !c.isImmediatePropagationStopped();
            l++
          ) {
            s = q.matches[l];
            if (
              h ||
              (!c.namespace && !s.namespace) ||
              (c.namespace_re && c.namespace_re.test(s.namespace))
            )
              (c.data = s.data),
                (c.handleObj = s),
                (o = (
                  (f.event.special[s.origType] || {}).handle || s.handler
                ).apply(q.elem, g)),
                o !== b &&
                  ((c.result = o),
                  o === !1 && (c.preventDefault(), c.stopPropagation()));
          }
        }
        i.postDispatch && i.postDispatch.call(this, c);
        return c.result;
      }
    },
    props:
      "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
        " "
      ),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (a, b) {
        a.which == null &&
          (a.which = b.charCode != null ? b.charCode : b.keyCode);
        return a;
      },
    },
    mouseHooks: {
      props:
        "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
          " "
        ),
      filter: function (a, d) {
        var e,
          f,
          g,
          h = d.button,
          i = d.fromElement;
        a.pageX == null &&
          d.clientX != null &&
          ((e = a.target.ownerDocument || c),
          (f = e.documentElement),
          (g = e.body),
          (a.pageX =
            d.clientX +
            ((f && f.scrollLeft) || (g && g.scrollLeft) || 0) -
            ((f && f.clientLeft) || (g && g.clientLeft) || 0)),
          (a.pageY =
            d.clientY +
            ((f && f.scrollTop) || (g && g.scrollTop) || 0) -
            ((f && f.clientTop) || (g && g.clientTop) || 0))),
          !a.relatedTarget &&
            i &&
            (a.relatedTarget = i === a.target ? d.toElement : i),
          !a.which &&
            h !== b &&
            (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
        return a;
      },
    },
    fix: function (a) {
      if (a[f.expando]) return a;
      var d,
        e,
        g = a,
        h = f.event.fixHooks[a.type] || {},
        i = h.props ? this.props.concat(h.props) : this.props;
      a = f.Event(g);
      for (d = i.length; d; ) (e = i[--d]), (a[e] = g[e]);
      a.target || (a.target = g.srcElement || c),
        a.target.nodeType === 3 && (a.target = a.target.parentNode),
        a.metaKey === b && (a.metaKey = a.ctrlKey);
      return h.filter ? h.filter(a, g) : a;
    },
    special: {
      ready: { setup: f.bindReady },
      load: { noBubble: !0 },
      focus: { delegateType: "focusin" },
      blur: { delegateType: "focusout" },
      beforeunload: {
        setup: function (a, b, c) {
          f.isWindow(this) && (this.onbeforeunload = c);
        },
        teardown: function (a, b) {
          this.onbeforeunload === b && (this.onbeforeunload = null);
        },
      },
    },
    simulate: function (a, b, c, d) {
      var e = f.extend(new f.Event(), c, {
        type: a,
        isSimulated: !0,
        originalEvent: {},
      });
      d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e),
        e.isDefaultPrevented() && c.preventDefault();
    },
  }),
    (f.event.handle = f.event.dispatch),
    (f.removeEvent = c.removeEventListener
      ? function (a, b, c) {
          a.removeEventListener && a.removeEventListener(b, c, !1);
        }
      : function (a, b, c) {
          a.detachEvent && a.detachEvent("on" + b, c);
        }),
    (f.Event = function (a, b) {
      if (!(this instanceof f.Event)) return new f.Event(a, b);
      a && a.type
        ? ((this.originalEvent = a),
          (this.type = a.type),
          (this.isDefaultPrevented =
            a.defaultPrevented ||
            a.returnValue === !1 ||
            (a.getPreventDefault && a.getPreventDefault())
              ? K
              : J))
        : (this.type = a),
        b && f.extend(this, b),
        (this.timeStamp = (a && a.timeStamp) || f.now()),
        (this[f.expando] = !0);
    }),
    (f.Event.prototype = {
      preventDefault: function () {
        this.isDefaultPrevented = K;
        var a = this.originalEvent;
        !a || (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
      },
      stopPropagation: function () {
        this.isPropagationStopped = K;
        var a = this.originalEvent;
        !a || (a.stopPropagation && a.stopPropagation(), (a.cancelBubble = !0));
      },
      stopImmediatePropagation: function () {
        (this.isImmediatePropagationStopped = K), this.stopPropagation();
      },
      isDefaultPrevented: J,
      isPropagationStopped: J,
      isImmediatePropagationStopped: J,
    }),
    f.each(
      { mouseenter: "mouseover", mouseleave: "mouseout" },
      function (a, b) {
        f.event.special[a] = {
          delegateType: b,
          bindType: b,
          handle: function (a) {
            var c = this,
              d = a.relatedTarget,
              e = a.handleObj,
              g = e.selector,
              h;
            if (!d || (d !== c && !f.contains(c, d)))
              (a.type = e.origType),
                (h = e.handler.apply(this, arguments)),
                (a.type = b);
            return h;
          },
        };
      }
    ),
    f.support.submitBubbles ||
      (f.event.special.submit = {
        setup: function () {
          if (f.nodeName(this, "form")) return !1;
          f.event.add(this, "click._submit keypress._submit", function (a) {
            var c = a.target,
              d =
                f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
            d &&
              !d._submit_attached &&
              (f.event.add(d, "submit._submit", function (a) {
                a._submit_bubble = !0;
              }),
              (d._submit_attached = !0));
          });
        },
        postDispatch: function (a) {
          a._submit_bubble &&
            (delete a._submit_bubble,
            this.parentNode &&
              !a.isTrigger &&
              f.event.simulate("submit", this.parentNode, a, !0));
        },
        teardown: function () {
          if (f.nodeName(this, "form")) return !1;
          f.event.remove(this, "._submit");
        },
      }),
    f.support.changeBubbles ||
      (f.event.special.change = {
        setup: function () {
          if (z.test(this.nodeName)) {
            if (this.type === "checkbox" || this.type === "radio")
              f.event.add(this, "propertychange._change", function (a) {
                a.originalEvent.propertyName === "checked" &&
                  (this._just_changed = !0);
              }),
                f.event.add(this, "click._change", function (a) {
                  this._just_changed &&
                    !a.isTrigger &&
                    ((this._just_changed = !1),
                    f.event.simulate("change", this, a, !0));
                });
            return !1;
          }
          f.event.add(this, "beforeactivate._change", function (a) {
            var b = a.target;
            z.test(b.nodeName) &&
              !b._change_attached &&
              (f.event.add(b, "change._change", function (a) {
                this.parentNode &&
                  !a.isSimulated &&
                  !a.isTrigger &&
                  f.event.simulate("change", this.parentNode, a, !0);
              }),
              (b._change_attached = !0));
          });
        },
        handle: function (a) {
          var b = a.target;
          if (
            this !== b ||
            a.isSimulated ||
            a.isTrigger ||
            (b.type !== "radio" && b.type !== "checkbox")
          )
            return a.handleObj.handler.apply(this, arguments);
        },
        teardown: function () {
          f.event.remove(this, "._change");
          return z.test(this.nodeName);
        },
      }),
    f.support.focusinBubbles ||
      f.each({ focus: "focusin", blur: "focusout" }, function (a, b) {
        var d = 0,
          e = function (a) {
            f.event.simulate(b, a.target, f.event.fix(a), !0);
          };
        f.event.special[b] = {
          setup: function () {
            d++ === 0 && c.addEventListener(a, e, !0);
          },
          teardown: function () {
            --d === 0 && c.removeEventListener(a, e, !0);
          },
        };
      }),
    f.fn.extend({
      on: function (a, c, d, e, g) {
        var h, i;
        if (typeof a == "object") {
          typeof c != "string" && ((d = d || c), (c = b));
          for (i in a) this.on(i, c, d, a[i], g);
          return this;
        }
        d == null && e == null
          ? ((e = c), (d = c = b))
          : e == null &&
            (typeof c == "string"
              ? ((e = d), (d = b))
              : ((e = d), (d = c), (c = b)));
        if (e === !1) e = J;
        else if (!e) return this;
        g === 1 &&
          ((h = e),
          (e = function (a) {
            f().off(a);
            return h.apply(this, arguments);
          }),
          (e.guid = h.guid || (h.guid = f.guid++)));
        return this.each(function () {
          f.event.add(this, a, e, d, c);
        });
      },
      one: function (a, b, c, d) {
        return this.on(a, b, c, d, 1);
      },
      off: function (a, c, d) {
        if (a && a.preventDefault && a.handleObj) {
          var e = a.handleObj;
          f(a.delegateTarget).off(
            e.namespace ? e.origType + "." + e.namespace : e.origType,
            e.selector,
            e.handler
          );
          return this;
        }
        if (typeof a == "object") {
          for (var g in a) this.off(g, c, a[g]);
          return this;
        }
        if (c === !1 || typeof c == "function") (d = c), (c = b);
        d === !1 && (d = J);
        return this.each(function () {
          f.event.remove(this, a, d, c);
        });
      },
      bind: function (a, b, c) {
        return this.on(a, null, b, c);
      },
      unbind: function (a, b) {
        return this.off(a, null, b);
      },
      live: function (a, b, c) {
        f(this.context).on(a, this.selector, b, c);
        return this;
      },
      die: function (a, b) {
        f(this.context).off(a, this.selector || "**", b);
        return this;
      },
      delegate: function (a, b, c, d) {
        return this.on(b, a, c, d);
      },
      undelegate: function (a, b, c) {
        return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c);
      },
      trigger: function (a, b) {
        return this.each(function () {
          f.event.trigger(a, b, this);
        });
      },
      triggerHandler: function (a, b) {
        if (this[0]) return f.event.trigger(a, b, this[0], !0);
      },
      toggle: function (a) {
        var b = arguments,
          c = a.guid || f.guid++,
          d = 0,
          e = function (c) {
            var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
            f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
            return b[e].apply(this, arguments) || !1;
          };
        e.guid = c;
        while (d < b.length) b[d++].guid = c;
        return this.click(e);
      },
      hover: function (a, b) {
        return this.mouseenter(a).mouseleave(b || a);
      },
    }),
    f.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
        " "
      ),
      function (a, b) {
        (f.fn[b] = function (a, c) {
          c == null && ((c = a), (a = null));
          return arguments.length > 0
            ? this.on(b, null, a, c)
            : this.trigger(b);
        }),
          f.attrFn && (f.attrFn[b] = !0),
          C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks),
          D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks);
      }
    ),
    (function () {
      function x(a, b, c, e, f, g) {
        for (var h = 0, i = e.length; h < i; h++) {
          var j = e[h];
          if (j) {
            var k = !1;
            j = j[a];
            while (j) {
              if (j[d] === c) {
                k = e[j.sizset];
                break;
              }
              if (j.nodeType === 1) {
                g || ((j[d] = c), (j.sizset = h));
                if (typeof b != "string") {
                  if (j === b) {
                    k = !0;
                    break;
                  }
                } else if (m.filter(b, [j]).length > 0) {
                  k = j;
                  break;
                }
              }
              j = j[a];
            }
            e[h] = k;
          }
        }
      }
      function w(a, b, c, e, f, g) {
        for (var h = 0, i = e.length; h < i; h++) {
          var j = e[h];
          if (j) {
            var k = !1;
            j = j[a];
            while (j) {
              if (j[d] === c) {
                k = e[j.sizset];
                break;
              }
              j.nodeType === 1 && !g && ((j[d] = c), (j.sizset = h));
              if (j.nodeName.toLowerCase() === b) {
                k = j;
                break;
              }
              j = j[a];
            }
            e[h] = k;
          }
        }
      }
      var a =
          /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        d = "sizcache" + (Math.random() + "").replace(".", ""),
        e = 0,
        g = Object.prototype.toString,
        h = !1,
        i = !0,
        j = /\\/g,
        k = /\r\n/g,
        l = /\W/;
      [0, 0].sort(function () {
        i = !1;
        return 0;
      });
      var m = function (b, d, e, f) {
        (e = e || []), (d = d || c);
        var h = d;
        if (d.nodeType !== 1 && d.nodeType !== 9) return [];
        if (!b || typeof b != "string") return e;
        var i,
          j,
          k,
          l,
          n,
          q,
          r,
          t,
          u = !0,
          v = m.isXML(d),
          w = [],
          x = b;
        do {
          a.exec(""), (i = a.exec(x));
          if (i) {
            (x = i[3]), w.push(i[1]);
            if (i[2]) {
              l = i[3];
              break;
            }
          }
        } while (i);
        if (w.length > 1 && p.exec(b))
          if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
          else {
            j = o.relative[w[0]] ? [d] : m(w.shift(), d);
            while (w.length)
              (b = w.shift()),
                o.relative[b] && (b += w.shift()),
                (j = y(b, j, f));
          }
        else {
          !f &&
            w.length > 1 &&
            d.nodeType === 9 &&
            !v &&
            o.match.ID.test(w[0]) &&
            !o.match.ID.test(w[w.length - 1]) &&
            ((n = m.find(w.shift(), d, v)),
            (d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]));
          if (d) {
            (n = f
              ? { expr: w.pop(), set: s(f) }
              : m.find(
                  w.pop(),
                  w.length === 1 &&
                    (w[0] === "~" || w[0] === "+") &&
                    d.parentNode
                    ? d.parentNode
                    : d,
                  v
                )),
              (j = n.expr ? m.filter(n.expr, n.set) : n.set),
              w.length > 0 ? (k = s(j)) : (u = !1);
            while (w.length)
              (q = w.pop()),
                (r = q),
                o.relative[q] ? (r = w.pop()) : (q = ""),
                r == null && (r = d),
                o.relative[q](k, r, v);
          } else k = w = [];
        }
        k || (k = j), k || m.error(q || b);
        if (g.call(k) === "[object Array]")
          if (!u) e.push.apply(e, k);
          else if (d && d.nodeType === 1)
            for (t = 0; k[t] != null; t++)
              k[t] &&
                (k[t] === !0 || (k[t].nodeType === 1 && m.contains(d, k[t]))) &&
                e.push(j[t]);
          else
            for (t = 0; k[t] != null; t++)
              k[t] && k[t].nodeType === 1 && e.push(j[t]);
        else s(k, e);
        l && (m(l, h, e, f), m.uniqueSort(e));
        return e;
      };
      (m.uniqueSort = function (a) {
        if (u) {
          (h = i), a.sort(u);
          if (h)
            for (var b = 1; b < a.length; b++)
              a[b] === a[b - 1] && a.splice(b--, 1);
        }
        return a;
      }),
        (m.matches = function (a, b) {
          return m(a, null, null, b);
        }),
        (m.matchesSelector = function (a, b) {
          return m(b, null, null, [a]).length > 0;
        }),
        (m.find = function (a, b, c) {
          var d, e, f, g, h, i;
          if (!a) return [];
          for (e = 0, f = o.order.length; e < f; e++) {
            h = o.order[e];
            if ((g = o.leftMatch[h].exec(a))) {
              (i = g[1]), g.splice(1, 1);
              if (i.substr(i.length - 1) !== "\\") {
                (g[1] = (g[1] || "").replace(j, "")), (d = o.find[h](g, b, c));
                if (d != null) {
                  a = a.replace(o.match[h], "");
                  break;
                }
              }
            }
          }
          d ||
            (d =
              typeof b.getElementsByTagName != "undefined"
                ? b.getElementsByTagName("*")
                : []);
          return { set: d, expr: a };
        }),
        (m.filter = function (a, c, d, e) {
          var f,
            g,
            h,
            i,
            j,
            k,
            l,
            n,
            p,
            q = a,
            r = [],
            s = c,
            t = c && c[0] && m.isXML(c[0]);
          while (a && c.length) {
            for (h in o.filter)
              if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                (k = o.filter[h]), (l = f[1]), (g = !1), f.splice(1, 1);
                if (l.substr(l.length - 1) === "\\") continue;
                s === r && (r = []);
                if (o.preFilter[h]) {
                  f = o.preFilter[h](f, s, d, r, e, t);
                  if (!f) g = i = !0;
                  else if (f === !0) continue;
                }
                if (f)
                  for (n = 0; (j = s[n]) != null; n++)
                    j &&
                      ((i = k(j, f, n, s)),
                      (p = e ^ i),
                      d && i != null
                        ? p
                          ? (g = !0)
                          : (s[n] = !1)
                        : p && (r.push(j), (g = !0)));
                if (i !== b) {
                  d || (s = r), (a = a.replace(o.match[h], ""));
                  if (!g) return [];
                  break;
                }
              }
            if (a === q)
              if (g == null) m.error(a);
              else break;
            q = a;
          }
          return s;
        }),
        (m.error = function (a) {
          throw new Error("Syntax error, unrecognized expression: " + a);
        });
      var n = (m.getText = function (a) {
          var b,
            c,
            d = a.nodeType,
            e = "";
          if (d) {
            if (d === 1 || d === 9 || d === 11) {
              if (typeof a.textContent == "string") return a.textContent;
              if (typeof a.innerText == "string")
                return a.innerText.replace(k, "");
              for (a = a.firstChild; a; a = a.nextSibling) e += n(a);
            } else if (d === 3 || d === 4) return a.nodeValue;
          } else for (b = 0; (c = a[b]); b++) c.nodeType !== 8 && (e += n(c));
          return e;
        }),
        o = (m.selectors = {
          order: ["ID", "NAME", "TAG"],
          match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD:
              /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO:
              /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/,
          },
          leftMatch: {},
          attrMap: { class: "className", for: "htmlFor" },
          attrHandle: {
            href: function (a) {
              return a.getAttribute("href");
            },
            type: function (a) {
              return a.getAttribute("type");
            },
          },
          relative: {
            "+": function (a, b) {
              var c = typeof b == "string",
                d = c && !l.test(b),
                e = c && !d;
              d && (b = b.toLowerCase());
              for (var f = 0, g = a.length, h; f < g; f++)
                if ((h = a[f])) {
                  while ((h = h.previousSibling) && h.nodeType !== 1);
                  a[f] =
                    e || (h && h.nodeName.toLowerCase() === b)
                      ? h || !1
                      : h === b;
                }
              e && m.filter(b, a, !0);
            },
            ">": function (a, b) {
              var c,
                d = typeof b == "string",
                e = 0,
                f = a.length;
              if (d && !l.test(b)) {
                b = b.toLowerCase();
                for (; e < f; e++) {
                  c = a[e];
                  if (c) {
                    var g = c.parentNode;
                    a[e] = g.nodeName.toLowerCase() === b ? g : !1;
                  }
                }
              } else {
                for (; e < f; e++)
                  (c = a[e]),
                    c && (a[e] = d ? c.parentNode : c.parentNode === b);
                d && m.filter(b, a, !0);
              }
            },
            "": function (a, b, c) {
              var d,
                f = e++,
                g = x;
              typeof b == "string" &&
                !l.test(b) &&
                ((b = b.toLowerCase()), (d = b), (g = w)),
                g("parentNode", b, f, a, d, c);
            },
            "~": function (a, b, c) {
              var d,
                f = e++,
                g = x;
              typeof b == "string" &&
                !l.test(b) &&
                ((b = b.toLowerCase()), (d = b), (g = w)),
                g("previousSibling", b, f, a, d, c);
            },
          },
          find: {
            ID: function (a, b, c) {
              if (typeof b.getElementById != "undefined" && !c) {
                var d = b.getElementById(a[1]);
                return d && d.parentNode ? [d] : [];
              }
            },
            NAME: function (a, b) {
              if (typeof b.getElementsByName != "undefined") {
                var c = [],
                  d = b.getElementsByName(a[1]);
                for (var e = 0, f = d.length; e < f; e++)
                  d[e].getAttribute("name") === a[1] && c.push(d[e]);
                return c.length === 0 ? null : c;
              }
            },
            TAG: function (a, b) {
              if (typeof b.getElementsByTagName != "undefined")
                return b.getElementsByTagName(a[1]);
            },
          },
          preFilter: {
            CLASS: function (a, b, c, d, e, f) {
              a = " " + a[1].replace(j, "") + " ";
              if (f) return a;
              for (var g = 0, h; (h = b[g]) != null; g++)
                h &&
                  (e ^
                  (h.className &&
                    (" " + h.className + " ")
                      .replace(/[\t\n\r]/g, " ")
                      .indexOf(a) >= 0)
                    ? c || d.push(h)
                    : c && (b[g] = !1));
              return !1;
            },
            ID: function (a) {
              return a[1].replace(j, "");
            },
            TAG: function (a, b) {
              return a[1].replace(j, "").toLowerCase();
            },
            CHILD: function (a) {
              if (a[1] === "nth") {
                a[2] || m.error(a[0]), (a[2] = a[2].replace(/^\+|\s*/g, ""));
                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                  (a[2] === "even" && "2n") ||
                    (a[2] === "odd" && "2n+1") ||
                    (!/\D/.test(a[2]) && "0n+" + a[2]) ||
                    a[2]
                );
                (a[2] = b[1] + (b[2] || 1) - 0), (a[3] = b[3] - 0);
              } else a[2] && m.error(a[0]);
              a[0] = e++;
              return a;
            },
            ATTR: function (a, b, c, d, e, f) {
              var g = (a[1] = a[1].replace(j, ""));
              !f && o.attrMap[g] && (a[1] = o.attrMap[g]),
                (a[4] = (a[4] || a[5] || "").replace(j, "")),
                a[2] === "~=" && (a[4] = " " + a[4] + " ");
              return a;
            },
            PSEUDO: function (b, c, d, e, f) {
              if (b[1] === "not")
                if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3]))
                  b[3] = m(b[3], null, null, c);
                else {
                  var g = m.filter(b[3], c, d, !0 ^ f);
                  d || e.push.apply(e, g);
                  return !1;
                }
              else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0]))
                return !0;
              return b;
            },
            POS: function (a) {
              a.unshift(!0);
              return a;
            },
          },
          filters: {
            enabled: function (a) {
              return a.disabled === !1 && a.type !== "hidden";
            },
            disabled: function (a) {
              return a.disabled === !0;
            },
            checked: function (a) {
              return a.checked === !0;
            },
            selected: function (a) {
              a.parentNode && a.parentNode.selectedIndex;
              return a.selected === !0;
            },
            parent: function (a) {
              return !!a.firstChild;
            },
            empty: function (a) {
              return !a.firstChild;
            },
            has: function (a, b, c) {
              return !!m(c[3], a).length;
            },
            header: function (a) {
              return /h\d/i.test(a.nodeName);
            },
            text: function (a) {
              var b = a.getAttribute("type"),
                c = a.type;
              return (
                a.nodeName.toLowerCase() === "input" &&
                "text" === c &&
                (b === c || b === null)
              );
            },
            radio: function (a) {
              return a.nodeName.toLowerCase() === "input" && "radio" === a.type;
            },
            checkbox: function (a) {
              return (
                a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
              );
            },
            file: function (a) {
              return a.nodeName.toLowerCase() === "input" && "file" === a.type;
            },
            password: function (a) {
              return (
                a.nodeName.toLowerCase() === "input" && "password" === a.type
              );
            },
            submit: function (a) {
              var b = a.nodeName.toLowerCase();
              return (b === "input" || b === "button") && "submit" === a.type;
            },
            image: function (a) {
              return a.nodeName.toLowerCase() === "input" && "image" === a.type;
            },
            reset: function (a) {
              var b = a.nodeName.toLowerCase();
              return (b === "input" || b === "button") && "reset" === a.type;
            },
            button: function (a) {
              var b = a.nodeName.toLowerCase();
              return (b === "input" && "button" === a.type) || b === "button";
            },
            input: function (a) {
              return /input|select|textarea|button/i.test(a.nodeName);
            },
            focus: function (a) {
              return a === a.ownerDocument.activeElement;
            },
          },
          setFilters: {
            first: function (a, b) {
              return b === 0;
            },
            last: function (a, b, c, d) {
              return b === d.length - 1;
            },
            even: function (a, b) {
              return b % 2 === 0;
            },
            odd: function (a, b) {
              return b % 2 === 1;
            },
            lt: function (a, b, c) {
              return b < c[3] - 0;
            },
            gt: function (a, b, c) {
              return b > c[3] - 0;
            },
            nth: function (a, b, c) {
              return c[3] - 0 === b;
            },
            eq: function (a, b, c) {
              return c[3] - 0 === b;
            },
          },
          filter: {
            PSEUDO: function (a, b, c, d) {
              var e = b[1],
                f = o.filters[e];
              if (f) return f(a, c, b, d);
              if (e === "contains")
                return (
                  (a.textContent || a.innerText || n([a]) || "").indexOf(
                    b[3]
                  ) >= 0
                );
              if (e === "not") {
                var g = b[3];
                for (var h = 0, i = g.length; h < i; h++)
                  if (g[h] === a) return !1;
                return !0;
              }
              m.error(e);
            },
            CHILD: function (a, b) {
              var c,
                e,
                f,
                g,
                h,
                i,
                j,
                k = b[1],
                l = a;
              switch (k) {
                case "only":
                case "first":
                  while ((l = l.previousSibling))
                    if (l.nodeType === 1) return !1;
                  if (k === "first") return !0;
                  l = a;
                case "last":
                  while ((l = l.nextSibling)) if (l.nodeType === 1) return !1;
                  return !0;
                case "nth":
                  (c = b[2]), (e = b[3]);
                  if (c === 1 && e === 0) return !0;
                  (f = b[0]), (g = a.parentNode);
                  if (g && (g[d] !== f || !a.nodeIndex)) {
                    i = 0;
                    for (l = g.firstChild; l; l = l.nextSibling)
                      l.nodeType === 1 && (l.nodeIndex = ++i);
                    g[d] = f;
                  }
                  j = a.nodeIndex - e;
                  return c === 0 ? j === 0 : j % c === 0 && j / c >= 0;
              }
            },
            ID: function (a, b) {
              return a.nodeType === 1 && a.getAttribute("id") === b;
            },
            TAG: function (a, b) {
              return (
                (b === "*" && a.nodeType === 1) ||
                (!!a.nodeName && a.nodeName.toLowerCase() === b)
              );
            },
            CLASS: function (a, b) {
              return (
                (" " + (a.className || a.getAttribute("class")) + " ").indexOf(
                  b
                ) > -1
              );
            },
            ATTR: function (a, b) {
              var c = b[1],
                d = m.attr
                  ? m.attr(a, c)
                  : o.attrHandle[c]
                  ? o.attrHandle[c](a)
                  : a[c] != null
                  ? a[c]
                  : a.getAttribute(c),
                e = d + "",
                f = b[2],
                g = b[4];
              return d == null
                ? f === "!="
                : !f && m.attr
                ? d != null
                : f === "="
                ? e === g
                : f === "*="
                ? e.indexOf(g) >= 0
                : f === "~="
                ? (" " + e + " ").indexOf(g) >= 0
                : g
                ? f === "!="
                  ? e !== g
                  : f === "^="
                  ? e.indexOf(g) === 0
                  : f === "$="
                  ? e.substr(e.length - g.length) === g
                  : f === "|="
                  ? e === g || e.substr(0, g.length + 1) === g + "-"
                  : !1
                : e && d !== !1;
            },
            POS: function (a, b, c, d) {
              var e = b[2],
                f = o.setFilters[e];
              if (f) return f(a, c, b, d);
            },
          },
        }),
        p = o.match.POS,
        q = function (a, b) {
          return "\\" + (b - 0 + 1);
        };
      for (var r in o.match)
        (o.match[r] = new RegExp(
          o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source
        )),
          (o.leftMatch[r] = new RegExp(
            /(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q)
          ));
      o.match.globalPOS = p;
      var s = function (a, b) {
        a = Array.prototype.slice.call(a, 0);
        if (b) {
          b.push.apply(b, a);
          return b;
        }
        return a;
      };
      try {
        Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType;
      } catch (t) {
        s = function (a, b) {
          var c = 0,
            d = b || [];
          if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
          else if (typeof a.length == "number")
            for (var e = a.length; c < e; c++) d.push(a[c]);
          else for (; a[c]; c++) d.push(a[c]);
          return d;
        };
      }
      var u, v;
      c.documentElement.compareDocumentPosition
        ? (u = function (a, b) {
            if (a === b) {
              h = !0;
              return 0;
            }
            if (!a.compareDocumentPosition || !b.compareDocumentPosition)
              return a.compareDocumentPosition ? -1 : 1;
            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
          })
        : ((u = function (a, b) {
            if (a === b) {
              h = !0;
              return 0;
            }
            if (a.sourceIndex && b.sourceIndex)
              return a.sourceIndex - b.sourceIndex;
            var c,
              d,
              e = [],
              f = [],
              g = a.parentNode,
              i = b.parentNode,
              j = g;
            if (g === i) return v(a, b);
            if (!g) return -1;
            if (!i) return 1;
            while (j) e.unshift(j), (j = j.parentNode);
            j = i;
            while (j) f.unshift(j), (j = j.parentNode);
            (c = e.length), (d = f.length);
            for (var k = 0; k < c && k < d; k++)
              if (e[k] !== f[k]) return v(e[k], f[k]);
            return k === c ? v(a, f[k], -1) : v(e[k], b, 1);
          }),
          (v = function (a, b, c) {
            if (a === b) return c;
            var d = a.nextSibling;
            while (d) {
              if (d === b) return -1;
              d = d.nextSibling;
            }
            return 1;
          })),
        (function () {
          var a = c.createElement("div"),
            d = "script" + new Date().getTime(),
            e = c.documentElement;
          (a.innerHTML = "<a name='" + d + "'/>"),
            e.insertBefore(a, e.firstChild),
            c.getElementById(d) &&
              ((o.find.ID = function (a, c, d) {
                if (typeof c.getElementById != "undefined" && !d) {
                  var e = c.getElementById(a[1]);
                  return e
                    ? e.id === a[1] ||
                      (typeof e.getAttributeNode != "undefined" &&
                        e.getAttributeNode("id").nodeValue === a[1])
                      ? [e]
                      : b
                    : [];
                }
              }),
              (o.filter.ID = function (a, b) {
                var c =
                  typeof a.getAttributeNode != "undefined" &&
                  a.getAttributeNode("id");
                return a.nodeType === 1 && c && c.nodeValue === b;
              })),
            e.removeChild(a),
            (e = a = null);
        })(),
        (function () {
          var a = c.createElement("div");
          a.appendChild(c.createComment("")),
            a.getElementsByTagName("*").length > 0 &&
              (o.find.TAG = function (a, b) {
                var c = b.getElementsByTagName(a[1]);
                if (a[1] === "*") {
                  var d = [];
                  for (var e = 0; c[e]; e++)
                    c[e].nodeType === 1 && d.push(c[e]);
                  c = d;
                }
                return c;
              }),
            (a.innerHTML = "<a href='#'></a>"),
            a.firstChild &&
              typeof a.firstChild.getAttribute != "undefined" &&
              a.firstChild.getAttribute("href") !== "#" &&
              (o.attrHandle.href = function (a) {
                return a.getAttribute("href", 2);
              }),
            (a = null);
        })(),
        c.querySelectorAll &&
          (function () {
            var a = m,
              b = c.createElement("div"),
              d = "__sizzle__";
            b.innerHTML = "<p class='TEST'></p>";
            if (
              !b.querySelectorAll ||
              b.querySelectorAll(".TEST").length !== 0
            ) {
              m = function (b, e, f, g) {
                e = e || c;
                if (!g && !m.isXML(e)) {
                  var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                  if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                    if (h[1]) return s(e.getElementsByTagName(b), f);
                    if (h[2] && o.find.CLASS && e.getElementsByClassName)
                      return s(e.getElementsByClassName(h[2]), f);
                  }
                  if (e.nodeType === 9) {
                    if (b === "body" && e.body) return s([e.body], f);
                    if (h && h[3]) {
                      var i = e.getElementById(h[3]);
                      if (!i || !i.parentNode) return s([], f);
                      if (i.id === h[3]) return s([i], f);
                    }
                    try {
                      return s(e.querySelectorAll(b), f);
                    } catch (j) {}
                  } else if (
                    e.nodeType === 1 &&
                    e.nodeName.toLowerCase() !== "object"
                  ) {
                    var k = e,
                      l = e.getAttribute("id"),
                      n = l || d,
                      p = e.parentNode,
                      q = /^\s*[+~]/.test(b);
                    l ? (n = n.replace(/'/g, "\\$&")) : e.setAttribute("id", n),
                      q && p && (e = e.parentNode);
                    try {
                      if (!q || p)
                        return s(
                          e.querySelectorAll("[id='" + n + "'] " + b),
                          f
                        );
                    } catch (r) {
                    } finally {
                      l || k.removeAttribute("id");
                    }
                  }
                }
                return a(b, e, f, g);
              };
              for (var e in a) m[e] = a[e];
              b = null;
            }
          })(),
        (function () {
          var a = c.documentElement,
            b =
              a.matchesSelector ||
              a.mozMatchesSelector ||
              a.webkitMatchesSelector ||
              a.msMatchesSelector;
          if (b) {
            var d = !b.call(c.createElement("div"), "div"),
              e = !1;
            try {
              b.call(c.documentElement, "[test!='']:sizzle");
            } catch (f) {
              e = !0;
            }
            m.matchesSelector = function (a, c) {
              c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
              if (!m.isXML(a))
                try {
                  if (e || (!o.match.PSEUDO.test(c) && !/!=/.test(c))) {
                    var f = b.call(a, c);
                    if (f || !d || (a.document && a.document.nodeType !== 11))
                      return f;
                  }
                } catch (g) {}
              return m(c, null, null, [a]).length > 0;
            };
          }
        })(),
        (function () {
          var a = c.createElement("div");
          a.innerHTML = "<div class='test e'></div><div class='test'></div>";
          if (
            !!a.getElementsByClassName &&
            a.getElementsByClassName("e").length !== 0
          ) {
            a.lastChild.className = "e";
            if (a.getElementsByClassName("e").length === 1) return;
            o.order.splice(1, 0, "CLASS"),
              (o.find.CLASS = function (a, b, c) {
                if (typeof b.getElementsByClassName != "undefined" && !c)
                  return b.getElementsByClassName(a[1]);
              }),
              (a = null);
          }
        })(),
        c.documentElement.contains
          ? (m.contains = function (a, b) {
              return a !== b && (a.contains ? a.contains(b) : !0);
            })
          : c.documentElement.compareDocumentPosition
          ? (m.contains = function (a, b) {
              return !!(a.compareDocumentPosition(b) & 16);
            })
          : (m.contains = function () {
              return !1;
            }),
        (m.isXML = function (a) {
          var b = (a ? a.ownerDocument || a : 0).documentElement;
          return b ? b.nodeName !== "HTML" : !1;
        });
      var y = function (a, b, c) {
        var d,
          e = [],
          f = "",
          g = b.nodeType ? [b] : b;
        while ((d = o.match.PSEUDO.exec(a)))
          (f += d[0]), (a = a.replace(o.match.PSEUDO, ""));
        a = o.relative[a] ? a + "*" : a;
        for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
        return m.filter(f, e);
      };
      (m.attr = f.attr),
        (m.selectors.attrMap = {}),
        (f.find = m),
        (f.expr = m.selectors),
        (f.expr[":"] = f.expr.filters),
        (f.unique = m.uniqueSort),
        (f.text = m.getText),
        (f.isXMLDoc = m.isXML),
        (f.contains = m.contains);
    })();
  var L = /Until$/,
    M = /^(?:parents|prevUntil|prevAll)/,
    N = /,/,
    O = /^.[^:#\[\.,]*$/,
    P = Array.prototype.slice,
    Q = f.expr.match.globalPOS,
    R = { children: !0, contents: !0, next: !0, prev: !0 };
  f.fn.extend({
    find: function (a) {
      var b = this,
        c,
        d;
      if (typeof a != "string")
        return f(a).filter(function () {
          for (c = 0, d = b.length; c < d; c++)
            if (f.contains(b[c], this)) return !0;
        });
      var e = this.pushStack("", "find", a),
        g,
        h,
        i;
      for (c = 0, d = this.length; c < d; c++) {
        (g = e.length), f.find(a, this[c], e);
        if (c > 0)
          for (h = g; h < e.length; h++)
            for (i = 0; i < g; i++)
              if (e[i] === e[h]) {
                e.splice(h--, 1);
                break;
              }
      }
      return e;
    },
    has: function (a) {
      var b = f(a);
      return this.filter(function () {
        for (var a = 0, c = b.length; a < c; a++)
          if (f.contains(this, b[a])) return !0;
      });
    },
    not: function (a) {
      return this.pushStack(T(this, a, !1), "not", a);
    },
    filter: function (a) {
      return this.pushStack(T(this, a, !0), "filter", a);
    },
    is: function (a) {
      return (
        !!a &&
        (typeof a == "string"
          ? Q.test(a)
            ? f(a, this.context).index(this[0]) >= 0
            : f.filter(a, this).length > 0
          : this.filter(a).length > 0)
      );
    },
    closest: function (a, b) {
      var c = [],
        d,
        e,
        g = this[0];
      if (f.isArray(a)) {
        var h = 1;
        while (g && g.ownerDocument && g !== b) {
          for (d = 0; d < a.length; d++)
            f(g).is(a[d]) && c.push({ selector: a[d], elem: g, level: h });
          (g = g.parentNode), h++;
        }
        return c;
      }
      var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
      for (d = 0, e = this.length; d < e; d++) {
        g = this[d];
        while (g) {
          if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
            c.push(g);
            break;
          }
          g = g.parentNode;
          if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break;
        }
      }
      c = c.length > 1 ? f.unique(c) : c;
      return this.pushStack(c, "closest", a);
    },
    index: function (a) {
      if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
      if (typeof a == "string") return f.inArray(this[0], f(a));
      return f.inArray(a.jquery ? a[0] : a, this);
    },
    add: function (a, b) {
      var c =
          typeof a == "string"
            ? f(a, b)
            : f.makeArray(a && a.nodeType ? [a] : a),
        d = f.merge(this.get(), c);
      return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d));
    },
    andSelf: function () {
      return this.add(this.prevObject);
    },
  }),
    f.each(
      {
        parent: function (a) {
          var b = a.parentNode;
          return b && b.nodeType !== 11 ? b : null;
        },
        parents: function (a) {
          return f.dir(a, "parentNode");
        },
        parentsUntil: function (a, b, c) {
          return f.dir(a, "parentNode", c);
        },
        next: function (a) {
          return f.nth(a, 2, "nextSibling");
        },
        prev: function (a) {
          return f.nth(a, 2, "previousSibling");
        },
        nextAll: function (a) {
          return f.dir(a, "nextSibling");
        },
        prevAll: function (a) {
          return f.dir(a, "previousSibling");
        },
        nextUntil: function (a, b, c) {
          return f.dir(a, "nextSibling", c);
        },
        prevUntil: function (a, b, c) {
          return f.dir(a, "previousSibling", c);
        },
        siblings: function (a) {
          return f.sibling((a.parentNode || {}).firstChild, a);
        },
        children: function (a) {
          return f.sibling(a.firstChild);
        },
        contents: function (a) {
          return f.nodeName(a, "iframe")
            ? a.contentDocument || a.contentWindow.document
            : f.makeArray(a.childNodes);
        },
      },
      function (a, b) {
        f.fn[a] = function (c, d) {
          var e = f.map(this, b, c);
          L.test(a) || (d = c),
            d && typeof d == "string" && (e = f.filter(d, e)),
            (e = this.length > 1 && !R[a] ? f.unique(e) : e),
            (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
          return this.pushStack(e, a, P.call(arguments).join(","));
        };
      }
    ),
    f.extend({
      filter: function (a, b, c) {
        c && (a = ":not(" + a + ")");
        return b.length === 1
          ? f.find.matchesSelector(b[0], a)
            ? [b[0]]
            : []
          : f.find.matches(a, b);
      },
      dir: function (a, c, d) {
        var e = [],
          g = a[c];
        while (
          g &&
          g.nodeType !== 9 &&
          (d === b || g.nodeType !== 1 || !f(g).is(d))
        )
          g.nodeType === 1 && e.push(g), (g = g[c]);
        return e;
      },
      nth: function (a, b, c, d) {
        b = b || 1;
        var e = 0;
        for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break;
        return a;
      },
      sibling: function (a, b) {
        var c = [];
        for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
        return c;
      },
    });
  var V =
      "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    W = / jQuery\d+="(?:\d+|null)"/g,
    X = /^\s+/,
    Y =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    Z = /<([\w:]+)/,
    $ = /<tbody/i,
    _ = /<|&#?\w+;/,
    ba = /<(?:script|style)/i,
    bb = /<(?:script|object|embed|option|style)/i,
    bc = new RegExp("<(?:" + V + ")[\\s/>]", "i"),
    bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
    be = /\/(java|ecma)script/i,
    bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
    bg = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      area: [1, "<map>", "</map>"],
      _default: [0, "", ""],
    },
    bh = U(c);
  (bg.optgroup = bg.option),
    (bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead),
    (bg.th = bg.td),
    f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]),
    f.fn.extend({
      text: function (a) {
        return f.access(
          this,
          function (a) {
            return a === b
              ? f.text(this)
              : this.empty().append(
                  ((this[0] && this[0].ownerDocument) || c).createTextNode(a)
                );
          },
          null,
          a,
          arguments.length
        );
      },
      wrapAll: function (a) {
        if (f.isFunction(a))
          return this.each(function (b) {
            f(this).wrapAll(a.call(this, b));
          });
        if (this[0]) {
          var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && b.insertBefore(this[0]),
            b
              .map(function () {
                var a = this;
                while (a.firstChild && a.firstChild.nodeType === 1)
                  a = a.firstChild;
                return a;
              })
              .append(this);
        }
        return this;
      },
      wrapInner: function (a) {
        if (f.isFunction(a))
          return this.each(function (b) {
            f(this).wrapInner(a.call(this, b));
          });
        return this.each(function () {
          var b = f(this),
            c = b.contents();
          c.length ? c.wrapAll(a) : b.append(a);
        });
      },
      wrap: function (a) {
        var b = f.isFunction(a);
        return this.each(function (c) {
          f(this).wrapAll(b ? a.call(this, c) : a);
        });
      },
      unwrap: function () {
        return this.parent()
          .each(function () {
            f.nodeName(this, "body") || f(this).replaceWith(this.childNodes);
          })
          .end();
      },
      append: function () {
        return this.domManip(arguments, !0, function (a) {
          this.nodeType === 1 && this.appendChild(a);
        });
      },
      prepend: function () {
        return this.domManip(arguments, !0, function (a) {
          this.nodeType === 1 && this.insertBefore(a, this.firstChild);
        });
      },
      before: function () {
        if (this[0] && this[0].parentNode)
          return this.domManip(arguments, !1, function (a) {
            this.parentNode.insertBefore(a, this);
          });
        if (arguments.length) {
          var a = f.clean(arguments);
          a.push.apply(a, this.toArray());
          return this.pushStack(a, "before", arguments);
        }
      },
      after: function () {
        if (this[0] && this[0].parentNode)
          return this.domManip(arguments, !1, function (a) {
            this.parentNode.insertBefore(a, this.nextSibling);
          });
        if (arguments.length) {
          var a = this.pushStack(this, "after", arguments);
          a.push.apply(a, f.clean(arguments));
          return a;
        }
      },
      remove: function (a, b) {
        for (var c = 0, d; (d = this[c]) != null; c++)
          if (!a || f.filter(a, [d]).length)
            !b &&
              d.nodeType === 1 &&
              (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])),
              d.parentNode && d.parentNode.removeChild(d);
        return this;
      },
      empty: function () {
        for (var a = 0, b; (b = this[a]) != null; a++) {
          b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
          while (b.firstChild) b.removeChild(b.firstChild);
        }
        return this;
      },
      clone: function (a, b) {
        (a = a == null ? !1 : a), (b = b == null ? a : b);
        return this.map(function () {
          return f.clone(this, a, b);
        });
      },
      html: function (a) {
        return f.access(
          this,
          function (a) {
            var c = this[0] || {},
              d = 0,
              e = this.length;
            if (a === b)
              return c.nodeType === 1 ? c.innerHTML.replace(W, "") : null;
            if (
              typeof a == "string" &&
              !ba.test(a) &&
              (f.support.leadingWhitespace || !X.test(a)) &&
              !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]
            ) {
              a = a.replace(Y, "<$1></$2>");
              try {
                for (; d < e; d++)
                  (c = this[d] || {}),
                    c.nodeType === 1 &&
                      (f.cleanData(c.getElementsByTagName("*")),
                      (c.innerHTML = a));
                c = 0;
              } catch (g) {}
            }
            c && this.empty().append(a);
          },
          null,
          a,
          arguments.length
        );
      },
      replaceWith: function (a) {
        if (this[0] && this[0].parentNode) {
          if (f.isFunction(a))
            return this.each(function (b) {
              var c = f(this),
                d = c.html();
              c.replaceWith(a.call(this, b, d));
            });
          typeof a != "string" && (a = f(a).detach());
          return this.each(function () {
            var b = this.nextSibling,
              c = this.parentNode;
            f(this).remove(), b ? f(b).before(a) : f(c).append(a);
          });
        }
        return this.length
          ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a)
          : this;
      },
      detach: function (a) {
        return this.remove(a, !0);
      },
      domManip: function (a, c, d) {
        var e,
          g,
          h,
          i,
          j = a[0],
          k = [];
        if (
          !f.support.checkClone &&
          arguments.length === 3 &&
          typeof j == "string" &&
          bd.test(j)
        )
          return this.each(function () {
            f(this).domManip(a, c, d, !0);
          });
        if (f.isFunction(j))
          return this.each(function (e) {
            var g = f(this);
            (a[0] = j.call(this, e, c ? g.html() : b)), g.domManip(a, c, d);
          });
        if (this[0]) {
          (i = j && j.parentNode),
            f.support.parentNode &&
            i &&
            i.nodeType === 11 &&
            i.childNodes.length === this.length
              ? (e = { fragment: i })
              : (e = f.buildFragment(a, this, k)),
            (h = e.fragment),
            h.childNodes.length === 1
              ? (g = h = h.firstChild)
              : (g = h.firstChild);
          if (g) {
            c = c && f.nodeName(g, "tr");
            for (var l = 0, m = this.length, n = m - 1; l < m; l++)
              d.call(
                c ? bi(this[l], g) : this[l],
                e.cacheable || (m > 1 && l < n) ? f.clone(h, !0, !0) : h
              );
          }
          k.length &&
            f.each(k, function (a, b) {
              b.src
                ? f.ajax({
                    type: "GET",
                    global: !1,
                    url: b.src,
                    async: !1,
                    dataType: "script",
                  })
                : f.globalEval(
                    (b.text || b.textContent || b.innerHTML || "").replace(
                      bf,
                      "/*$0*/"
                    )
                  ),
                b.parentNode && b.parentNode.removeChild(b);
            });
        }
        return this;
      },
    }),
    (f.buildFragment = function (a, b, d) {
      var e,
        g,
        h,
        i,
        j = a[0];
      b && b[0] && (i = b[0].ownerDocument || b[0]),
        i.createDocumentFragment || (i = c),
        a.length === 1 &&
          typeof j == "string" &&
          j.length < 512 &&
          i === c &&
          j.charAt(0) === "<" &&
          !bb.test(j) &&
          (f.support.checkClone || !bd.test(j)) &&
          (f.support.html5Clone || !bc.test(j)) &&
          ((g = !0), (h = f.fragments[j]), h && h !== 1 && (e = h)),
        e || ((e = i.createDocumentFragment()), f.clean(a, i, e, d)),
        g && (f.fragments[j] = h ? e : 1);
      return { fragment: e, cacheable: g };
    }),
    (f.fragments = {}),
    f.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (a, b) {
        f.fn[a] = function (c) {
          var d = [],
            e = f(c),
            g = this.length === 1 && this[0].parentNode;
          if (
            g &&
            g.nodeType === 11 &&
            g.childNodes.length === 1 &&
            e.length === 1
          ) {
            e[b](this[0]);
            return this;
          }
          for (var h = 0, i = e.length; h < i; h++) {
            var j = (h > 0 ? this.clone(!0) : this).get();
            f(e[h])[b](j), (d = d.concat(j));
          }
          return this.pushStack(d, a, e.selector);
        };
      }
    ),
    f.extend({
      clone: function (a, b, c) {
        var d,
          e,
          g,
          h =
            f.support.html5Clone ||
            f.isXMLDoc(a) ||
            !bc.test("<" + a.nodeName + ">")
              ? a.cloneNode(!0)
              : bo(a);
        if (
          (!f.support.noCloneEvent || !f.support.noCloneChecked) &&
          (a.nodeType === 1 || a.nodeType === 11) &&
          !f.isXMLDoc(a)
        ) {
          bk(a, h), (d = bl(a)), (e = bl(h));
          for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g]);
        }
        if (b) {
          bj(a, h);
          if (c) {
            (d = bl(a)), (e = bl(h));
            for (g = 0; d[g]; ++g) bj(d[g], e[g]);
          }
        }
        d = e = null;
        return h;
      },
      clean: function (a, b, d, e) {
        var g,
          h,
          i,
          j = [];
        (b = b || c),
          typeof b.createElement == "undefined" &&
            (b = b.ownerDocument || (b[0] && b[0].ownerDocument) || c);
        for (var k = 0, l; (l = a[k]) != null; k++) {
          typeof l == "number" && (l += "");
          if (!l) continue;
          if (typeof l == "string")
            if (!_.test(l)) l = b.createTextNode(l);
            else {
              l = l.replace(Y, "<$1></$2>");
              var m = (Z.exec(l) || ["", ""])[1].toLowerCase(),
                n = bg[m] || bg._default,
                o = n[0],
                p = b.createElement("div"),
                q = bh.childNodes,
                r;
              b === c ? bh.appendChild(p) : U(b).appendChild(p),
                (p.innerHTML = n[1] + l + n[2]);
              while (o--) p = p.lastChild;
              if (!f.support.tbody) {
                var s = $.test(l),
                  t =
                    m === "table" && !s
                      ? p.firstChild && p.firstChild.childNodes
                      : n[1] === "<table>" && !s
                      ? p.childNodes
                      : [];
                for (i = t.length - 1; i >= 0; --i)
                  f.nodeName(t[i], "tbody") &&
                    !t[i].childNodes.length &&
                    t[i].parentNode.removeChild(t[i]);
              }
              !f.support.leadingWhitespace &&
                X.test(l) &&
                p.insertBefore(b.createTextNode(X.exec(l)[0]), p.firstChild),
                (l = p.childNodes),
                p &&
                  (p.parentNode.removeChild(p),
                  q.length > 0 &&
                    ((r = q[q.length - 1]),
                    r && r.parentNode && r.parentNode.removeChild(r)));
            }
          var u;
          if (!f.support.appendChecked)
            if (l[0] && typeof (u = l.length) == "number")
              for (i = 0; i < u; i++) bn(l[i]);
            else bn(l);
          l.nodeType ? j.push(l) : (j = f.merge(j, l));
        }
        if (d) {
          g = function (a) {
            return !a.type || be.test(a.type);
          };
          for (k = 0; j[k]; k++) {
            h = j[k];
            if (e && f.nodeName(h, "script") && (!h.type || be.test(h.type)))
              e.push(h.parentNode ? h.parentNode.removeChild(h) : h);
            else {
              if (h.nodeType === 1) {
                var v = f.grep(h.getElementsByTagName("script"), g);
                j.splice.apply(j, [k + 1, 0].concat(v));
              }
              d.appendChild(h);
            }
          }
        }
        return j;
      },
      cleanData: function (a) {
        var b,
          c,
          d = f.cache,
          e = f.event.special,
          g = f.support.deleteExpando;
        for (var h = 0, i; (i = a[h]) != null; h++) {
          if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
          c = i[f.expando];
          if (c) {
            b = d[c];
            if (b && b.events) {
              for (var j in b.events)
                e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
              b.handle && (b.handle.elem = null);
            }
            g
              ? delete i[f.expando]
              : i.removeAttribute && i.removeAttribute(f.expando),
              delete d[c];
          }
        }
      },
    });
  var bp = /alpha\([^)]*\)/i,
    bq = /opacity=([^)]*)/,
    br = /([A-Z]|^ms)/g,
    bs = /^[\-+]?(?:\d*\.)?\d+$/i,
    bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
    bu = /^([\-+])=([\-+.\de]+)/,
    bv = /^margin/,
    bw = { position: "absolute", visibility: "hidden", display: "block" },
    bx = ["Top", "Right", "Bottom", "Left"],
    by,
    bz,
    bA;
  (f.fn.css = function (a, c) {
    return f.access(
      this,
      function (a, c, d) {
        return d !== b ? f.style(a, c, d) : f.css(a, c);
      },
      a,
      c,
      arguments.length > 1
    );
  }),
    f.extend({
      cssHooks: {
        opacity: {
          get: function (a, b) {
            if (b) {
              var c = by(a, "opacity");
              return c === "" ? "1" : c;
            }
            return a.style.opacity;
          },
        },
      },
      cssNumber: {
        fillOpacity: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
      },
      cssProps: { float: f.support.cssFloat ? "cssFloat" : "styleFloat" },
      style: function (a, c, d, e) {
        if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
          var g,
            h,
            i = f.camelCase(c),
            j = a.style,
            k = f.cssHooks[i];
          c = f.cssProps[i] || i;
          if (d === b) {
            if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g;
            return j[c];
          }
          (h = typeof d),
            h === "string" &&
              (g = bu.exec(d)) &&
              ((d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c))),
              (h = "number"));
          if (d == null || (h === "number" && isNaN(d))) return;
          h === "number" && !f.cssNumber[i] && (d += "px");
          if (!k || !("set" in k) || (d = k.set(a, d)) !== b)
            try {
              j[c] = d;
            } catch (l) {}
        }
      },
      css: function (a, c, d) {
        var e, g;
        (c = f.camelCase(c)),
          (g = f.cssHooks[c]),
          (c = f.cssProps[c] || c),
          c === "cssFloat" && (c = "float");
        if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
        if (by) return by(a, c);
      },
      swap: function (a, b, c) {
        var d = {},
          e,
          f;
        for (f in b) (d[f] = a.style[f]), (a.style[f] = b[f]);
        e = c.call(a);
        for (f in b) a.style[f] = d[f];
        return e;
      },
    }),
    (f.curCSS = f.css),
    c.defaultView &&
      c.defaultView.getComputedStyle &&
      (bz = function (a, b) {
        var c,
          d,
          e,
          g,
          h = a.style;
        (b = b.replace(br, "-$1").toLowerCase()),
          (d = a.ownerDocument.defaultView) &&
            (e = d.getComputedStyle(a, null)) &&
            ((c = e.getPropertyValue(b)),
            c === "" &&
              !f.contains(a.ownerDocument.documentElement, a) &&
              (c = f.style(a, b))),
          !f.support.pixelMargin &&
            e &&
            bv.test(b) &&
            bt.test(c) &&
            ((g = h.width), (h.width = c), (c = e.width), (h.width = g));
        return c;
      }),
    c.documentElement.currentStyle &&
      (bA = function (a, b) {
        var c,
          d,
          e,
          f = a.currentStyle && a.currentStyle[b],
          g = a.style;
        f == null && g && (e = g[b]) && (f = e),
          bt.test(f) &&
            ((c = g.left),
            (d = a.runtimeStyle && a.runtimeStyle.left),
            d && (a.runtimeStyle.left = a.currentStyle.left),
            (g.left = b === "fontSize" ? "1em" : f),
            (f = g.pixelLeft + "px"),
            (g.left = c),
            d && (a.runtimeStyle.left = d));
        return f === "" ? "auto" : f;
      }),
    (by = bz || bA),
    f.each(["height", "width"], function (a, b) {
      f.cssHooks[b] = {
        get: function (a, c, d) {
          if (c)
            return a.offsetWidth !== 0
              ? bB(a, b, d)
              : f.swap(a, bw, function () {
                  return bB(a, b, d);
                });
        },
        set: function (a, b) {
          return bs.test(b) ? b + "px" : b;
        },
      };
    }),
    f.support.opacity ||
      (f.cssHooks.opacity = {
        get: function (a, b) {
          return bq.test(
            (b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || ""
          )
            ? parseFloat(RegExp.$1) / 100 + ""
            : b
            ? "1"
            : "";
        },
        set: function (a, b) {
          var c = a.style,
            d = a.currentStyle,
            e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
            g = (d && d.filter) || c.filter || "";
          c.zoom = 1;
          if (b >= 1 && f.trim(g.replace(bp, "")) === "") {
            c.removeAttribute("filter");
            if (d && !d.filter) return;
          }
          c.filter = bp.test(g) ? g.replace(bp, e) : g + " " + e;
        },
      }),
    f(function () {
      f.support.reliableMarginRight ||
        (f.cssHooks.marginRight = {
          get: function (a, b) {
            return f.swap(a, { display: "inline-block" }, function () {
              return b ? by(a, "margin-right") : a.style.marginRight;
            });
          },
        });
    }),
    f.expr &&
      f.expr.filters &&
      ((f.expr.filters.hidden = function (a) {
        var b = a.offsetWidth,
          c = a.offsetHeight;
        return (
          (b === 0 && c === 0) ||
          (!f.support.reliableHiddenOffsets &&
            ((a.style && a.style.display) || f.css(a, "display")) === "none")
        );
      }),
      (f.expr.filters.visible = function (a) {
        return !f.expr.filters.hidden(a);
      })),
    f.each({ margin: "", padding: "", border: "Width" }, function (a, b) {
      f.cssHooks[a + b] = {
        expand: function (c) {
          var d,
            e = typeof c == "string" ? c.split(" ") : [c],
            f = {};
          for (d = 0; d < 4; d++) f[a + bx[d] + b] = e[d] || e[d - 2] || e[0];
          return f;
        },
      };
    });
  var bC = /%20/g,
    bD = /\[\]$/,
    bE = /\r?\n/g,
    bF = /#.*$/,
    bG = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    bH =
      /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    bI = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    bJ = /^(?:GET|HEAD)$/,
    bK = /^\/\//,
    bL = /\?/,
    bM = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    bN = /^(?:select|textarea)/i,
    bO = /\s+/,
    bP = /([?&])_=[^&]*/,
    bQ = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
    bR = f.fn.load,
    bS = {},
    bT = {},
    bU,
    bV,
    bW = ["*/"] + ["*"];
  try {
    bU = e.href;
  } catch (bX) {
    (bU = c.createElement("a")), (bU.href = ""), (bU = bU.href);
  }
  (bV = bQ.exec(bU.toLowerCase()) || []),
    f.fn.extend({
      load: function (a, c, d) {
        if (typeof a != "string" && bR) return bR.apply(this, arguments);
        if (!this.length) return this;
        var e = a.indexOf(" ");
        if (e >= 0) {
          var g = a.slice(e, a.length);
          a = a.slice(0, e);
        }
        var h = "GET";
        c &&
          (f.isFunction(c)
            ? ((d = c), (c = b))
            : typeof c == "object" &&
              ((c = f.param(c, f.ajaxSettings.traditional)), (h = "POST")));
        var i = this;
        f.ajax({
          url: a,
          type: h,
          dataType: "html",
          data: c,
          complete: function (a, b, c) {
            (c = a.responseText),
              a.isResolved() &&
                (a.done(function (a) {
                  c = a;
                }),
                i.html(g ? f("<div>").append(c.replace(bM, "")).find(g) : c)),
              d && i.each(d, [c, b, a]);
          },
        });
        return this;
      },
      serialize: function () {
        return f.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          return this.elements ? f.makeArray(this.elements) : this;
        })
          .filter(function () {
            return (
              this.name &&
              !this.disabled &&
              (this.checked || bN.test(this.nodeName) || bH.test(this.type))
            );
          })
          .map(function (a, b) {
            var c = f(this).val();
            return c == null
              ? null
              : f.isArray(c)
              ? f.map(c, function (a, c) {
                  return { name: b.name, value: a.replace(bE, "\r\n") };
                })
              : { name: b.name, value: c.replace(bE, "\r\n") };
          })
          .get();
      },
    }),
    f.each(
      "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(
        " "
      ),
      function (a, b) {
        f.fn[b] = function (a) {
          return this.on(b, a);
        };
      }
    ),
    f.each(["get", "post"], function (a, c) {
      f[c] = function (a, d, e, g) {
        f.isFunction(d) && ((g = g || e), (e = d), (d = b));
        return f.ajax({ type: c, url: a, data: d, success: e, dataType: g });
      };
    }),
    f.extend({
      getScript: function (a, c) {
        return f.get(a, b, c, "script");
      },
      getJSON: function (a, b, c) {
        return f.get(a, b, c, "json");
      },
      ajaxSetup: function (a, b) {
        b ? b$(a, f.ajaxSettings) : ((b = a), (a = f.ajaxSettings)), b$(a, b);
        return a;
      },
      ajaxSettings: {
        url: bU,
        isLocal: bI.test(bV[1]),
        global: !0,
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        processData: !0,
        async: !0,
        accepts: {
          xml: "application/xml, text/xml",
          html: "text/html",
          text: "text/plain",
          json: "application/json, text/javascript",
          "*": bW,
        },
        contents: { xml: /xml/, html: /html/, json: /json/ },
        responseFields: { xml: "responseXML", text: "responseText" },
        converters: {
          "* text": a.String,
          "text html": !0,
          "text json": f.parseJSON,
          "text xml": f.parseXML,
        },
        flatOptions: { context: !0, url: !0 },
      },
      ajaxPrefilter: bY(bS),
      ajaxTransport: bY(bT),
      ajax: function (a, c) {
        function w(a, c, l, m) {
          if (s !== 2) {
            (s = 2),
              q && clearTimeout(q),
              (p = b),
              (n = m || ""),
              (v.readyState = a > 0 ? 4 : 0);
            var o,
              r,
              u,
              w = c,
              x = l ? ca(d, v, l) : b,
              y,
              z;
            if ((a >= 200 && a < 300) || a === 304) {
              if (d.ifModified) {
                if ((y = v.getResponseHeader("Last-Modified")))
                  f.lastModified[k] = y;
                if ((z = v.getResponseHeader("Etag"))) f.etag[k] = z;
              }
              if (a === 304) (w = "notmodified"), (o = !0);
              else
                try {
                  (r = cb(d, x)), (w = "success"), (o = !0);
                } catch (A) {
                  (w = "parsererror"), (u = A);
                }
            } else {
              u = w;
              if (!w || a) (w = "error"), a < 0 && (a = 0);
            }
            (v.status = a),
              (v.statusText = "" + (c || w)),
              o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]),
              v.statusCode(j),
              (j = b),
              t &&
                g.trigger("ajax" + (o ? "Success" : "Error"), [
                  v,
                  d,
                  o ? r : u,
                ]),
              i.fireWith(e, [v, w]),
              t &&
                (g.trigger("ajaxComplete", [v, d]),
                --f.active || f.event.trigger("ajaxStop"));
          }
        }
        typeof a == "object" && ((c = a), (a = b)), (c = c || {});
        var d = f.ajaxSetup({}, c),
          e = d.context || d,
          g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
          h = f.Deferred(),
          i = f.Callbacks("once memory"),
          j = d.statusCode || {},
          k,
          l = {},
          m = {},
          n,
          o,
          p,
          q,
          r,
          s = 0,
          t,
          u,
          v = {
            readyState: 0,
            setRequestHeader: function (a, b) {
              if (!s) {
                var c = a.toLowerCase();
                (a = m[c] = m[c] || a), (l[a] = b);
              }
              return this;
            },
            getAllResponseHeaders: function () {
              return s === 2 ? n : null;
            },
            getResponseHeader: function (a) {
              var c;
              if (s === 2) {
                if (!o) {
                  o = {};
                  while ((c = bG.exec(n))) o[c[1].toLowerCase()] = c[2];
                }
                c = o[a.toLowerCase()];
              }
              return c === b ? null : c;
            },
            overrideMimeType: function (a) {
              s || (d.mimeType = a);
              return this;
            },
            abort: function (a) {
              (a = a || "abort"), p && p.abort(a), w(0, a);
              return this;
            },
          };
        h.promise(v),
          (v.success = v.done),
          (v.error = v.fail),
          (v.complete = i.add),
          (v.statusCode = function (a) {
            if (a) {
              var b;
              if (s < 2) for (b in a) j[b] = [j[b], a[b]];
              else (b = a[v.status]), v.then(b, b);
            }
            return this;
          }),
          (d.url = ((a || d.url) + "")
            .replace(bF, "")
            .replace(bK, bV[1] + "//")),
          (d.dataTypes = f
            .trim(d.dataType || "*")
            .toLowerCase()
            .split(bO)),
          d.crossDomain == null &&
            ((r = bQ.exec(d.url.toLowerCase())),
            (d.crossDomain = !(
              !r ||
              (r[1] == bV[1] &&
                r[2] == bV[2] &&
                (r[3] || (r[1] === "http:" ? 80 : 443)) ==
                  (bV[3] || (bV[1] === "http:" ? 80 : 443)))
            ))),
          d.data &&
            d.processData &&
            typeof d.data != "string" &&
            (d.data = f.param(d.data, d.traditional)),
          bZ(bS, d, c, v);
        if (s === 2) return !1;
        (t = d.global),
          (d.type = d.type.toUpperCase()),
          (d.hasContent = !bJ.test(d.type)),
          t && f.active++ === 0 && f.event.trigger("ajaxStart");
        if (!d.hasContent) {
          d.data &&
            ((d.url += (bL.test(d.url) ? "&" : "?") + d.data), delete d.data),
            (k = d.url);
          if (d.cache === !1) {
            var x = f.now(),
              y = d.url.replace(bP, "$1_=" + x);
            d.url =
              y + (y === d.url ? (bL.test(d.url) ? "&" : "?") + "_=" + x : "");
          }
        }
        ((d.data && d.hasContent && d.contentType !== !1) || c.contentType) &&
          v.setRequestHeader("Content-Type", d.contentType),
          d.ifModified &&
            ((k = k || d.url),
            f.lastModified[k] &&
              v.setRequestHeader("If-Modified-Since", f.lastModified[k]),
            f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])),
          v.setRequestHeader(
            "Accept",
            d.dataTypes[0] && d.accepts[d.dataTypes[0]]
              ? d.accepts[d.dataTypes[0]] +
                  (d.dataTypes[0] !== "*" ? ", " + bW + "; q=0.01" : "")
              : d.accepts["*"]
          );
        for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
        if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
          v.abort();
          return !1;
        }
        for (u in { success: 1, error: 1, complete: 1 }) v[u](d[u]);
        p = bZ(bT, d, c, v);
        if (!p) w(-1, "No Transport");
        else {
          (v.readyState = 1),
            t && g.trigger("ajaxSend", [v, d]),
            d.async &&
              d.timeout > 0 &&
              (q = setTimeout(function () {
                v.abort("timeout");
              }, d.timeout));
          try {
            (s = 1), p.send(l, w);
          } catch (z) {
            if (s < 2) w(-1, z);
            else throw z;
          }
        }
        return v;
      },
      param: function (a, c) {
        var d = [],
          e = function (a, b) {
            (b = f.isFunction(b) ? b() : b),
              (d[d.length] =
                encodeURIComponent(a) + "=" + encodeURIComponent(b));
          };
        c === b && (c = f.ajaxSettings.traditional);
        if (f.isArray(a) || (a.jquery && !f.isPlainObject(a)))
          f.each(a, function () {
            e(this.name, this.value);
          });
        else for (var g in a) b_(g, a[g], c, e);
        return d.join("&").replace(bC, "+");
      },
    }),
    f.extend({ active: 0, lastModified: {}, etag: {} });
  var cc = f.now(),
    cd = /(\=)\?(&|$)|\?\?/i;
  f.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      return f.expando + "_" + cc++;
    },
  }),
    f.ajaxPrefilter("json jsonp", function (b, c, d) {
      var e =
        typeof b.data == "string" &&
        /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
      if (
        b.dataTypes[0] === "jsonp" ||
        (b.jsonp !== !1 && (cd.test(b.url) || (e && cd.test(b.data))))
      ) {
        var g,
          h = (b.jsonpCallback = f.isFunction(b.jsonpCallback)
            ? b.jsonpCallback()
            : b.jsonpCallback),
          i = a[h],
          j = b.url,
          k = b.data,
          l = "$1" + h + "$2";
        b.jsonp !== !1 &&
          ((j = j.replace(cd, l)),
          b.url === j &&
            (e && (k = k.replace(cd, l)),
            b.data === k &&
              (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))),
          (b.url = j),
          (b.data = k),
          (a[h] = function (a) {
            g = [a];
          }),
          d.always(function () {
            (a[h] = i), g && f.isFunction(i) && a[h](g[0]);
          }),
          (b.converters["script json"] = function () {
            g || f.error(h + " was not called");
            return g[0];
          }),
          (b.dataTypes[0] = "json");
        return "script";
      }
    }),
    f.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /javascript|ecmascript/ },
      converters: {
        "text script": function (a) {
          f.globalEval(a);
          return a;
        },
      },
    }),
    f.ajaxPrefilter("script", function (a) {
      a.cache === b && (a.cache = !1),
        a.crossDomain && ((a.type = "GET"), (a.global = !1));
    }),
    f.ajaxTransport("script", function (a) {
      if (a.crossDomain) {
        var d,
          e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
        return {
          send: function (f, g) {
            (d = c.createElement("script")),
              (d.async = "async"),
              a.scriptCharset && (d.charset = a.scriptCharset),
              (d.src = a.url),
              (d.onload = d.onreadystatechange =
                function (a, c) {
                  if (
                    c ||
                    !d.readyState ||
                    /loaded|complete/.test(d.readyState)
                  )
                    (d.onload = d.onreadystatechange = null),
                      e && d.parentNode && e.removeChild(d),
                      (d = b),
                      c || g(200, "success");
                }),
              e.insertBefore(d, e.firstChild);
          },
          abort: function () {
            d && d.onload(0, 1);
          },
        };
      }
    });
  var ce = a.ActiveXObject
      ? function () {
          for (var a in cg) cg[a](0, 1);
        }
      : !1,
    cf = 0,
    cg;
  (f.ajaxSettings.xhr = a.ActiveXObject
    ? function () {
        return (!this.isLocal && ch()) || ci();
      }
    : ch),
    (function (a) {
      f.extend(f.support, { ajax: !!a, cors: !!a && "withCredentials" in a });
    })(f.ajaxSettings.xhr()),
    f.support.ajax &&
      f.ajaxTransport(function (c) {
        if (!c.crossDomain || f.support.cors) {
          var d;
          return {
            send: function (e, g) {
              var h = c.xhr(),
                i,
                j;
              c.username
                ? h.open(c.type, c.url, c.async, c.username, c.password)
                : h.open(c.type, c.url, c.async);
              if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j];
              c.mimeType &&
                h.overrideMimeType &&
                h.overrideMimeType(c.mimeType),
                !c.crossDomain &&
                  !e["X-Requested-With"] &&
                  (e["X-Requested-With"] = "XMLHttpRequest");
              try {
                for (j in e) h.setRequestHeader(j, e[j]);
              } catch (k) {}
              h.send((c.hasContent && c.data) || null),
                (d = function (a, e) {
                  var j, k, l, m, n;
                  try {
                    if (d && (e || h.readyState === 4)) {
                      (d = b),
                        i &&
                          ((h.onreadystatechange = f.noop), ce && delete cg[i]);
                      if (e) h.readyState !== 4 && h.abort();
                      else {
                        (j = h.status),
                          (l = h.getAllResponseHeaders()),
                          (m = {}),
                          (n = h.responseXML),
                          n && n.documentElement && (m.xml = n);
                        try {
                          m.text = h.responseText;
                        } catch (a) {}
                        try {
                          k = h.statusText;
                        } catch (o) {
                          k = "";
                        }
                        !j && c.isLocal && !c.crossDomain
                          ? (j = m.text ? 200 : 404)
                          : j === 1223 && (j = 204);
                      }
                    }
                  } catch (p) {
                    e || g(-1, p);
                  }
                  m && g(j, k, m, l);
                }),
                !c.async || h.readyState === 4
                  ? d()
                  : ((i = ++cf),
                    ce && (cg || ((cg = {}), f(a).unload(ce)), (cg[i] = d)),
                    (h.onreadystatechange = d));
            },
            abort: function () {
              d && d(0, 1);
            },
          };
        }
      });
  var cj = {},
    ck,
    cl,
    cm = /^(?:toggle|show|hide)$/,
    cn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    co,
    cp = [
      ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
      ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
      ["opacity"],
    ],
    cq;
  f.fn.extend({
    show: function (a, b, c) {
      var d, e;
      if (a || a === 0) return this.animate(ct("show", 3), a, b, c);
      for (var g = 0, h = this.length; g < h; g++)
        (d = this[g]),
          d.style &&
            ((e = d.style.display),
            !f._data(d, "olddisplay") &&
              e === "none" &&
              (e = d.style.display = ""),
            ((e === "" && f.css(d, "display") === "none") ||
              !f.contains(d.ownerDocument.documentElement, d)) &&
              f._data(d, "olddisplay", cu(d.nodeName)));
      for (g = 0; g < h; g++) {
        d = this[g];
        if (d.style) {
          e = d.style.display;
          if (e === "" || e === "none")
            d.style.display = f._data(d, "olddisplay") || "";
        }
      }
      return this;
    },
    hide: function (a, b, c) {
      if (a || a === 0) return this.animate(ct("hide", 3), a, b, c);
      var d,
        e,
        g = 0,
        h = this.length;
      for (; g < h; g++)
        (d = this[g]),
          d.style &&
            ((e = f.css(d, "display")),
            e !== "none" &&
              !f._data(d, "olddisplay") &&
              f._data(d, "olddisplay", e));
      for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
      return this;
    },
    _toggle: f.fn.toggle,
    toggle: function (a, b, c) {
      var d = typeof a == "boolean";
      f.isFunction(a) && f.isFunction(b)
        ? this._toggle.apply(this, arguments)
        : a == null || d
        ? this.each(function () {
            var b = d ? a : f(this).is(":hidden");
            f(this)[b ? "show" : "hide"]();
          })
        : this.animate(ct("toggle", 3), a, b, c);
      return this;
    },
    fadeTo: function (a, b, c, d) {
      return this.filter(":hidden")
        .css("opacity", 0)
        .show()
        .end()
        .animate({ opacity: b }, a, c, d);
    },
    animate: function (a, b, c, d) {
      function g() {
        e.queue === !1 && f._mark(this);
        var b = f.extend({}, e),
          c = this.nodeType === 1,
          d = c && f(this).is(":hidden"),
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q;
        b.animatedProperties = {};
        for (i in a) {
          (g = f.camelCase(i)), i !== g && ((a[g] = a[i]), delete a[i]);
          if ((k = f.cssHooks[g]) && "expand" in k) {
            (l = k.expand(a[g])), delete a[g];
            for (i in l) i in a || (a[i] = l[i]);
          }
        }
        for (g in a) {
          (h = a[g]),
            f.isArray(h)
              ? ((b.animatedProperties[g] = h[1]), (h = a[g] = h[0]))
              : (b.animatedProperties[g] =
                  (b.specialEasing && b.specialEasing[g]) ||
                  b.easing ||
                  "swing");
          if ((h === "hide" && d) || (h === "show" && !d))
            return b.complete.call(this);
          c &&
            (g === "height" || g === "width") &&
            ((b.overflow = [
              this.style.overflow,
              this.style.overflowX,
              this.style.overflowY,
            ]),
            f.css(this, "display") === "inline" &&
              f.css(this, "float") === "none" &&
              (!f.support.inlineBlockNeedsLayout ||
              cu(this.nodeName) === "inline"
                ? (this.style.display = "inline-block")
                : (this.style.zoom = 1)));
        }
        b.overflow != null && (this.style.overflow = "hidden");
        for (i in a)
          (j = new f.fx(this, b, i)),
            (h = a[i]),
            cm.test(h)
              ? ((q =
                  f._data(this, "toggle" + i) ||
                  (h === "toggle" ? (d ? "show" : "hide") : 0)),
                q
                  ? (f._data(
                      this,
                      "toggle" + i,
                      q === "show" ? "hide" : "show"
                    ),
                    j[q]())
                  : j[h]())
              : ((m = cn.exec(h)),
                (n = j.cur()),
                m
                  ? ((o = parseFloat(m[2])),
                    (p = m[3] || (f.cssNumber[i] ? "" : "px")),
                    p !== "px" &&
                      (f.style(this, i, (o || 1) + p),
                      (n = ((o || 1) / j.cur()) * n),
                      f.style(this, i, n + p)),
                    m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n),
                    j.custom(n, o, p))
                  : j.custom(n, h, ""));
        return !0;
      }
      var e = f.speed(b, c, d);
      if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
      a = f.extend({}, a);
      return e.queue === !1 ? this.each(g) : this.queue(e.queue, g);
    },
    stop: function (a, c, d) {
      typeof a != "string" && ((d = c), (c = a), (a = b)),
        c && a !== !1 && this.queue(a || "fx", []);
      return this.each(function () {
        function h(a, b, c) {
          var e = b[c];
          f.removeData(a, c, !0), e.stop(d);
        }
        var b,
          c = !1,
          e = f.timers,
          g = f._data(this);
        d || f._unmark(!0, this);
        if (a == null)
          for (b in g)
            g[b] &&
              g[b].stop &&
              b.indexOf(".run") === b.length - 4 &&
              h(this, g, b);
        else g[(b = a + ".run")] && g[b].stop && h(this, g, b);
        for (b = e.length; b--; )
          e[b].elem === this &&
            (a == null || e[b].queue === a) &&
            (d ? e[b](!0) : e[b].saveState(), (c = !0), e.splice(b, 1));
        (!d || !c) && f.dequeue(this, a);
      });
    },
  }),
    f.each(
      {
        slideDown: ct("show", 1),
        slideUp: ct("hide", 1),
        slideToggle: ct("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (a, b) {
        f.fn[a] = function (a, c, d) {
          return this.animate(b, a, c, d);
        };
      }
    ),
    f.extend({
      speed: function (a, b, c) {
        var d =
          a && typeof a == "object"
            ? f.extend({}, a)
            : {
                complete: c || (!c && b) || (f.isFunction(a) && a),
                duration: a,
                easing: (c && b) || (b && !f.isFunction(b) && b),
              };
        d.duration = f.fx.off
          ? 0
          : typeof d.duration == "number"
          ? d.duration
          : d.duration in f.fx.speeds
          ? f.fx.speeds[d.duration]
          : f.fx.speeds._default;
        if (d.queue == null || d.queue === !0) d.queue = "fx";
        (d.old = d.complete),
          (d.complete = function (a) {
            f.isFunction(d.old) && d.old.call(this),
              d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this);
          });
        return d;
      },
      easing: {
        linear: function (a) {
          return a;
        },
        swing: function (a) {
          return -Math.cos(a * Math.PI) / 2 + 0.5;
        },
      },
      timers: [],
      fx: function (a, b, c) {
        (this.options = b),
          (this.elem = a),
          (this.prop = c),
          (b.orig = b.orig || {});
      },
    }),
    (f.fx.prototype = {
      update: function () {
        this.options.step && this.options.step.call(this.elem, this.now, this),
          (f.fx.step[this.prop] || f.fx.step._default)(this);
      },
      cur: function () {
        if (
          this.elem[this.prop] != null &&
          (!this.elem.style || this.elem.style[this.prop] == null)
        )
          return this.elem[this.prop];
        var a,
          b = f.css(this.elem, this.prop);
        return isNaN((a = parseFloat(b))) ? (!b || b === "auto" ? 0 : b) : a;
      },
      custom: function (a, c, d) {
        function h(a) {
          return e.step(a);
        }
        var e = this,
          g = f.fx;
        (this.startTime = cq || cr()),
          (this.end = c),
          (this.now = this.start = a),
          (this.pos = this.state = 0),
          (this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px")),
          (h.queue = this.options.queue),
          (h.elem = this.elem),
          (h.saveState = function () {
            f._data(e.elem, "fxshow" + e.prop) === b &&
              (e.options.hide
                ? f._data(e.elem, "fxshow" + e.prop, e.start)
                : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end));
          }),
          h() &&
            f.timers.push(h) &&
            !co &&
            (co = setInterval(g.tick, g.interval));
      },
      show: function () {
        var a = f._data(this.elem, "fxshow" + this.prop);
        (this.options.orig[this.prop] = a || f.style(this.elem, this.prop)),
          (this.options.show = !0),
          a !== b
            ? this.custom(this.cur(), a)
            : this.custom(
                this.prop === "width" || this.prop === "height" ? 1 : 0,
                this.cur()
              ),
          f(this.elem).show();
      },
      hide: function () {
        (this.options.orig[this.prop] =
          f._data(this.elem, "fxshow" + this.prop) ||
          f.style(this.elem, this.prop)),
          (this.options.hide = !0),
          this.custom(this.cur(), 0);
      },
      step: function (a) {
        var b,
          c,
          d,
          e = cq || cr(),
          g = !0,
          h = this.elem,
          i = this.options;
        if (a || e >= i.duration + this.startTime) {
          (this.now = this.end),
            (this.pos = this.state = 1),
            this.update(),
            (i.animatedProperties[this.prop] = !0);
          for (b in i.animatedProperties)
            i.animatedProperties[b] !== !0 && (g = !1);
          if (g) {
            i.overflow != null &&
              !f.support.shrinkWrapBlocks &&
              f.each(["", "X", "Y"], function (a, b) {
                h.style["overflow" + b] = i.overflow[a];
              }),
              i.hide && f(h).hide();
            if (i.hide || i.show)
              for (b in i.animatedProperties)
                f.style(h, b, i.orig[b]),
                  f.removeData(h, "fxshow" + b, !0),
                  f.removeData(h, "toggle" + b, !0);
            (d = i.complete), d && ((i.complete = !1), d.call(h));
          }
          return !1;
        }
        i.duration == Infinity
          ? (this.now = e)
          : ((c = e - this.startTime),
            (this.state = c / i.duration),
            (this.pos = f.easing[i.animatedProperties[this.prop]](
              this.state,
              c,
              0,
              1,
              i.duration
            )),
            (this.now = this.start + (this.end - this.start) * this.pos)),
          this.update();
        return !0;
      },
    }),
    f.extend(f.fx, {
      tick: function () {
        var a,
          b = f.timers,
          c = 0;
        for (; c < b.length; c++)
          (a = b[c]), !a() && b[c] === a && b.splice(c--, 1);
        b.length || f.fx.stop();
      },
      interval: 13,
      stop: function () {
        clearInterval(co), (co = null);
      },
      speeds: { slow: 600, fast: 200, _default: 400 },
      step: {
        opacity: function (a) {
          f.style(a.elem, "opacity", a.now);
        },
        _default: function (a) {
          a.elem.style && a.elem.style[a.prop] != null
            ? (a.elem.style[a.prop] = a.now + a.unit)
            : (a.elem[a.prop] = a.now);
        },
      },
    }),
    f.each(cp.concat.apply([], cp), function (a, b) {
      b.indexOf("margin") &&
        (f.fx.step[b] = function (a) {
          f.style(a.elem, b, Math.max(0, a.now) + a.unit);
        });
    }),
    f.expr &&
      f.expr.filters &&
      (f.expr.filters.animated = function (a) {
        return f.grep(f.timers, function (b) {
          return a === b.elem;
        }).length;
      });
  var cv,
    cw = /^t(?:able|d|h)$/i,
    cx = /^(?:body|html)$/i;
  "getBoundingClientRect" in c.documentElement
    ? (cv = function (a, b, c, d) {
        try {
          d = a.getBoundingClientRect();
        } catch (e) {}
        if (!d || !f.contains(c, a))
          return d ? { top: d.top, left: d.left } : { top: 0, left: 0 };
        var g = b.body,
          h = cy(b),
          i = c.clientTop || g.clientTop || 0,
          j = c.clientLeft || g.clientLeft || 0,
          k =
            h.pageYOffset || (f.support.boxModel && c.scrollTop) || g.scrollTop,
          l =
            h.pageXOffset ||
            (f.support.boxModel && c.scrollLeft) ||
            g.scrollLeft,
          m = d.top + k - i,
          n = d.left + l - j;
        return { top: m, left: n };
      })
    : (cv = function (a, b, c) {
        var d,
          e = a.offsetParent,
          g = a,
          h = b.body,
          i = b.defaultView,
          j = i ? i.getComputedStyle(a, null) : a.currentStyle,
          k = a.offsetTop,
          l = a.offsetLeft;
        while ((a = a.parentNode) && a !== h && a !== c) {
          if (f.support.fixedPosition && j.position === "fixed") break;
          (d = i ? i.getComputedStyle(a, null) : a.currentStyle),
            (k -= a.scrollTop),
            (l -= a.scrollLeft),
            a === e &&
              ((k += a.offsetTop),
              (l += a.offsetLeft),
              f.support.doesNotAddBorder &&
                (!f.support.doesAddBorderForTableAndCells ||
                  !cw.test(a.nodeName)) &&
                ((k += parseFloat(d.borderTopWidth) || 0),
                (l += parseFloat(d.borderLeftWidth) || 0)),
              (g = e),
              (e = a.offsetParent)),
            f.support.subtractsBorderForOverflowNotVisible &&
              d.overflow !== "visible" &&
              ((k += parseFloat(d.borderTopWidth) || 0),
              (l += parseFloat(d.borderLeftWidth) || 0)),
            (j = d);
        }
        if (j.position === "relative" || j.position === "static")
          (k += h.offsetTop), (l += h.offsetLeft);
        f.support.fixedPosition &&
          j.position === "fixed" &&
          ((k += Math.max(c.scrollTop, h.scrollTop)),
          (l += Math.max(c.scrollLeft, h.scrollLeft)));
        return { top: k, left: l };
      }),
    (f.fn.offset = function (a) {
      if (arguments.length)
        return a === b
          ? this
          : this.each(function (b) {
              f.offset.setOffset(this, a, b);
            });
      var c = this[0],
        d = c && c.ownerDocument;
      if (!d) return null;
      if (c === d.body) return f.offset.bodyOffset(c);
      return cv(c, d, d.documentElement);
    }),
    (f.offset = {
      bodyOffset: function (a) {
        var b = a.offsetTop,
          c = a.offsetLeft;
        f.support.doesNotIncludeMarginInBodyOffset &&
          ((b += parseFloat(f.css(a, "marginTop")) || 0),
          (c += parseFloat(f.css(a, "marginLeft")) || 0));
        return { top: b, left: c };
      },
      setOffset: function (a, b, c) {
        var d = f.css(a, "position");
        d === "static" && (a.style.position = "relative");
        var e = f(a),
          g = e.offset(),
          h = f.css(a, "top"),
          i = f.css(a, "left"),
          j =
            (d === "absolute" || d === "fixed") &&
            f.inArray("auto", [h, i]) > -1,
          k = {},
          l = {},
          m,
          n;
        j
          ? ((l = e.position()), (m = l.top), (n = l.left))
          : ((m = parseFloat(h) || 0), (n = parseFloat(i) || 0)),
          f.isFunction(b) && (b = b.call(a, c, g)),
          b.top != null && (k.top = b.top - g.top + m),
          b.left != null && (k.left = b.left - g.left + n),
          "using" in b ? b.using.call(a, k) : e.css(k);
      },
    }),
    f.fn.extend({
      position: function () {
        if (!this[0]) return null;
        var a = this[0],
          b = this.offsetParent(),
          c = this.offset(),
          d = cx.test(b[0].nodeName) ? { top: 0, left: 0 } : b.offset();
        (c.top -= parseFloat(f.css(a, "marginTop")) || 0),
          (c.left -= parseFloat(f.css(a, "marginLeft")) || 0),
          (d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0),
          (d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0);
        return { top: c.top - d.top, left: c.left - d.left };
      },
      offsetParent: function () {
        return this.map(function () {
          var a = this.offsetParent || c.body;
          while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static")
            a = a.offsetParent;
          return a;
        });
      },
    }),
    f.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (a, c) {
        var d = /Y/.test(c);
        f.fn[a] = function (e) {
          return f.access(
            this,
            function (a, e, g) {
              var h = cy(a);
              if (g === b)
                return h
                  ? c in h
                    ? h[c]
                    : (f.support.boxModel && h.document.documentElement[e]) ||
                      h.document.body[e]
                  : a[e];
              h
                ? h.scrollTo(
                    d ? f(h).scrollLeft() : g,
                    d ? g : f(h).scrollTop()
                  )
                : (a[e] = g);
            },
            a,
            e,
            arguments.length,
            null
          );
        };
      }
    ),
    f.each({ Height: "height", Width: "width" }, function (a, c) {
      var d = "client" + a,
        e = "scroll" + a,
        g = "offset" + a;
      (f.fn["inner" + a] = function () {
        var a = this[0];
        return a
          ? a.style
            ? parseFloat(f.css(a, c, "padding"))
            : this[c]()
          : null;
      }),
        (f.fn["outer" + a] = function (a) {
          var b = this[0];
          return b
            ? b.style
              ? parseFloat(f.css(b, c, a ? "margin" : "border"))
              : this[c]()
            : null;
        }),
        (f.fn[c] = function (a) {
          return f.access(
            this,
            function (a, c, h) {
              var i, j, k, l;
              if (f.isWindow(a)) {
                (i = a.document), (j = i.documentElement[d]);
                return (f.support.boxModel && j) || (i.body && i.body[d]) || j;
              }
              if (a.nodeType === 9) {
                i = a.documentElement;
                if (i[d] >= i[e]) return i[d];
                return Math.max(a.body[e], i[e], a.body[g], i[g]);
              }
              if (h === b) {
                (k = f.css(a, c)), (l = parseFloat(k));
                return f.isNumeric(l) ? l : k;
              }
              f(a).css(c, h);
            },
            c,
            a,
            arguments.length,
            null
          );
        });
    }),
    (a.jQuery = a.$ = f),
    typeof define == "function" &&
      define.amd &&
      define.amd.jQuery &&
      define("jquery", [], function () {
        return f;
      });
})(window);
(function (w, d, $) {
  $(d).ready(function () {
    $(
      ".snap-drawer .expandable-toggle, #consumerPanelMenu .expandable-toggle, .expandable-menu"
    ).on("click", function (e) {
      e.preventDefault();
      $(this).parent().toggleClass("expanded");
    });
    $("#open-left").on("click", function (e) {
      e.preventDefault();
      $("html").toggleClass("hamburger-opened");
    });
  });
})(window, document, window.jQuery || window.HA.dom);
var floatyBar = (function (w, d, $, pub) {
  var init,
    delay,
    setupFloater,
    decide,
    recalculateThresholds,
    state = {
      floaters: [],
      visibleClass: "visible",
      stickyClass: "floaty-sticky",
      isSticky: false,
    };
  decide = function () {
    var currPos = w.pageYOffset,
      viewportHeight = document.documentElement.clientHeight,
      bottomY = currPos + viewportHeight;
    for (var i = 0; i < state.floaters.length; ++i) {
      if (state.floaters[i].stickyEnd) {
        var elemHeight = $(state.floaters[i].elem).outerHeight(),
          threshTop = state.floaters[i].stickyThreshTop,
          stickyTop = state.floaters[i].stickyTop,
          stickyTopWithElem = stickyTop + elemHeight;
        if (threshTop != null) {
          if (state.floaters[i].stickyEndFrom == "bottom") {
            var currTop = w.pageYOffset,
              currTopWithElem = currTop + elemHeight;
            if (threshTop <= currTopWithElem) {
              var offset = parseInt(state.floaters[i].stickyOffset);
              var diff =
                threshTop - stickyTopWithElem >= 0
                  ? threshTop - stickyTopWithElem + offset
                  : 0;
              $(state.floaters[i].elem).removeClass(state.visibleClass);
              $(state.floaters[i].elem).addClass(state.stickyClass);
              state.floaters[i].isSticky = true;
              state.floaters[i].elem.style.position = "absolute";
              state.floaters[i].elem.style.top = diff + "px";
            } else if (threshTop > currTopWithElem) {
              $(state.floaters[i].elem).removeClass(state.stickyClass);
              state.floaters[i].isSticky = false;
              state.floaters[i].elem.style.position = "";
              state.floaters[i].elem.style.top = "";
            }
          }
        }
      }
      if (
        currPos >= state.floaters[i].thresholdTop &&
        ((state.floaters[i].scrollFrom != "bottom" &&
          currPos < state.floaters[i].thresholdBottomAlt &&
          currPos < state.floaters[i].thresholdBottom) ||
          (state.floaters[i].scrollFrom == "bottom" &&
            bottomY < state.floaters[i].thresholdBottom)) &&
        !state.floaters[i].isSticky
      ) {
        $(state.floaters[i].elem).addClass(state.visibleClass);
        if (state.floaters[i].offsetLeft && state.floaters[i].offsetRight) {
          state.floaters[i].elem.style.left = state.floaters[i].offsetLeft;
          state.floaters[i].elem.style.right = state.floaters[i].offsetRight;
        }
      } else if (
        currPos >= state.floaters[i].thresholdTop &&
        state.floaters[i].scrollFrom != "bottom" &&
        currPos < state.floaters[i].thresholdBottomAlt
      ) {
        $(state.floaters[i].elem).addClass(state.visibleClass);
      } else {
        $(state.floaters[i].elem).removeClass(state.visibleClass);
        if (state.floaters[i].elem.getAttribute("data-floaty-parent")) {
          state.floaters[i].elem.style.left = "";
          state.floaters[i].elem.style.right = "";
        }
      }
    }
  };
  setupFloater = function (elem) {
    var $parent;
    if (elem.getAttribute("data-floaty-parent")) {
      $parent = $(elem.getAttribute("data-floaty-parent"));
    }
    if (elem.getAttribute("data-floaty-anchor-position")) {
      var offset =
          $(elem.getAttribute("data-floaty-anchor-position")).offset().top % 1,
        diff = 1 - offset,
        offsetElem = $(elem.getAttribute("data-floaty-anchor-position"))[0];
      if (offsetElem.style.position) {
        var currTop = offsetElem.style.top ? offsetElem.style.top : 0,
          newTop = diff;
        currTop = parseInt(currTop.replace("px", ""));
        newTop += currTop;
        offsetElem.style.top = newTop + "px";
      } else {
        offsetElem.style.position = "relative";
        offsetElem.style.top = diff + "px";
      }
    }
    if ($(elem.getAttribute("data-floaty-start")).length == 0) {
      console.log(
        "FLOATY : ",
        elem,
        " does not have data-floaty-start set correctly"
      );
      return;
    }
    state.floaters.push({
      elem: elem,
      startTop: $(elem).offset().top,
      thresholdTop: $(elem.getAttribute("data-floaty-start")).offset().top,
      thresholdBottom: elem.getAttribute("data-floaty-end")
        ? $(elem.getAttribute("data-floaty-end")).offset().top
        : Infinity,
      thresholdBottomAlt: elem.getAttribute("data-floaty-end-bottom")
        ? Math.max(
            $(elem.getAttribute("data-floaty-end-bottom")).offset().top -
              $(window).height(),
            0
          )
        : Infinity,
      offsetLeft: elem.getAttribute("data-floaty-parent")
        ? $(elem.getAttribute("data-floaty-parent")).offset().left
        : null,
      offsetRight: elem.getAttribute("data-floaty-parent")
        ? Math.floor(
            $(window).width() - ($parent.offset().left + $parent.outerWidth())
          )
        : null,
      scrollFrom: elem.getAttribute("data-floaty-from")
        ? elem.getAttribute("data-floaty-from").toLowerCase()
        : "top",
      stickyEnd: elem.getAttribute("data-floaty-sticky-end")
        ? elem.getAttribute("data-floaty-sticky-end")
        : false,
      stickyEndFrom: elem.getAttribute("data-floaty-sticky-from")
        ? elem.getAttribute("data-floaty-sticky-from")
        : "bottom",
      stickyTop: elem.getAttribute("data-floaty-sticky-top")
        ? $(elem.getAttribute("data-floaty-sticky-top")).offset().top
        : null,
      stickyThreshTop: elem.getAttribute("data-floaty-sticky-thresh")
        ? $(elem.getAttribute("data-floaty-sticky-thresh")).offset().top
        : null,
      stickyOffset: elem.getAttribute("data-floaty-sticky-offset")
        ? elem.getAttribute("data-floaty-sticky-offset")
        : 0,
    });
  };
  recalculateThresholds = function () {
    $(".floaty-bar").removeClass(state.visibleClass);
    for (var i = 0; i < state.floaters.length; ++i) {
      state.floaters[i].startTop = $(state.floaters[i].elem).offset().top;
      if (
        !$(state.floaters[i].elem.getAttribute("data-floaty-start")).toArray()
          .length
      )
        return false;
      state.floaters[i].thresholdTop = $(
        state.floaters[i].elem.getAttribute("data-floaty-start")
      ).offset().top;
      if (state.floaters[i].elem.getAttribute("data-floaty-end")) {
        state.floaters[i].thresholdBottom = $(
          state.floaters[i].elem.getAttribute("data-floaty-end")
        ).offset().top;
      } else {
        state.floaters[i].thresholdBottom = Infinity;
      }
      if (state.floaters[i].elem.getAttribute("data-floaty-end-bottom")) {
        state.floaters[i].thresholdBottomAlt = Math.max(
          $(
            state.floaters[i].elem.getAttribute("data-floaty-end-bottom")
          ).offset().top - $(window).height(),
          0
        );
      } else {
        state.floaters[i].thresholdBottom = Infinity;
      }
      if (state.floaters[i].elem.getAttribute("data-floaty-parent")) {
        var $parent = $(
          state.floaters[i].elem.getAttribute("data-floaty-parent")
        );
        state.floaters[i].offsetLeft = $parent.offset().left + "px";
        state.floaters[i].offsetRight =
          Math.floor(
            $(window).width() - ($parent.offset().left + $parent.outerWidth())
          ) + "px";
      }
      if (state.floaters[i].elem.getAttribute("data-floaty-sticky-thresh")) {
        state.floaters[i].stickyTop = $(
          state.floaters[i].elem.getAttribute("data-floaty-sticky-top")
        ).offset().top;
        state.floaters[i].stickyThreshTop = $(
          state.floaters[i].elem.getAttribute("data-floaty-sticky-thresh")
        ).offset().top;
      }
    }
    decide();
  };
  init = function () {
    var floaties = $(".floaty-bar").toArray();
    for (var i = 0; i < floaties.length; ++i) {
      setupFloater(floaties[i]);
    }
    window.addEventListener("scroll", decide);
    window.onresize = function () {
      delay(recalculateThresholds, 110);
    };
    decide();
  };
  delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  $(d).ready(init);
  pub.swapVisibleClass = function (newClass) {
    state.visibleClass = newClass;
  };
  pub.recalculateThresholds = recalculateThresholds;
  pub.state = state;
  return pub;
})(window, document, window.jQuery || window.HA.dom, {});
(function () {
  var $;
  $ = window.jQuery || window.Zepto || window.$;
  $.fn.fancySelect = function (opts) {
    var isiOS, settings;
    if (opts == null) {
      opts = {};
    }
    settings = $.extend(
      {
        forceiOS: false,
        includeBlank: false,
        optionTemplate: function (optionEl) {
          return optionEl.text();
        },
        triggerTemplate: function (optionEl) {
          return optionEl.text();
        },
      },
      opts
    );
    isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
    return this.each(function () {
      var copyOptionsToList,
        disabled,
        options,
        sel,
        trigger,
        updateTriggerText,
        wrapper;
      var scrollRegistered = false,
        optionSelected = false;
      sel = $(this);
      if (sel.hasClass("fancified") || sel[0].tagName !== "SELECT") {
        return;
      }
      sel.addClass("fancified");
      sel.css({
        width: 1,
        height: 1,
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
      });
      sel.wrap('<div class="fancy-select">');
      wrapper = sel.parent();
      if (sel.data("class")) {
        wrapper.addClass(sel.data("class"));
      }
      wrapper.append('<div class="trigger">');
      if (!(isiOS && !settings.forceiOS)) {
        wrapper.append('<ul class="options">');
      }
      trigger = wrapper.find(".trigger");
      options = wrapper.find(".options");
      disabled = sel.prop("disabled");
      if (disabled) {
        wrapper.addClass("disabled");
      }
      updateTriggerText = function () {
        var triggerHtml;
        triggerHtml = settings.triggerTemplate(sel.find(":selected"));
        return trigger.html(triggerHtml);
      };
      var blurTimer = null;
      sel.on("blur.fs", function () {
        if (trigger.hasClass("open")) {
          window.clearTimeout(blurTimer);
          blurTimer = window.setTimeout(function () {
            if (optionSelected == true || !scrollRegistered) {
              if (optionSelected) optionSelected = false;
              return trigger.trigger("close.fs");
            } else {
              scrollRegistered = false;
              sel.focus();
            }
          }, 300);
        }
      });
      trigger.on("close.fs", function () {
        trigger.removeClass("open");
        return options.removeClass("open");
      });
      trigger.on("click.fs", function () {
        optionSelected = false;
        var offParent, parent;
        if (!disabled) {
          trigger.toggleClass("open");
          if (isiOS && !settings.forceiOS) {
            if (trigger.hasClass("open")) {
              return sel.focus();
            }
          } else {
            if (trigger.hasClass("open")) {
              parent = trigger.parent();
              offParent = parent.offsetParent();
              if (
                parent.offset().top +
                  parent.outerHeight() +
                  options.outerHeight() +
                  20 >
                $(window).height() + $(window).scrollTop()
              ) {
                options.addClass("overflowing");
              } else {
                options.removeClass("overflowing");
              }
            }
            options.toggleClass("open");
            if (!isiOS) {
              return sel.focus();
            }
          }
        }
      });
      sel.on("enable", function () {
        sel.prop("disabled", false);
        wrapper.removeClass("disabled");
        disabled = false;
        return copyOptionsToList();
      });
      sel.on("disable", function () {
        sel.prop("disabled", true);
        wrapper.addClass("disabled");
        return (disabled = true);
      });
      sel.on("change.fs", function (e) {
        if (e.originalEvent && e.originalEvent.isTrusted) {
          return e.stopPropagation();
        } else {
          optionSelected = true;
          return updateTriggerText();
        }
      });
      sel.on("keydown", function (e) {
        var hovered, newHovered, w;
        w = e.which;
        hovered = options.find(".hover");
        hovered.removeClass("hover");
        if (!options.hasClass("open")) {
          if (w === 13 || w === 32 || w === 38 || w === 40) {
            e.preventDefault();
            return trigger.trigger("click.fs");
          }
        } else {
          if (w === 38) {
            e.preventDefault();
            if (hovered.length && hovered.index() > 0) {
              hovered.prev().addClass("hover");
            } else {
              options.find("li:last-child").addClass("hover");
            }
          } else if (w === 40) {
            e.preventDefault();
            if (
              hovered.length &&
              hovered.index() < options.find("li").length - 1
            ) {
              hovered.next().addClass("hover");
            } else {
              options.find("li:first-child").addClass("hover");
            }
          } else if (w === 27) {
            e.preventDefault();
            trigger.trigger("click.fs");
          } else if (w === 13 || w === 32) {
            e.preventDefault();
            hovered.trigger("click.fs");
          } else if (w === 9) {
            if (trigger.hasClass("open")) {
              trigger.trigger("close.fs");
            }
          }
          newHovered = options.find(".hover");
          if (newHovered.length) {
            options.scrollTop(0);
            return options.scrollTop(newHovered.position().top - 12);
          }
        }
      });
      var scrollTimer = null;
      jQuery(options).on("scroll.fs", function (e) {
        window.clearTimeout(scrollTimer);
        scrollRegistered = true;
        scrollTimer = window.setTimeout(function () {
          scrollRegistered = false;
        }, 500);
      });
      options.on("click.fs", "li", function (e) {
        var clicked;
        clicked = $(this);
        sel.val(clicked.data("raw-value"));
        if (!isiOS) {
          sel.trigger("blur.fs").trigger("focus.fs");
        }
        options.find(".selected").removeClass("selected");
        clicked.addClass("selected");
        trigger.addClass("selected");
        return sel
          .val(clicked.data("raw-value"))
          .trigger("change.fs")
          .trigger("blur.fs")
          .trigger("focus.fs");
      });
      options.on("mouseenter.fs", "li", function () {
        var hovered, nowHovered;
        nowHovered = $(this);
        hovered = options.find(".hover");
        hovered.removeClass("hover");
        return nowHovered.addClass("hover");
      });
      options.on("mouseleave.fs", "li", function () {
        return options.find(".hover").removeClass("hover");
      });
      copyOptionsToList = function () {
        var selOpts;
        updateTriggerText();
        if (isiOS && !settings.forceiOS) {
          return;
        }
        selOpts = sel.find("option");
        return sel.find("option").each(function (i, opt) {
          var optHtml;
          opt = $(opt);
          if (!opt.prop("disabled") && (opt.val() || settings.includeBlank)) {
            optHtml = settings.optionTemplate(opt);
            if (opt.prop("selected")) {
              return options.append(
                '<li data-raw-value="' +
                  opt.val() +
                  '" class="selected">' +
                  optHtml +
                  "</li>"
              );
            } else {
              return options.append(
                '<li data-raw-value="' + opt.val() + '">' + optHtml + "</li>"
              );
            }
          }
        });
      };
      sel.on("update.fs", function () {
        wrapper.find(".options").empty();
        return copyOptionsToList();
      });
      return copyOptionsToList();
    });
  };
}).call(this);
$(document).ready(function () {
  $("select.fancySelect").fancySelect();
});
var homepage = (function ($) {
  var cheezburger = $("#cheezBurgerMenu");
  var localProContainer = $(".local-pro-container");
  var toolbarSearch = $("#toolbar-search");
  var toolbarSearchIcon = $("#toolbar-search span");
  var blurContainer =
    $(".ha--blur_container") !== null
      ? $(".ha--blur_container")
      : $(".container-fluid");
  cheezburger.addClass("enabled");
  var showSearchOverlay = function () {
    blurContainer.addClass("overlay-blur");
    toolbarSearchIcon.addClass("icon_x");
    toolbarSearchIcon.removeClass("icon_search");
    localProContainer.addClass("is-hidden");
    var searchOverlay = $(".search-overlay");
    searchOverlay.removeClass("is-hidden");
  };
  var hideSearchOverlay = function () {
    blurContainer.removeClass("overlay-blur");
    toolbarSearchIcon.addClass("icon_search");
    toolbarSearchIcon.removeClass("icon_x");
    localProContainer.removeClass("is-hidden");
    $(".search-overlay").addClass("is-hidden");
  };
  $(".search-overlay .search-submit").on("click", function (e) {
    $(".search-overlay form").first().submit();
  });
  toolbarSearch.on("click", function (e) {
    e.preventDefault();
    toolbarSearch.toggleClass("overlay-visible");
    if (toolbarSearch.hasClass("overlay-visible")) {
      showSearchOverlay();
    } else {
      hideSearchOverlay();
    }
    return false;
  });
  $(document).ready(function () {
    HA.taskSearch.latentSetup();
    HA.taskSearch.collectLatentAutoforwardInputs();
    HA.taskSearch.handleFormSubmission();
  });
  return {
    showSearchOverlay: showSearchOverlay,
    hideSearchOverlay: hideSearchOverlay,
  };
})(window.jQuery || window.HA.dom);
var androidSmartAppBanner = (function (w, d, $, pub) {
  var init = function () {
    var metaLink = grabMetaTagLink();
    var interstitialRendered = false;
    if (typeof w.jsonCtrl == "function") {
      interstitialRendered =
        typeof jsonCtrl().model.preventSmartAppBanner == "undefined"
          ? false
          : jsonCtrl().model.preventSmartAppBanner;
    }
    if (metaLink && metaLink != "" && !interstitialRendered) {
      renderSmartAppBanner(metaLink);
      $(".closeSmartBanner").on("click", closeSmartAppBanner);
    }
  };
  var grabMetaTagLink = function () {
    var metaTags = document.getElementsByTagName("meta");
    for (var i = 0; i < metaTags.length; i++) {
      if (metaTags[i].getAttribute("name") == "android-app") {
        return metaTags[i].getAttribute("content");
      }
    }
    return "";
  };
  var goToPlayStore = function (link) {
    window.location.href = link;
  };
  var renderSmartAppBanner = function (link) {
    var parent = document.getElementById("cheezBurgerMenu"),
      banner = document.createElement("div"),
      leftSec = document.createElement("div"),
      rightSec = document.createElement("div"),
      header = document.createElement("p"),
      hrefLink = document.createElement("span"),
      image = document.createElement("img"),
      stars = document.createElement("div"),
      starsInner = document.createElement("div"),
      headerStars = document.createElement("div"),
      price = document.createElement("p"),
      priceTxt = document.createTextNode("Free - Google Play Store"),
      close = document.createElement("p"),
      closeTxt = document.createTextNode("x"),
      headerText = document.createTextNode("BidAlbania for Android"),
      linkTxt = document.createTextNode("Install"),
      imageLink = "/images/app-download/ha-icon.png";
    banner.setAttribute("class", "androidSmartAppBanner");
    banner.setAttribute("id", "smartAppBanner");
    close.setAttribute("class", "closeSmartBanner");
    price.setAttribute("class", "priceTag");
    leftSec.setAttribute("class", "leftSec");
    rightSec.setAttribute("class", "rightSec");
    stars.setAttribute("class", "t-stars-small");
    starsInner.setAttribute("class", "t-stars-small-inner");
    starsInner.setAttribute("style", "width: 85%;");
    headerStars.setAttribute("class", "headerStars");
    image.setAttribute("src", imageLink);
    image.setAttribute("alt", "BidAlbania");
    hrefLink.addEventListener("click", function () {
      goToPlayStore(link);
    });
    header.appendChild(headerText);
    stars.appendChild(starsInner);
    hrefLink.appendChild(linkTxt);
    price.appendChild(priceTxt);
    close.appendChild(closeTxt);
    headerStars.appendChild(header);
    headerStars.appendChild(price);
    headerStars.appendChild(stars);
    leftSec.appendChild(image);
    leftSec.appendChild(headerStars);
    rightSec.appendChild(hrefLink);
    banner.appendChild(close);
    banner.appendChild(leftSec);
    banner.appendChild(rightSec);
    if (parent) {
      parent.insertBefore(banner, parent.firstChild);
    }
  };
  var closeSmartAppBanner = function () {
    var banner = document.getElementById("smartAppBanner"),
      parent = document.getElementById("cheezBurgerMenu");
    if (parent) {
      parent.removeChild(banner);
    }
  };
  $(d).ready(init);
})(window, document, window.jQuery || HA.dom, {});
var mobileSmartAppBanner = (function (w, d, $, pub) {
  var version, metaLink;
  var init = function () {
    grabMetaTagLink();
    var interstitialRendered = false;
    if (typeof w.jsonCtrl == "function") {
      interstitialRendered =
        typeof jsonCtrl().model.preventSmartAppBanner == "undefined"
          ? false
          : jsonCtrl().model.preventSmartAppBanner;
    }
    if (metaLink && metaLink != "" && !interstitialRendered) {
      renderSmartAppBanner(metaLink, version);
      $(".closeSmartBanner").on("click", closeSmartAppBanner);
    }
  };
  var grabMetaTagLink = function () {
    var metaTags = document.getElementsByTagName("meta");
    for (var i = 0; i < metaTags.length; i++) {
      if (
        metaTags[i].getAttribute("name") == "mobile-app:orng" ||
        metaTags[i].getAttribute("name") == "mobile-app:trip"
      ) {
        metaLink = metaTags[i].getAttribute("content");
        version = metaTags[i].getAttribute("name").split(":")[1];
      }
    }
    return "";
  };
  var gotoAppStore = function (link) {
    window.location.href = link;
  };
  var renderSmartAppBanner = function (link, version) {
    var parent = document.getElementById("cheezBurgerMenu"),
      banner = document.createElement("div"),
      leftSec = document.createElement("div"),
      rightSec = document.createElement("div"),
      header = document.createElement("p"),
      installLink = document.createElement("span"),
      openLink = document.createElement("span"),
      image = document.createElement("img"),
      stars = document.createElement("div"),
      starsInner = document.createElement("div"),
      headerStars = document.createElement("div"),
      close = document.createElement("p"),
      closeTxt = document.createTextNode("x"),
      headerText,
      linkTxt = document.createTextNode("Install"),
      openLinkTxt = document.createTextNode("Open In App"),
      imageLink = "/images/app-download/ha-icon.png",
      device = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "iOS" : "Android";
    if (version == "orng") {
      headerText = document.createTextNode(
        "Compare pros, see pricing & book appointments."
      );
    } else {
      headerText = document.createTextNode("HomeAdvisor for " + device);
    }
    banner.setAttribute("class", "mobileSmartAppBanner " + version);
    banner.setAttribute("id", "smartAppBanner");
    close.setAttribute("class", "closeSmartBanner");
    leftSec.setAttribute("class", "leftSec");
    rightSec.setAttribute("class", "rightSec");
    stars.setAttribute("class", "t-stars-small");
    starsInner.setAttribute("class", "t-stars-small-inner");
    starsInner.setAttribute("style", "width: 100%;");
    headerStars.setAttribute("class", "headerStars");
    image.setAttribute("src", imageLink);
    image.setAttribute("alt", "HomeAdvisor");
    installLink.setAttribute("class", "btn install");
    openLink.setAttribute("class", "btn open");
    installLink.addEventListener("click", function () {
      gotoAppStore(link);
    });
    openLink.addEventListener("click", function () {
      gotoAppStore(link);
    });
    if (version == "trip") {
      close.appendChild(closeTxt);
      header.appendChild(headerText);
      stars.appendChild(starsInner);
      headerStars.appendChild(header);
      headerStars.appendChild(stars);
      openLink.appendChild(openLinkTxt);
      installLink.appendChild(linkTxt);
      leftSec.appendChild(image);
      rightSec.appendChild(headerStars);
      rightSec.appendChild(openLink);
      rightSec.appendChild(installLink);
      banner.appendChild(close);
      banner.appendChild(leftSec);
      banner.appendChild(rightSec);
    } else if (version == "orng") {
      close.appendChild(closeTxt);
      header.appendChild(headerText);
      stars.appendChild(starsInner);
      headerStars.appendChild(header);
      installLink.appendChild(linkTxt);
      leftSec.appendChild(image);
      leftSec.appendChild(headerStars);
      rightSec.appendChild(installLink);
      banner.appendChild(close);
      banner.appendChild(leftSec);
      banner.appendChild(rightSec);
    }
    if (parent) {
      parent.insertBefore(banner, parent.firstChild);
    }
  };
  var closeSmartAppBanner = function () {
    var banner = document.getElementById("smartAppBanner"),
      parent = banner.parentNode;
    if (parent) {
      parent.removeChild(banner);
    }
  };
  $(d).ready(init);
})(window, document, window.jQuery || HA.dom, {});
(function (w, d, $) {
  modules = {};
  var header = { menuTimer: null };
  $(d).ready(function () {
    $(".header-nav-item.has-sub-menu").on("mouseenter", function () {
      var menuItem = this;
      header.menuTimer = setTimeout(function () {
        $(menuItem).addClass("hover");
        header.menuTimer = null;
      }, 150);
    });
    $(".header-nav-item.has-sub-menu:not(.hover)").on(
      "mouseleave",
      function () {
        if (header.menuTimer !== null) {
          clearTimeout(header.menuTimer);
          header.menuTimer = null;
        }
      }
    );
    $(".header-nav-item").on("mouseleave", function () {
      $(this).removeClass("hover");
    });
    $(".header-nav-main-video-link").on("click", function (event) {
      window.open(
        "/rfs/popup/consumerVideosPopup.jsp",
        "popWin",
        "width=830,height=470,toolbar=no,scrollbars=yes,resizable=yes"
      );
      event.preventDefault();
    });
  });
})(window, document, window.jQuery || HA.dom);
(function (d, $) {
  $(d).ready(function () {
    var focusable = document.querySelector("[data-autofocus]");
    if (focusable) {
      if (
        focusable.getAttribute("data-autofocus") == "unless-hash" &&
        location.hash != ""
      ) {
        return;
      }
      if (focusable) focusable.focus();
    }
  });
})(document, HA.dom);
var globalOmni = (function (d, w, $, pub) {
  var init = function () {
    collectTrackedModules();
    handleTorsOneOffMutatorQuestion();
  };
  var handleSiteSearchEvent = function (e) {
    var searchInput = this.query;
    if (searchInput.value) {
      s_sm.fireSearch(searchInput.value);
    }
  };
  var handleTorsOneOffMutatorQuestion = function (e) {
    var el = d.getElementById("question-container-502713"),
      radio = d.getElementById("id_502713_10001");
    if (el) {
      trackLinkWrapper(true, "o", "Financing Question Displayed");
      if (radio) {
        $(radio).on("click", function (e) {
          trackLinkWrapper(true, "o", "Financing Question Selected");
        });
      }
    }
  };
  var collectTrackedModules = function () {
    var autoModules = $("[data-omni-module]").toArray();
    for (var i = 0; i < autoModules.length; ++i) {
      var name = autoModules[i].getAttribute("data-omni-module"),
        prefix =
          autoModules[i].getAttribute("data-omni-module-prefix") || "Module:";
      autoModules[i].setAttribute("data-omniture-module", name);
      if (
        typeof window.s_sm != "undefined" &&
        typeof s_sm.customLinkTrackingModule != "undefined"
      ) {
        s_sm.customLinkTrackingModule(
          prefix,
          name,
          '[data-omniture-module="' + name + '"]',
          true
        );
      }
    }
  };
  var customLinkTracking = function () {
    var type = this.getAttribute("data-track-omni-type") || "o";
    trackLinkWrapper(true, type, this.getAttribute("data-track-omni"));
  };
  var customEventTracking = function (e) {
    var ev = this.getAttribute("data-track-omni-event");
    var text = this.getAttribute("data-track-omni-text");
    if (ev && text) {
      s_sm.fireSimpleEvent(ev, text);
    }
  };
  $(d)
    .on("click", "[data-track-omni]", customLinkTracking)
    .on("click", "[data-track-omni-event]", customEventTracking)
    .on("submit", "[data-track-omni-search]", handleSiteSearchEvent)
    .ready(init);
  return pub;
})(document, window, window.jQuery || HA.dom, {});
(function (d, $) {
  var interactionTypes = { CONVERSION: "Conversion", ENGAGEMENT: "Engagement" };
  $(d).ready(function () {
    $("#most-popular-projects a").on("click", function () {
      handleClickEvent("Popular Projects", $(this));
    });
    $("#seasonal-projects a").on("click", function () {
      handleClickEvent("Seasonal Projects", $(this));
    });
    function handleClickEvent(category, element) {
      var link = null;
      if (element.hasClass("round-category-item")) {
        link = element.parent().find("a.category-title").first();
      } else {
        link = element.first();
      }
      if (!link) return;
      var title = link.textContent.trim();
      triggerMerchandisingOMNIEvents(title, category);
    }
    var triggerMerchandisingOMNIEvents = function (title, placement) {
      var addlVars = [
        { eVarName: "eVar139", value: title },
        { eVarName: "eVar99", value: window.s_sm.pageName },
      ];
      s_sm.fireSimpleEvent(
        "event339",
        "Home Page - Merchandising " + placement + " Click",
        addlVars
      );
    };
    function configureMoreProjectsBannerEventTracking() {
      var elemTypes = { ICON: "Icon", LINK: "Link", CTA: "CTA" };
      var bannerTitle = "More Projects Banner";
      var banner = document.querySelector(
        ".ha--projects_rebrand_container.more-projects"
      );
      if (!banner) return;
      function itemCallback(elemType, category, rank) {
        return function () {
          triggerMerchandisingOMNIEvent({
            interactionType: interactionTypes.CONVERSION,
            componentName: bannerTitle,
            superCategory: elemType,
            category: category,
            rank: rank,
          });
        };
      }
      var roundItems = banner.getElementsByClassName("round-item");
      var textItems = banner.getElementsByClassName("text-item");
      var ctaItem = banner.querySelector("a.t-button-flat");
      for (var i = 0; i < roundItems.length; i++) {
        var roundItem = roundItems[i];
        var roundTag = roundItem.querySelector("a.round-category-item");
        var titleTag = roundItem.querySelector("a.category-title");
        var category = titleTag.innerText;
        roundTag.addEventListener(
          "click",
          itemCallback(elemTypes.ICON, category, i + 1)
        );
        titleTag.addEventListener(
          "click",
          itemCallback(elemTypes.ICON, category, i + 1)
        );
      }
      for (var i = 0; i < textItems.length; i++) {
        var textItem = textItems[i];
        var textTag = textItem.querySelector("a");
        var category = textTag.innerText;
        textTag.addEventListener(
          "click",
          itemCallback(elemTypes.LINK, category, i + 1)
        );
      }
      ctaItem.addEventListener("click", function () {
        triggerMerchandisingOMNIEvent({
          interactionType: interactionTypes.ENGAGEMENT,
          componentName: bannerTitle,
          superCategory: elemTypes.CTA,
        });
      });
    }
    function configureFixedPriceBannerTracking() {
      var button = document.querySelector(
        "div.fixed-price-cta a.t-button-flat"
      );
      var bannerTitle = "Fixed Price Banner";
      if (!button) return;
      button.addEventListener("click", function () {
        triggerMerchandisingOMNIEvent({
          interactionType: interactionTypes.CONVERSION,
          componentName: bannerTitle,
        });
      });
    }
    function trackIconGridBanner(bannerElement, bannerTitle) {
      if (!bannerElement) return;
      var elemTypes = { ICON: "Icon", LINK: "Link", CTA: "CTA" };
      function itemCallback(elemType, category, rank) {
        return function () {
          triggerMerchandisingOMNIEvent({
            interactionType: interactionTypes.CONVERSION,
            componentName: bannerTitle,
            superCategory: elemType,
            category: category,
            rank: rank,
          });
        };
      }
      function addListenersForComponent(containerElement, elemType) {
        if (elemType === elemTypes.ICON) {
          var iconItems =
            containerElement.getElementsByClassName("icon-banner-cell");
          for (var i = 0; i < iconItems.length; i++) {
            var iconItem = iconItems[i];
            var category = iconItem.querySelector("div").innerText;
            iconItem.addEventListener(
              "click",
              itemCallback(elemTypes.ICON, category, i + 1)
            );
          }
        }
        if (elemType === elemTypes.LINK) {
          var linkItems = containerElement.querySelectorAll(
            ".category-banner-links a"
          );
          for (var i = 0; i < linkItems.length; i++) {
            var linkItem = linkItems[i];
            var category = linkItem.innerText;
            linkItem.addEventListener(
              "click",
              itemCallback(elemTypes.LINK, category, i + 1)
            );
          }
        }
        if (elemType === elemTypes.CTA) {
          var ctaItems = containerElement.getElementsByClassName(
            "category-banner-cta"
          );
          for (var i = 0; i < ctaItems.length; i++) {
            var ctaItem = ctaItems[i];
            ctaItem.addEventListener("click", function () {
              triggerMerchandisingOMNIEvent({
                interactionType: interactionTypes.ENGAGEMENT,
                componentName: bannerTitle,
                superCategory: elemTypes.CTA,
              });
            });
          }
        }
      }
      var desktopGrid = bannerElement.querySelector(
        ".icon-banner-grid.icon-banner-grid-desktop"
      );
      var desktopLinks = bannerElement.querySelector(
        ".category-banner-links.icon-banner-grid-desktop"
      );
      var tabletGrid = bannerElement.querySelector(
        ".icon-banner-grid.icon-banner-grid-tablet"
      );
      var tabletLinks = bannerElement.querySelector(
        ".category-banner-links.icon-banner-grid-tablet"
      );
      var mobileGrid = bannerElement.querySelector(
        ".icon-banner-grid.icon-banner-grid-mobile"
      );
      var mobileLinks = bannerElement.querySelector(
        ".category-banner-links.icon-banner-grid-mobile"
      );
      addListenersForComponent(desktopGrid, elemTypes.ICON);
      addListenersForComponent(desktopLinks, elemTypes.LINK);
      addListenersForComponent(tabletGrid, elemTypes.ICON);
      addListenersForComponent(tabletLinks, elemTypes.LINK);
      addListenersForComponent(mobileGrid, elemTypes.ICON);
      addListenersForComponent(mobileLinks, elemTypes.LINK);
      addListenersForComponent(bannerElement, elemTypes.CTA);
    }
    function configureIconGridBannerEventTracking() {
      var banner;
      var bannerTitle;
      banner = document.querySelector(
        "#most-popular-projects.icon-category-banner"
      );
      bannerTitle = "Most Popular Projects Banner";
      trackIconGridBanner(banner, bannerTitle);
      banner = document.querySelector(
        "#seasonal-projects.icon-category-banner"
      );
      bannerTitle = "Seasonal Projects Banner";
      trackIconGridBanner(banner, bannerTitle);
      banner = document.querySelector("#more-projects.icon-category-banner");
      bannerTitle = "More Projects Banner";
      trackIconGridBanner(banner, bannerTitle);
    }
    function configureMultiCategoryBannerEventTracking() {
      var banner = document.getElementsByClassName("multi-category-banner")[0];
      if (!banner) return;
      var bannerTitle = banner.dataset.analyticsName
        ? banner.dataset.analyticsName
        : "Filter category banner";
      var desktopCta = banner.querySelector(".category-filters-cta");
      var mobileCta = banner.querySelector(".category-filters-cta-mobile");
      desktopCta.addEventListener("click", function () {
        triggerMerchandisingOMNIEvent({
          interactionType: interactionTypes.ENGAGEMENT,
          componentName: bannerTitle,
          superCategory: "View All CTA",
        });
      });
      mobileCta.addEventListener("click", function () {
        triggerMerchandisingOMNIEvent({
          interactionType: interactionTypes.ENGAGEMENT,
          componentName: bannerTitle,
          superCategory: "View All CTA",
        });
      });
      var filterPills = banner.getElementsByClassName("category-filter-pill");
      for (var i = 0; i < filterPills.length; i++) {
        var pill = filterPills[i];
        pill.addEventListener(
          "click",
          (function (elem, rank) {
            return function () {
              triggerMerchandisingOMNIEvent({
                interactionType: interactionTypes.ENGAGEMENT,
                componentName: bannerTitle,
                superCategory: elem.innerText,
                rank: rank,
              });
            };
          })(pill, i + 1)
        );
      }
      banner
        .getElementsByClassName("category-scroll-left-control")[0]
        .addEventListener("click", function () {
          triggerMerchandisingOMNIEvent({
            interactionType: interactionTypes.ENGAGEMENT,
            componentName: bannerTitle,
            superCategory: "Left Scroll Button",
          });
        });
      banner
        .getElementsByClassName("category-scroll-right-control")[0]
        .addEventListener("click", function () {
          triggerMerchandisingOMNIEvent({
            interactionType: interactionTypes.ENGAGEMENT,
            componentName: bannerTitle,
            superCategory: "Right Scroll Button",
          });
        });
      var services = Array.prototype.slice.call(
        banner.getElementsByClassName("filter-category-item")
      );
      services.sort(function (a, b) {
        var aFilterName = a.dataset.filterName.toUpperCase();
        var bFiltername = b.dataset.filterName.toUpperCase();
        if (aFilterName < bFiltername) return -1;
        if (aFilterName > bFiltername) return 1;
        return 0;
      });
      var currServiceInd = 1;
      var currServiceName = services[0].dataset.filterName;
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var filterName = service.dataset.filterName;
        if (currServiceName !== filterName) {
          currServiceInd = 1;
          currServiceName = filterName;
        }
        service.addEventListener(
          "click",
          (function (superCategory, category, rank) {
            return function () {
              triggerMerchandisingOMNIEvent({
                interactionType: interactionTypes.CONVERSION,
                componentName: bannerTitle,
                superCategory: superCategory,
                category: category,
                rank: rank,
              });
            };
          })(filterName, service.innerText, currServiceInd)
        );
        currServiceInd++;
      }
    }
    var triggerMerchandisingOMNIEvent = function (eventDetails) {
      var interactionType = eventDetails.interactionType;
      var componentName = eventDetails.componentName;
      var category = eventDetails.category;
      var superCategory = eventDetails.superCategory;
      var rank = eventDetails.rank;
      var positive = eventDetails.positive;
      var addlVars = [{ eVarName: "eVar99", value: window.s_sm.pageName }];
      if (category) {
        addlVars.push({ eVarName: "eVar139", value: category });
      }
      if (superCategory) {
        addlVars.push({ eVarName: "eVar140", value: superCategory });
      }
      if (rank) {
        addlVars.push({ eVarName: "eVar141", value: rank });
      }
      var postiveString = positive === false ? "Close" : "Click";
      s_sm.fireSimpleEvent(
        "event339",
        "Merchandising " +
          interactionType +
          " Home Page - " +
          componentName +
          " " +
          postiveString,
        addlVars
      );
    };
    configureFixedPriceBannerTracking();
    configureMoreProjectsBannerEventTracking();
    configureMultiCategoryBannerEventTracking();
    configureIconGridBannerEventTracking();
  });
})(document, HA.dom || jQuery);
HA = window.HA || {};
HA.categoryFiltering = (function (w, d, $) {
  var filterBannerClassName = "multi-category-banner";
  var selectedPillClassName = "selected";
  var filterPillClassName = "category-filter-pill";
  function addClass(element, className) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }
  function removeClass(element, className) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
  function getMaxLeftScroll(element) {
    return element.scrollWidth - element.clientWidth;
  }
  function deselectPills(filterPills) {
    for (var i = 0; i < filterPills.length; i++) {
      removeClass(filterPills[i], selectedPillClassName);
    }
  }
  function hideExtraFilters(filterPills, maxShown) {
    maxShown = Math.min(maxShown, filterPills.length);
    var count = 0;
    for (var i = 0; i < filterPills.length; i++) {
      if (count >= maxShown) {
        filterPills[i].style.display = "none";
      }
      if (count === maxShown - 1) {
        addClass(filterPills[i], "category-filter-pill-last");
      }
      count++;
    }
  }
  function showSelectedResults(
    selectedFilterName,
    allPotentialResults,
    defaultResultDisplayStyle,
    maxShown
  ) {
    var selectedResults = Array.prototype.filter.call(
      allPotentialResults,
      function (potentialResult) {
        return potentialResult.dataset.filterName === selectedFilterName;
      }
    );
    var numToShow = Math.min(selectedResults.length, maxShown);
    var numShown = 0;
    var potentialResult;
    for (var i = 0; i < allPotentialResults.length; i++) {
      potentialResult = allPotentialResults[i];
      if (
        potentialResult.dataset.filterName === selectedFilterName &&
        numShown < numToShow
      ) {
        potentialResult.style.display = defaultResultDisplayStyle;
        if (potentialResult && potentialResult.dataset.backgroundUrl) {
          var backgroundUrl = potentialResult.dataset.backgroundUrl;
          potentialResult.style.backgroundImage = "url(" + backgroundUrl + ")";
        }
        if (numShown === numToShow - 1) {
          addClass(potentialResult, "filter-category-item-last");
        } else {
          removeClass(potentialResult, "filter-category-item-last");
        }
        numShown++;
      } else {
        potentialResult.style.display = "none";
        removeClass(potentialResult, "filter-category-item-last");
      }
    }
  }
  function setArrowControlStyles(sideScrollableElement, leftArrow, rightArrow) {
    var simpleHideClassName = "control-quick-hide";
    var hideClassName = "control-hidden";
    var visibleClassName = "control-visible";
    if (sideScrollableElement.scrollLeft > 0) {
      removeClass(leftArrow, simpleHideClassName);
      removeClass(leftArrow, hideClassName);
      addClass(leftArrow, visibleClassName);
    } else {
      removeClass(leftArrow, visibleClassName);
      addClass(leftArrow, hideClassName);
    }
    var maxLeftScroll = getMaxLeftScroll(sideScrollableElement);
    if (sideScrollableElement.scrollLeft < maxLeftScroll) {
      removeClass(rightArrow, simpleHideClassName);
      removeClass(rightArrow, hideClassName);
      addClass(rightArrow, visibleClassName);
    } else {
      removeClass(rightArrow, visibleClassName);
      addClass(rightArrow, hideClassName);
    }
  }
  function configureArrowControls(bannerElement) {
    var scrollAmount = 600;
    var shownServicesList = bannerElement.getElementsByClassName(
      "filter-category-list"
    )[0];
    var leftButton = bannerElement.getElementsByClassName(
      "category-scroll-left-control"
    )[0];
    var rightButton = bannerElement.getElementsByClassName(
      "category-scroll-right-control"
    )[0];
    setArrowControlStyles(shownServicesList, leftButton, rightButton);
    leftButton.addEventListener("click", function () {
      shownServicesList.scrollBy({
        left: -1 * scrollAmount,
        behavior: "smooth",
      });
      setArrowControlStyles(shownServicesList, leftButton, rightButton);
    });
    rightButton.addEventListener("click", function () {
      shownServicesList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setArrowControlStyles(shownServicesList, leftButton, rightButton);
    });
    shownServicesList.addEventListener("scroll", function () {
      setArrowControlStyles(shownServicesList, leftButton, rightButton);
    });
    return function () {
      setArrowControlStyles(shownServicesList, leftButton, rightButton);
    };
  }
  function handleFilterGradientDisplay(filterList, gradient) {
    var maxLeftScroll = getMaxLeftScroll(filterList);
    if (filterList.scrollLeft >= maxLeftScroll) {
      gradient.style.display = "none";
    } else {
      gradient.style.display = "block";
    }
  }
  function configureFilterGradient(bannerElement) {
    var filterList = bannerElement.querySelector(".category-filters");
    var gradient = bannerElement.querySelector(".category-filters-gradient");
    filterList.addEventListener("scroll", function () {
      handleFilterGradientDisplay(filterList, gradient);
    });
    w.addEventListener("resize", function () {
      handleFilterGradientDisplay(filterList, gradient);
    });
    handleFilterGradientDisplay(filterList, gradient);
  }
  function configureBanner(bannerElement) {
    var maxResultsToDisplay = bannerElement.dataset.maxShownResults
      ? Number(bannerElement.dataset.maxShownResults)
      : 8;
    var maxFiltersToDisplay = bannerElement.dataset.maxShownFilters
      ? Number(bannerElement.dataset.maxShownFilters)
      : 8;
    var filterPills = bannerElement.getElementsByClassName(filterPillClassName);
    if (filterPills.length === 0) return;
    hideExtraFilters(filterPills, maxFiltersToDisplay);
    var selectedFilterName = filterPills[0].dataset.filterName;
    filterPills[0].classList.add(selectedPillClassName);
    var allPotentialResults = bannerElement.getElementsByClassName(
      "filter-category-item"
    );
    if (allPotentialResults.length === 0) return;
    var defaultResultDisplayStyle = allPotentialResults[0].style.display;
    showSelectedResults(
      selectedFilterName,
      allPotentialResults,
      defaultResultDisplayStyle,
      maxResultsToDisplay
    );
    var setControlStyles = configureArrowControls(bannerElement);
    configureFilterGradient(bannerElement);
    var filterPill;
    for (var i = 0; i < filterPills.length; i++) {
      filterPill = filterPills[i];
      filterPill.addEventListener("click", function (e) {
        if (e.target.classList.contains(selectedPillClassName)) return;
        deselectPills(filterPills);
        selectedFilterName = e.target.dataset.filterName;
        e.target.classList.add(selectedPillClassName);
        showSelectedResults(
          selectedFilterName,
          allPotentialResults,
          defaultResultDisplayStyle,
          maxResultsToDisplay
        );
        setControlStyles();
      });
    }
  }
  function init() {
    var categoryBanners = d.getElementsByClassName(filterBannerClassName);
    for (var i = 0; i < categoryBanners.length; i++) {
      configureBanner(categoryBanners[i]);
    }
  }
  $(d).ready(init);
})(window, document, HA.dom || jQuery);
HA = window.HA || {};
HA.taskRecommendations = (function (w, d, $, pub) {
  function closeDropdown() {
    var iconBannerDropdown = document.querySelector(".icon-banner-dropdown");
    var caret = document.querySelector(".icon-banner-caret");
    iconBannerDropdown.classList.remove("fade-in-dropdown");
    iconBannerDropdown.classList.add("fade-out-dropdown");
    caret.style.transform = "rotate(90deg)";
    setTimeout(function () {
      iconBannerDropdown.style.display = "none";
    }, 300);
  }
  function openDropdown() {
    setTimeout(function () {
      var iconBannerDropdown = document.querySelector(".icon-banner-dropdown");
      var caret = document.querySelector(".icon-banner-caret");
      iconBannerDropdown.classList.remove("fade-out-dropdown");
      iconBannerDropdown.classList.add("fade-in-dropdown");
      iconBannerDropdown.style.display = "block";
      caret.style.transform = "rotate(270deg)";
    }, 500);
  }
  function toggleDropdown() {
    var iconBannerDropdown = document.querySelector(".icon-banner-dropdown");
    iconBannerDropdown.style.display =
      iconBannerDropdown.style.display === "none"
        ? openDropdown()
        : closeDropdown();
  }
  function isValidUSZip(zipCode) {
    var regEx = new RegExp("^[0-9]{5}$|^[A-Z][0-9][A-Z]$");
    return regEx.test(zipCode) && zipCode !== "";
  }
  function enableButton() {
    var refreshZipButton = document.querySelector(".refresh-zip-button");
    refreshZipButton.classList.add("button-enabled");
    refreshZipButton.disabled = false;
  }
  function validateZip(zipCode) {
    var refreshZipButton = document.querySelector(".refresh-zip-button");
    var inputContainer = document.querySelector(".zip-input");
    var errorMessage = document.querySelector(".zip-error-message");
    if (!isValidUSZip(zipCode)) {
      inputContainer.classList.add("t-error-field");
      errorMessage.classList.add("zip-error-message-active");
      refreshZipButton.classList.add("error");
      refreshZipButton.disabled = true;
    } else {
      inputContainer.classList.remove("t-error-field");
      errorMessage.classList.remove("zip-error-message-active");
      refreshZipButton.classList.remove("error");
      refreshZipButton.disabled = false;
    }
  }
  function handleZipSubmit() {
    var zipCode = document.getElementById("recommendedCatTaskZipInput").value;
    validateZip(zipCode);
    if (isValidUSZip(zipCode)) {
      var request = { zipCode: zipCode };
      personalizedIconBannerRefresh(request, function (err, response) {
        if (response) {
          var newHtml = new DOMParser().parseFromString(response, "text/html")
            .body.childNodes[0];
          var iconBanner = document.getElementById("more-projects");
          if (iconBanner && newHtml && newHtml.textContent !== "null") {
            iconBanner.parentNode.replaceChild(newHtml, iconBanner);
            init();
          }
        }
      });
    }
  }
  function init() {
    var iconBannerDropdown = document.querySelector(".icon-banner-dropdown");
    var caret = document.querySelector(".icon-banner-caret");
    var siteWrapper = document.querySelector(".site-wrapper");
    var iconBannerCityName = document.querySelector(
      ".icon-banner-header-front-clickable"
    );
    var refreshZipButton = document.querySelector(".refresh-zip-button");
    var inputContainer = document.querySelector(".zip-input");
    if (iconBannerDropdown) {
      iconBannerDropdown.style.display = "none";
      caret.style.transform = "rotate(90deg)";
      document.onkeyup = function (e) {
        e = e || window.event;
        if (e.keyCode == 27) {
          closeDropdown();
        }
      };
      iconBannerDropdown.onkeyup = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) {
          handleZipSubmit();
        }
      };
      iconBannerDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      if (siteWrapper) {
        siteWrapper.addEventListener("click", closeDropdown);
      }
      if (iconBannerCityName) {
        iconBannerCityName.addEventListener("click", toggleDropdown);
      }
      if (refreshZipButton) {
        refreshZipButton.addEventListener("click", handleZipSubmit);
        refreshZipButton.disabled = true;
      }
      if (inputContainer) {
        inputContainer.addEventListener("focus", enableButton);
      }
    }
  }
  function personalizedIconBannerRefresh(request, cb) {
    var opts = {
      url: "/sm/task-merchandising",
      name: "task_merchandising",
      dataType: "html",
      params: { zipCode: encodeURIComponent(request.zipCode) },
      headers: { Accept: "text/html;charset=UTF-8" },
      cache: true,
    };
    pub.performRequest(opts, cb);
  }
  $(d).ready(init);
})(window, document, HA.dom || jQuery, HA.services);
!(function () {
  "use strict";
  function o() {
    var o = window,
      t = document;
    if (
      !(
        "scrollBehavior" in t.documentElement.style &&
        !0 !== o.__forceSmoothScrollPolyfill__
      )
    ) {
      var l,
        e = o.HTMLElement || o.Element,
        r = 468,
        i = {
          scroll: o.scroll || o.scrollTo,
          scrollBy: o.scrollBy,
          elementScroll: e.prototype.scroll || n,
          scrollIntoView: e.prototype.scrollIntoView,
        },
        s =
          o.performance && o.performance.now
            ? o.performance.now.bind(o.performance)
            : Date.now,
        c =
          ((l = o.navigator.userAgent),
          new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(l) ? 1 : 0);
      (o.scroll = o.scrollTo =
        function () {
          void 0 !== arguments[0] &&
            (!0 !== f(arguments[0])
              ? h.call(
                  o,
                  t.body,
                  void 0 !== arguments[0].left
                    ? ~~arguments[0].left
                    : o.scrollX || o.pageXOffset,
                  void 0 !== arguments[0].top
                    ? ~~arguments[0].top
                    : o.scrollY || o.pageYOffset
                )
              : i.scroll.call(
                  o,
                  void 0 !== arguments[0].left
                    ? arguments[0].left
                    : "object" != typeof arguments[0]
                    ? arguments[0]
                    : o.scrollX || o.pageXOffset,
                  void 0 !== arguments[0].top
                    ? arguments[0].top
                    : void 0 !== arguments[1]
                    ? arguments[1]
                    : o.scrollY || o.pageYOffset
                ));
        }),
        (o.scrollBy = function () {
          void 0 !== arguments[0] &&
            (f(arguments[0])
              ? i.scrollBy.call(
                  o,
                  void 0 !== arguments[0].left
                    ? arguments[0].left
                    : "object" != typeof arguments[0]
                    ? arguments[0]
                    : 0,
                  void 0 !== arguments[0].top
                    ? arguments[0].top
                    : void 0 !== arguments[1]
                    ? arguments[1]
                    : 0
                )
              : h.call(
                  o,
                  t.body,
                  ~~arguments[0].left + (o.scrollX || o.pageXOffset),
                  ~~arguments[0].top + (o.scrollY || o.pageYOffset)
                ));
        }),
        (e.prototype.scroll = e.prototype.scrollTo =
          function () {
            if (void 0 !== arguments[0])
              if (!0 !== f(arguments[0])) {
                var o = arguments[0].left,
                  t = arguments[0].top;
                h.call(
                  this,
                  this,
                  void 0 === o ? this.scrollLeft : ~~o,
                  void 0 === t ? this.scrollTop : ~~t
                );
              } else {
                if ("number" == typeof arguments[0] && void 0 === arguments[1])
                  throw new SyntaxError("Value could not be converted");
                i.elementScroll.call(
                  this,
                  void 0 !== arguments[0].left
                    ? ~~arguments[0].left
                    : "object" != typeof arguments[0]
                    ? ~~arguments[0]
                    : this.scrollLeft,
                  void 0 !== arguments[0].top
                    ? ~~arguments[0].top
                    : void 0 !== arguments[1]
                    ? ~~arguments[1]
                    : this.scrollTop
                );
              }
          }),
        (e.prototype.scrollBy = function () {
          void 0 !== arguments[0] &&
            (!0 !== f(arguments[0])
              ? this.scroll({
                  left: ~~arguments[0].left + this.scrollLeft,
                  top: ~~arguments[0].top + this.scrollTop,
                  behavior: arguments[0].behavior,
                })
              : i.elementScroll.call(
                  this,
                  void 0 !== arguments[0].left
                    ? ~~arguments[0].left + this.scrollLeft
                    : ~~arguments[0] + this.scrollLeft,
                  void 0 !== arguments[0].top
                    ? ~~arguments[0].top + this.scrollTop
                    : ~~arguments[1] + this.scrollTop
                ));
        }),
        (e.prototype.scrollIntoView = function () {
          if (!0 !== f(arguments[0])) {
            var l = (function (o) {
                for (
                  ;
                  o !== t.body &&
                  !1 ===
                    ((e = p((l = o), "Y") && a(l, "Y")),
                    (r = p(l, "X") && a(l, "X")),
                    e || r);

                )
                  o = o.parentNode || o.host;
                var l, e, r;
                return o;
              })(this),
              e = l.getBoundingClientRect(),
              r = this.getBoundingClientRect();
            l !== t.body
              ? (h.call(
                  this,
                  l,
                  l.scrollLeft + r.left - e.left,
                  l.scrollTop + r.top - e.top
                ),
                "fixed" !== o.getComputedStyle(l).position &&
                  o.scrollBy({ left: e.left, top: e.top, behavior: "smooth" }))
              : o.scrollBy({ left: r.left, top: r.top, behavior: "smooth" });
          } else
            i.scrollIntoView.call(
              this,
              void 0 === arguments[0] || arguments[0]
            );
        });
    }
    function n(o, t) {
      (this.scrollLeft = o), (this.scrollTop = t);
    }
    function f(o) {
      if (
        null === o ||
        "object" != typeof o ||
        void 0 === o.behavior ||
        "auto" === o.behavior ||
        "instant" === o.behavior
      )
        return !0;
      if ("object" == typeof o && "smooth" === o.behavior) return !1;
      throw new TypeError(
        "behavior member of ScrollOptions " +
          o.behavior +
          " is not a valid value for enumeration ScrollBehavior."
      );
    }
    function p(o, t) {
      return "Y" === t
        ? o.clientHeight + c < o.scrollHeight
        : "X" === t
        ? o.clientWidth + c < o.scrollWidth
        : void 0;
    }
    function a(t, l) {
      var e = o.getComputedStyle(t, null)["overflow" + l];
      return "auto" === e || "scroll" === e;
    }
    function d(t) {
      var l,
        e,
        i,
        c,
        n = (s() - t.startTime) / r;
      (c = n = n > 1 ? 1 : n),
        (l = 0.5 * (1 - Math.cos(Math.PI * c))),
        (e = t.startX + (t.x - t.startX) * l),
        (i = t.startY + (t.y - t.startY) * l),
        t.method.call(t.scrollable, e, i),
        (e === t.x && i === t.y) || o.requestAnimationFrame(d.bind(o, t));
    }
    function h(l, e, r) {
      var c,
        f,
        p,
        a,
        h = s();
      l === t.body
        ? ((c = o),
          (f = o.scrollX || o.pageXOffset),
          (p = o.scrollY || o.pageYOffset),
          (a = i.scroll))
        : ((c = l), (f = l.scrollLeft), (p = l.scrollTop), (a = n)),
        d({
          scrollable: c,
          method: a,
          startTime: h,
          startX: f,
          startY: p,
          x: e,
          y: r,
        });
    }
  }
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = { polyfill: o })
    : o();
})();
