// ==UserScript==
// @name         水视频2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Su29029
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        *://mooc1-3.chaoxing.com/mycourse/studentstudy?chapterId=*&courseId=204821868&clazzid=9561385&enc=*
// @grant        none
// ==/UserScript==

(function() {

    //核心思路：伪造Ajax请求，完全模拟鼠标点击事件。


    //1.关于选择某一节课：将输入转化为courseId，通过特定的courseId发送请求
    //2.关于自动播放：发送Ajax请求后，延迟后面的整个程序执行，延迟时间设置尽量大以满足网速较慢的电脑，随后使视频播放
    //3.关于跳过视频中间的答题：答题界面是一个覆盖在视频上的div，div覆盖上时，视频将停止播放。可以考虑在出现div时删去它，或者使视频强行继续播放
    //4.关于判断视频结束并自动播放下一集：视频播放过程中轮询视频是否播放完毕，轮询间隔时间适当。当视频播放完毕时，伪造Ajax请求模拟鼠标点击下一集视频


    //BaguetteBox 是一个库，得包含进脚本里,代码混淆就不管了，程序可以正常运行
    var baguetteBox = function() {
        function t(t, n) {
            L.transforms = f(),
                L.svg = p(),
                e(),
                D = document.querySelectorAll(t), [].forEach.call(D, function(t) {
                    var e = t.getElementsByTagName("a");
                    e = [].filter.call(e, function(t) {
                        return j.test(t.href);
                    });
                    var o = S.length;
                    S.push(e),
                        S[o].options = n, [].forEach.call(S[o], function(t, e) {
                            h(t, "click", function(t) {
                                t.preventDefault ? t.preventDefault() : t.returnValue = !1, i(o), a(e)
                            })
                        })
                })
        }

        function e() {
            return (b = v("baguetteBox-overlay")) ? (k = v("baguetteBox-slider"), w = v("previous-button"), C = v("next-button"), void(T = v("close-button"))) : (b = y("div"), b.id = "baguetteBox-overlay", document.getElementsByTagName("body")[0].appendChild(b), k = y("div"), k.id = "baguetteBox-slider", b.appendChild(k), w = y("button"), w.id = "previous-button", w.innerHTML = L.svg ? E : "&lt;", b.appendChild(w), C = y("button"), C.id = "next-button", C.innerHTML = L.svg ? x : "&gt;", b.appendChild(C), T = y("button"), T.id = "close-button", T.innerHTML = L.svg ? B : "X", b.appendChild(T), w.className = C.className = T.className = "baguetteBox-button", void n())
        }

        function n() {
            h(b, "click", function(t) { t.target && "IMG" !== t.target.nodeName && "FIGCAPTION" !== t.target.nodeName && s() }), h(w, "click", function(t) { t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0, c() }), h(C, "click", function(t) { t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0, u() }), h(T, "click", function(t) { t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0, s() }), h(b, "touchstart", function(t) { N = t.changedTouches[0].pageX }), h(b, "touchmove", function(t) { H || (t.preventDefault ? t.preventDefault() : t.returnValue = !1, touch = t.touches[0] || t.changedTouches[0], touch.pageX - N > 40 ? (H = !0, c()) : touch.pageX - N < -40 && (H = !0, u())) }), h(b, "touchend", function() { H = !1 }), h(document, "keydown", function(t) {
                switch (t.keyCode) {
                    case 37:
                        c();
                        break;
                    case 39:
                        u();
                        break;
                    case 27:
                        s()
                }
            })
        }

        function i(t) {
            if (A !== t) {
                for (A = t, o(S[t].options); k.firstChild;) k.removeChild(k.firstChild);
                X.length = 0;
                for (var e, n = 0; n < S[t].length; n++) e = y("div"), e.className = "full-image", e.id = "baguette-img-" + n, X.push(e), k.appendChild(X[n])
            }
        }

        function o(t) {
            t || (t = {});
            for (var e in P) I[e] = P[e], "undefined" != typeof t[e] && (I[e] = t[e]);
            k.style.transition = k.style.webkitTransition = "fadeIn" === I.animation ? "opacity .4s ease" : "slideIn" === I.animation ? "" : "none", "auto" === I.buttons && ("ontouchstart" in window || 1 === S[A].length) && (I.buttons = !1), w.style.display = C.style.display = I.buttons ? "" : "none"
        }

        function a(t) {
            "block" !== b.style.display && (M = t, r(M, function() {
                g(M), m(M)
            }), d(), b.style.display = "block", setTimeout(function() { b.className = "visible" }, 50))
        }

        function s() { "none" !== b.style.display && (b.className = "", setTimeout(function() { b.style.display = "none" }, 500)) }

        function r(t, e) {
            var n = X[t];
            if ("undefined" != typeof n) {
                if (n.getElementsByTagName("img")[0]) return void(e && e());
                imageElement = S[A][t], imageCaption = imageElement.getAttribute("data-caption") || imageElement.title, imageSrc = l(imageElement);
                var i = y("figure"),
                    o = y("img"),
                    a = y("figcaption");
                n.appendChild(i), i.innerHTML = '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>', o.onload = function() {
                    var n = document.querySelector("#baguette-img-" + t + " .spinner");
                    i.removeChild(n), !I.async && e && e()
                }, o.setAttribute("src", imageSrc), i.appendChild(o), I.captions && imageCaption && (a.innerHTML = imageCaption, i.appendChild(a)), I.async && e && e()
            }
        }

        function l(t) {
            var e = imageElement.href;
            if (t.dataset) {
                var n = [];
                for (var i in t.dataset) "at-" !== i.substring(0, 3) || isNaN(i.substring(3)) || (n[i.replace("at-", "")] = t.dataset[i]);
                keys = Object.keys(n).sort(function(t, e) { return parseInt(t) < parseInt(e) ? -1 : 1 });
                for (var o = window.innerWidth * window.devicePixelRatio, a = 0; a < keys.length - 1 && keys[a] < o;) a++;
                e = n[keys[a]] || e
            }
            return e
        }

        function u() { M <= X.length - 2 ? (M++, d(), g(M)) : I.animation && (k.className = "bounce-from-right", setTimeout(function() { k.className = "" }, 400)) }

        function c() { M >= 1 ? (M--, d(), m(M)) : I.animation && (k.className = "bounce-from-left", setTimeout(function() { k.className = "" }, 400)) }

        function d() { var t = 100 * -M + "%"; "fadeIn" === I.animation ? (k.style.opacity = 0, setTimeout(function() { L.transforms ? k.style.transform = k.style.webkitTransform = "translate3d(" + t + ",0,0)" : k.style.left = t, k.style.opacity = 1 }, 400)) : L.transforms ? k.style.transform = k.style.webkitTransform = "translate3d(" + t + ",0,0)" : k.style.left = t }

        function f() { var t = y("div"); return "undefined" != typeof t.style.perspective || "undefined" != typeof t.style.webkitPerspective }

        function p() { var t = y("div"); return t.innerHTML = "<svg/>", "http://www.w3.org/2000/svg" == (t.firstChild && t.firstChild.namespaceURI) }

        function g(t) { t - M >= I.preload || r(t + 1, function() { g(t + 1) }) }

        function m(t) { M - t >= I.preload || r(t - 1, function() { m(t - 1) }) }

        function h(t, e, n) { t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent("on" + e, n) }

        function v(t) { return document.getElementById(t) }

        function y(t) { return document.createElement(t) }
        var b, k, w, C, T, N, E = '<svg width="44" height="60"><polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',
            x = '<svg width="44" height="60"><polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',
            B = '<svg width="30" height="30"><g stroke="rgb(160, 160, 160)" stroke-width="4"><line x1="5" y1="5" x2="25" y2="25"/><line x1="5" y1="25" x2="25" y2="5"/></g></svg>',
            I = {},
            P = { captions: !0, buttons: "auto", async: !1, preload: 2, animation: "slideIn" },
            L = {},
            M = 0,
            A = -1,
            H = !1,
            j = /.+\.(gif|jpe?g|png|webp)/i,
            D = [],
            S = [],
            X = [];
        return [].forEach || (Array.prototype.forEach = function(t, e) { for (var n = 0; n < this.length; n++) t.call(e, this[n], n, this) }), [].filter || (Array.prototype.filter = function(t, e, n, i, o) { for (n = this, i = [], o = 0; o < n.length; o++) t.call(e, n[o], o, n) && i.push(n[o]); return i }), { run: t }
    }();

    //closeChapterVerificationCode()等函数调用的库
    // WAY 是一个库  也必须包含进脚本
    WAY = {};
    WAY.box = (function() {
        var d, b, e, a = 0,
            f, g, c = 1;
        return {
            show: function(h) {
                g = {
                    opacity: 70,
                    mask: 1,
                    topsplit: 2,
                    width: 0,
                    height: 0,
                    fixed: 1,
                    ismove: 0,
                    html: 0
                };
                for (i in h) {
                    g[i] = h[i];
                }
                if (!a) {
                    d = document.createElement("div");
                    d.className = "wouter";
                    b = document.createElement("div");
                    b.className = "winner";
                    e = document.createElement("div");
                    e.className = "wconter";
                    a = document.createElement("div");
                    a.className = "wmask";
                    f = document.createElement("div");
                    f.className = "wtoolbar";
                    f.innerHTML = "<a href='javascript:void(0);' style='cursor:pointer; color:#000; float:right; text-decoration:none; padding:2px 5px 0 0; font: 24px blod;' onclick='WAY.box.hide();'>&times;</a>";
                    document.body.appendChild(d);
                    d.appendChild(b);
                    b.appendChild(f);
                    b.appendChild(e);
                    document.body.appendChild(a);
                    window.onresize = WAY.box.resize;
                    WAY.box.addMove();
                    f.style.height = "30px";
                    f.style.cursor = "move";
                    f.style.borderRadius = "5px 5px 0 0";
                    d.style.zIndex = "9999";
                    d.style.borderRadius = "7px 7px 0 0";
                    d.style.display = "none";
                    a.style.zIndex = "9998";
                    a.style.position = "absolute";
                    a.style.top = a.style.left = 0;
                    a.style.display = "none";
                    e.style.padding = "10px"
                } else {
                    e.innerHTML = "";
                    clearTimeout(b.timer)
                }
                if (g.ismove) {
                    f.style.display = "";
                    d.style.boder = "1px solid #000"
                } else {
                    f.style.display = "none";
                    d.style.background = ""
                }
                f.style.background = g.barcolor || "#999";
                d.style.position = g.fixed ? "fixed" : "absolute";
                b.style.width = g.width ? g.width + "px" : "auto";
                b.style.height = g.height ? g.height + "px" : "auto";
                a.style.opacity = g.opacity / 100;
                a.style.filter = "alpha(opacity=" + g.opacity + ")";
                a.style.background = g.bkcolor || "#000";
                a.style.display = g.mask ? "" : "none";
                if (g.divid) {
                    c = document.getElementById(g.divid);
                    if (c != null) {
                        c.style.display = "";
                        c.style.position = "static";
                        c.style.marginLeft = "0";
                        c.style.marginRight = "0";
                        c.style.marginTop = "0";
                        c.style.marginBotton = "0";
                        c.style.top = "0";
                        c.style.left = "0";
                        e.placeholder = c.parentNode;
                        e.appendChild(c);
                        d.style.display = "";
                        f.style.width = 0 + "px"
                    }
                } else {
                    if (g.html) {
                        e.innerHTML = g.html;
                        d.style.display = ""
                    }
                }
                WAY.box.size();
                if (g.autohide) {
                    b.timer = setTimeout(WAY.box.hide, g.autohide * 1000)
                }
            },
            size: function() {
                var j, h;
                b.style.width = "";
                b.style.height = "";
                if (!g.width) {
                    j = parseInt(e.offsetWidth)
                }
                if (!g.height) {
                    h = parseInt(e.offsetHeight)
                }
                if (g.ismove) {
                    h += 30
                }
                f.style.width = j + "px";
                b.style.height = h + "px";
                b.style.width = j + "px";
                WAY.box.resize()
            },
            addMove: function() {
                f.onmousedown = function(j) {
                    j = WAY.util.getEvent(j);
                    var k = j.clientX - WAY.util.delPx(d.style.left),
                        h = j.clientY - WAY.util.delPx(d.style.top);
                    document.onmousemove = function(l) {
                        l = WAY.util.getEvent(l);
                        d.style.left = l.clientX - k + "px";
                        d.style.top = l.clientY - h + "px";
                        return false
                    };
                    f.onmouseup = function() {
                        document.onmousemove = null;
                        f.onmouseup = null;
                        return false
                    }
                }
            },
            resize: function() {
                WAY.box.pos();
                WAY.box.remask()
            },
            pos: function() {
                var h;
                if (typeof g.top != "undefined") {
                    h = g.top
                } else {
                    h = WAY.page.height() / g.topsplit - d.offsetHeight / 2;
                    h = h < 20 ? 20 : h
                }
                if (!g.fixed && !g.top) {
                    h += WAY.page.top()
                }
                d.style.top = h + "px";
                d.style.left = typeof g.left != "undefined" ? g.left + "px" : (WAY.page.width() - d.offsetWidth) / 2 + "px"
            },
            remask: function() {
                a.style.width = WAY.page.swidth() + "px";
                a.style.height = WAY.page.sheight() + "px"
            },
            hide: function() {
                d.style.display = "none";
                a.style.display = "none";
                if (typeof e.placeholder != "undefined") {
                    e.placeholder.appendChild(c);
                    e.placeholder = undefined
                }
            }
        }
    })();
    WAY.page = (function() {
        var e, b, c;

        function a() {
            e = document, b = e.documentElement, c = e.body;
            return e.compatMode == "BackCompat"
        }
        return {
            top: function() {
                a();
                return Math.max(c.scrollTop, b.scrollTop)
            },
            width: function() {
                return a() ? c.clientWidth : b.clientWidth
            },
            height: function() {
                return a() ? c.clientHeight : b.clientHeight
            },
            swidth: function() {
                return a() ? Math.max(c.clientWidth, c.scrollWidth) : Math.max(b.clientWidth, b.scrollWidth)
            },
            sheight: function() {
                return a() ? Math.max(c.clientHeight, c.scrollHeight) : Math.max(b.clientHeight, b.scrollHeight)
            },
            createXHR: function() {
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest()
                } else {
                    if (typeof ActiveXObject != "undefined") {
                        if (typeof arguments.callee.activeXString != "string") {
                            var f = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                                h, d;
                            for (h = 0, d = f.length; h < d; h++) {
                                try {
                                    new ActiveXObject(f[h]);
                                    arguments.callee.activeXString = f[h];
                                    break
                                } catch (g) {}
                            }
                        }
                        return new ActiveXObject(arguments.callee.activeXString)
                    } else {
                        throw new Error("No XHR object available.")
                    }
                }
            }
        }
    })();
    WAY.util = (function() {
        return {
            delPx: function(a) {
                return parseInt(a.substring(0, a.length - 2))
            },
            getEvent: function(a) {
                return a || window.event
            }
        }
    })();

    function closeChapterVerificationCode() {
        if ($('.wmask').length == 0) {
            return;
        }
        WAY.box.hide();
        $('#chapterVerificationCode').css('display', 'none');
        $('#chapterVerificationCodeTip').css('display', 'none');
    }

    function recordCheckedChapterParam(courseId, clazzid, chapterId, cpi) {
        if (!window.checked_chapter_param) {
            window.checked_chapter_param = {};
        }
        checked_chapter_param.courseId = courseId;
        checked_chapter_param.clazzid = clazzid;
        checked_chapter_param.chapterId = chapterId;
        checked_chapter_param.cpi = cpi;
    }

    function openlockshow() {
        if ($("#openlock").length > 0) {
            document.getElementById("openlock").style.display = "block";
        }
    }

    function conversion(times) {
        // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
        var date = new Date(times);
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = (date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1) + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y + M + D + h + m + s;
        // 输出结果：2014-04-23 18:55:49
    }

    function getClazzNote() {
        //获取章节笔记列表
        var chapterId = document.getElementById("chapterIdid").value;

        jQuery.ajax({
            type: "get",
            url: "/schoolCourseInfo/chapternotelist",
            data: {
                userid: 108234866,
                chapterId: chapterId,
                courseId: 204821868
            },
            success: function(data) {
                if (data != null) {
                    data = jQuery.parseJSON(data);
                    if (data.result == 1) {
                        $("#kc_notes_list").css('display', 'block');
                        $("#no_notes").css('display', 'block');
                        $("#kc_notes_upDown").css('display', 'inline');
                        if (data.data.list.length > 0) {
                            $("#no_notes").css('display', 'none');
                            var kc_notes_list = $("#kc_notes_list");
                            kc_notes_list.empty();
                            var content = null;
                            var createTime = null;
                            var cid = null;
                            var array = data.data.list;
                            for (var i = 0; i < array.length; i++) {
                                var json = array[i];
                                $.each(json, function(i) {
                                    if (i == 'content') {
                                        content = json[i];
                                    } else if (i == 'createTime') {
                                        createTime = conversion(json[i]); //得到的结果是2012-10-12 22:37:33
                                    } else if (i == 'cid') {
                                        cid = json[i];
                                    }
                                });
                                kc_notes_list.append('<dl class="kc_notes_row">\n' +
                                    '                        <dt><a target="_blank" href="http://note.yd.chaoxing.com/pc/note_note/noteDetailLatest/' + cid + '">' + content + '...</a></dt>\n' +
                                    '                        <dd>创建日期：' + createTime + '</dd>\n' +
                                    '                    </dl>');
                            }
                        } else {
                            $("#kc_notes_list").css('display', 'none');
                            $("#kc_notes_upDown").css('display', 'none');
                        }
                    }
                }
            }
        });
    };

    function checkUnsave() {
        var writenotecontent = $("#writenotecontent");
        if (writenotecontent.html() != '' && writenotecontent.html() != "") {
            $("#noSaveTips").css('display', 'block');
            return true;
        }
        return false;
    }

    var changePan = function(num) {
        num = parseInt(num);
        var check = checkUnsave();
        if (num != 3 && check) {
            return;
        }
        for (var i = 1; i <= 3; i++) {
            var titledoc = document.getElementById("tit" + i);
            var contentdoc = document.getElementById("content" + i);
            if (1 != 0 || (1 == 0 && i != 2)) {
                if (i == num) {
                    titledoc.className = "current01";
                    titledoc.style.display = "block";
                    contentdoc.style.display = "block";
                } else {
                    titledoc.className = "";
                    contentdoc.style.display = "none";
                }
            }
        }
    }

    function down() {
        var el = $('.newPic'),
            curHeight = el.height(),
            autoHeight = el.css('height', 'auto').height();
        el.height(curHeight).animate({ height: autoHeight }, 250);

    }

    function getChapterRightDiscuss() {
        var chapterId = document.getElementById("chapterIdid").value;
        //jQuery.post("/schoolCourseInfo/getChapterRightDiscuss",
        $.ajax({
            type: "post",
            url: "/schoolCourseInfo/getgrouptopic",
            async: false,
            data: {
                courseId: '204821868',
                clazzid: '9561385',
                type: 2,
                ut: 's',
                chapterId: chapterId
            },
            success: function(data) {
                data = data.replace(/(^\s*)|(\s*$)/g, "");
                var doc = document.getElementById("content2");
                doc.innerHTML = data;
                $(function() {
                    swfu2 = new SWFUpload({
                        flash_url: "/js/swfupload/swfupload.swf",
                        upload_url: "/edit/swfUploadImage?uid=" + getcookie("_uid"),
                        file_types: "*.jpg;*.jpeg;*.gif;*.png",
                        file_types_description: "All Images",
                        file_size_limit: "20000000B",
                        file_queue_limit: 0,
                        custom_settings: {
                            progressTarget: "imgUploadProgress2",
                            cancelButtonId: "imgbtnCancel2",
                            //currentUrl: $("fileUploader_group").attr("data")
                        },
                        debug: false,

                        // Button settings
                        button_image_url: "/images/group/addPic.png",
                        button_placeholder_id: "fileUploader_group",
                        button_width: "30",
                        button_height: "27",
                        button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
                        button_cursor: SWFUpload.CURSOR.HAND,
                        button_window_mode: SWFUpload.WINDOW_MODE.OPAQUE,

                        // The event handler functions are defined in handlers.js
                        upload_start_handler: uploadCover_upload_start_handler,
                        file_queued_handler: uploadCover_file_queued_handler,
                        file_queue_error_handler: SWFUpload.fileQueueError,
                        file_dialog_complete_handler: uploadCover_file_dialog_complete_handler,
                        upload_progress_handler: uploadCover_upload_progress_handler,
                        upload_error_handler: SWFUpload.uploadError,
                        upload_success_handler: uploadLandCover_upload_success_handler,
                        upload_complete_handler: SWFUpload.uploadComplete,
                        queue_complete_handler: uploadCover_queue_complete_handler
                    });
                    baguetteBox.run('.smallImg', {
                        animation: 'fadeIn',
                    });
                });

                $(function() {
                    $(".newTopic0").click(function() {
                        down();
                    })
                })
            }
        });
    }

    function jobflag() {
        var ff = window.frames[0];
        var jobNum = 0,
            finishedNum = 0;
        if (ff) {
            jobNum += jQuery(".ans-job-icon", ff.document).size(); ///////////
            finishedNum += jQuery(".ans-job-finished", ff.document).size(); //////////
        }
        if (jobNum > 2 && jobNum - finishedNum > 0) {
            jQuery("#jobhint").fadeIn();
            jQuery("#jobhint span").html(jobNum - finishedNum);

            var unfinished = jQuery(".ans-job-icon", ff.document).parent().not(".ans-job-finished");

            if (unfinished.size() > 0) {
                jQuery("#jobhint").attr("href", "javascript:;");
                jQuery("#jobhint").click(function() {
                    //var tar = jQuery(unfinished[0]);
                    //console.log(tar);
                    //jQuery("html,body").animate({scrollTop:tar.offset().top},200);
                    jQuery("html,body").animate({ scrollTop: jQuery(jQuery(".ans-job-icon", window.frames[0].document).parent().not(".ans-job-finished")[0]).offset().top }, 200);
                });
            } else {
                jQuery("#jobhint").attr("href", "javascript:;");
                jQuery("#jobhint span").html(0);
                $("#jobhint").unbind("click");
            }

        } else {
            jQuery("#jobhint").fadeOut();
            jQuery("#jobhint").attr("href", "javascript:;");
            jQuery("#jobhint span").html(0);
            $("#jobhint").unbind("click");
        }
    }

    function setposition() {
        $('.orientationleft').css('top', $(window).height() / 2 + $(window).scrollTop());
        $('.orientationright').css('top', $(window).height() / 2 + $(window).scrollTop());
        $('#openlock').css('top', $(window).height() / 2 + $(window).scrollTop());
        //$('.gohead').css('top',$(window).height() - 100 - $('.main').offset().top + $(window).scrollTop());
    }

    function jobflagOperation() {
        try {
            setTimeout(jobflag, 6000);
        } catch (e) {
            console.log(e.message);
        }
    }
    //鼠标点击视频的入口函数
    function getTeacherAjax(courseId, clazzid, chapterId, cpi, chapterVerCode) {
        closeChapterVerificationCode();
        if (courseId == 0 || clazzid == 0 || chapterId == 0) {
            alert("无效的参数！");
            return;
        }
        if (typeof(cpi) == 'undefined') {
            cpi = 0;
        }
        document.getElementById("mainid").innerHTML = "<div style=\"width:32px;height:32px;margin:0 auto;padding:300px 0\"><img src=\"/images/courselist/loading.gif\" /></div>"
        jQuery.ajax({
            type: "post",
            url: "/mycourse/studentstudyAjax",
            async: false,
            data: {
                courseId: courseId,
                clazzid: clazzid,
                chapterId: chapterId,
                cpi: cpi,
                verificationcode: chapterVerCode || ''
            },
            success: function(data) {
                data = data.replace(/(^\s*)|(\s*$)/g, "");
                var doc = document.getElementById("mainid");
                jQuery(doc).html(data);
                if (data.indexOf('showChapterVerificationCode') > -1) {
                    recordCheckedChapterParam(courseId, clazzid, chapterId, cpi);
                    return;
                }
                document.getElementById("iframe").src = "/knowledge/cards?clazzid=" + clazzid + "&courseid=" + courseId + "&knowledgeid=" + chapterId + "&num=0&ut=s&cpi=97562799&v=20160407-1";
                var el = $('#iframe');
                //var openlockdiv=document.getElementById("openlock");
                if ($("#openlock").length > 0) {
                    var count = document.getElementById("cardcount").value;
                    if (count == 1) {
                        setTimeout(openlockshow(), 2000);
                    }
                }
                if ($("#cur" + chapterId + " .orange01").length > 0) {
                    jQuery.ajax({
                        type: "get",
                        url: "/edit/validatejobcount",
                        async: false, //同步false异步true
                        data: {
                            courseId: courseId,
                            clazzid: clazzid,
                            nodeid: chapterId
                        },
                    });
                }

                function ed_reinitIframe() {
                    var iframe = el[0];

                    try {
                        var bHeight = iframe.contentWindow.document.body.scrollHeight;
                        var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
                        var height = Math.max(bHeight, dHeight);
                        el.attr('height', height);
                    } catch (ex) {}
                }
                setInterval(ed_reinitIframe(), 200);

                var tab = 0;
                if (tab == 3) {
                    getClazzNote();
                    changePan('3');
                } else if (tab == 2) {
                    getChapterRightDiscuss();
                    changePan('2');
                } else {
                    changePan('1');
                }
            }
        })


        window.setInterval(setposition(), 200);

        jobflagOperation();

        //window.setTimeout("setposition()", 200);
        scroll(0, 0);
    }


    //封装Ajax请求
    function ajax(options) {
        var xhr = null;
        var params = formsParams(options.data);
        //创建对象
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        // 连接
        if (options.type == "GET") {
            xhr.open(options.type, options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open(options.type, options.url, options.async);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                options.success(xhr.responseText);
            }
        };

        function formsParams(data) {
            var arr = [];
            for (var prop in data) {
                arr.push(prop + "=" + data[prop]);
            }
            return arr.join("&");
        };
    }


    //完成Ajax请求重要参数的定义和设置
    var courseId = 204821868;
    var clazzid = 9561385;
    var basic_chapterId = 165583876;
    var chapterId = [0];
    for (var i = 0; i < 143; i++) {
        chapterId.push(basic_chapterId + i);
        if (chapterId[i + 1] == 165583961) break;
    }
    i++;
    chapterId.push(basic_chapterId + i + 1);
    for (; i < 143; i++) {
        chapterId.push(basic_chapterId + i);
    }

    function calculate_coursenumber(cha, sec, _cha, _sec) {
        var cha_length = 0;
        var sec_length = 0; //注意千万不能犯var cha_length,sec_length = 0的低级错误！！！
        for (var i = 1; i <= cha; i++) {
            console.log(document.getElementById("coursetree").children[i].children.length - 1);
            if (cha != 1) {
                cha_length += (document.getElementById("coursetree").children[i].children.length - 1);
            }
        }
        sec_length = sec;
        return cha_length + sec_length;
    }
    //虽然有函数声明提升，但是放在前面看还是好看点
    //不暂停得播放视频
    function play_without_pause(vid, jy) {
        vid.click();
        if (jy.getAttribute("title") != "取消静音") {
            jy.click();
        }
    }
    //播放视频
    function playvideo(vid) {
        var playPromise = vid.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    vid.play();
                })
                .catch(error => {

                });
        }
        console.log("play");
    }
    //自动播放下一集视频
    var nextcourse = function(chapt, cha, sec, _cha, _sec) {
        if (sec < chapt[cha].children.length - 2) {
            sec++;
        } else {
            sec = 1;
            cha++;
        }
        //将传来的数据转化为id
        var totalid = calculate_coursenumber(cha, sec, _cha, _sec);
        //发送伪造的Ajax请求，模拟鼠标点击操作
        getTeacherAjax(courseId, clazzid, chapterId[totalid]);
        setTimeout(function() {
            var video = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("video_html5_api");

            var playbutton = this.document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-attach-online ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-big-play-button")[0];

            var jy = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0];

            play_without_pause(playbutton, jy);

            setInterval(function() {
                var spans = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-progress-holder vjs-slider vjs-slider-horizontal")[0].getAttribute("aria-valuenow");
                if (spans != 100) {
                    play_without_pause(playbutton, jy);
                } else {
                    clearInterval(abc);
                }
            }, 100);
            var overed = setInterval(function() {
                if (video.ended == true) {
                    nextcourse(chapt, cha, sec, _cha, _sec);
                    clearInterval(overed);
                }
            }, 5000);
        }, 10000);
    }



    //网页页面加载完成后执行主程序
    window.onload = function() {
        //页面加载完成后，首先获取course列表
        var course = this.document.getElementById("coursetree");
        var chapter = course.children;
        //随后获取视频
        var video = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("video_html5_api");
        var playbutton = this.document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-attach-online ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-big-play-button")[0];
        var jy = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-0")[0];
        //脚本开始提示语
        this.alert("水视频脚本1.0版：\n脚本核心思路：伪造Ajax请求，完全模拟鼠标点击事件。")
        this.alert("功能： 1.选择某章某节开始水（该功能对于某些特定的视频可能会出现bug，如果从第一节开始水可以保证所有视频全部播放一遍，如果从中间某一节开始，则可能会漏掉某几节） 2.选择课程后视频自动播放 3.视频中间的答题将跳过 4.鼠标离开视频页面，视频不会暂停 5.视频播放完毕后，5秒内将自动播放下一集功能");
        this.alert("实现思路： 1.关于选择某一节课：将输入转化为courseId，通过特定的courseId发送请求 2.关于自动播放：发送Ajax请求后，延迟后面的整个程序执行，延迟时间设置尽量大以满足网速较慢的电脑，随后使视频播放 3.关于跳过视频中间的答题：答题界面是一个覆盖在视频上的div，div覆盖上时，视频将停止播放。可以考虑在出现div时删去它，或者使视频强行继续播放 4.关于判断视频结束并自动播放下一集：视频播放过程中轮询视频是否播放完毕，轮询间隔时间适当。当视频播放完毕时，伪造Ajax请求模拟鼠标点击下一集视频");
        this.alert("注意事项： 1.脚本尚未做太多的意外情况处理，如果错误输入，或脚本运行中途点击视频，可能会导致脚本运行异常。 2.请勿恶意使用该脚本。 3.尽管已经最大程度降低使用该脚本水视频的风险，但被官方发现水视频或者刷课的风险依然存在，请使用该脚本完成自己目标的人自行承担风险。")
            //输入从第几章开始
        var result_chapter = parseInt(this.prompt("开始搞事情？（请输入从第几章开始，阿拉伯数字1-20）"));
        while (result_chapter <= 0 || result_chapter > 20) {
            this.alert("输入错误，请重新输入,20章以后的内容请自行点击完成。");
            result_chapter = parseInt(this.prompt("开始搞事情？（请输入从第几章开始，阿拉伯数字）"));
        }
        //输入从该章的第几节开始
        var result_chapter_section = this.parseInt(this.prompt("继续？（请输入从该章的第几节开始）"));
        while (result_chapter_section <= 0 || result_chapter_section > chapter[result_chapter].children.length - 1) {
            this.alert("输入错误，请重新输入。");
            result_chapter_section = this.parseInt(this.prompt("继续？（请输入从该章的第几节开始）"));
        }
        //确认用户输入
        this.alert("您选择的是从第 " + result_chapter + " 章 第 " + result_chapter_section + " 节 开始");
        //核心模块开始
        var _result_chapter = document.getElementById("coursetree").children[result_chapter];
        var _result_chapter_section = _result_chapter.children[result_chapter_section];
        var course_number = calculate_coursenumber(result_chapter, result_chapter_section, _result_chapter, _result_chapter_section);
        // 第零步，发送Ajax请求，模拟点击        
        getTeacherAjax(courseId, clazzid, chapterId[course_number]);
        //获取数据
        setTimeout(function() {
            var ii = 0;

            function vid() {
                try {
                    video = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("video_html5_api");

                    playbutton = document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-attach-online ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-big-play-button")[0];

                    play_btn = document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-attach-online ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];

                    jy = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0];

                    play_without_pause(playbutton, jy);
                } catch (err) {
                    ii++;
                    if (ii <= 10) {
                        console.log(ii);
                        v();
                    }
                }
            }
            vid();
            if (video && playbutton) {
                playvideo(video);
                //每50毫秒轮询一次视频是否被暂停
                setInterval(function() {
                    var spans = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-progress-holder vjs-slider vjs-slider-horizontal")[0].getAttribute("aria-valuenow");
                    if (spans != 100) {
                        play_without_pause(playbutton, jy);
                    } else {
                        clearInterval(abc);
                    }
                }, 50);
                //每5秒轮询一次视频是否播放完毕
                var overed = setInterval(function() {
                    if (video.ended == true) {
                        nextcourse(chapter, result_chapter, result_chapter_section, _result_chapter, _result_chapter_section);
                        clearInterval(overed);
                    }
                }, 5000);
            }
        }, 8000)
    }
})();