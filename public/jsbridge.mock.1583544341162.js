(function () {
    let logged = true;
    const mock = {
        'appInfo': {
            aid: '1128'
        },
        'adInfo': {
            "cid":1642544340288524,
            "group_id":6727861926879038000,
            "ad_type":0,
            "log_extra":`{"ad_price":"XfonKf_iSGBd-icp_-JIYDh1WZ9BwMNErMnokQ","card_type":"commerce","component_ids":[8,9,10,12,27,191],"convert_component_suspend":0,"convert_id":0,"external_action":5,"is_pack_v2":true,"orit":40001,"placement":"unknown","req_id":"20191218211833010014045015164F0BE1","rit":40001,"style_id":4916,"style_ids":[4916],"van_package":-1}`,
            "download_url":"https://dl.hdslb.com/mobile/latest/iBiliPlayer-mxjrtt071.apk",
            "package_name":"tv.danmaku.bili",
            "app_name":"",
            "code":1
        },
        'userInfo': function() {
            logged = !logged;
            return {
                user_id: '3408140366266232',
                sec_uid: 'MS4wLjABAAAAtTTeMx_d9dI-V_uwsLkKrYmwwBgmGl1dR3eirhQPeJ6s5YXqgdtr2AzIgYSoB_TN‍',
                is_login: logged,
                code: 1
            }
        },
        'showToast': function(message) {
            alert(message);
        },
        'login': function(params) {
            window.open('', '_blank');
        },
        'subscribe_app_ad': function(params) {
            const payload = {
                source: "light_page",
                event_tag: "feed_download_ad",
                ad_id: "1653339607667725",
                id: "",
                is_ad: 1,
                name: "冰雪传奇：威震八方",
                pkg_name: "com.ywwzgd.bxcqxxttb",
                download_url: "https://pop.ad.52ywan.cn/Planlist/ad?id=5dfb41b97638c30975611b36",
                log_extra: "",
                extra: {light_page: 1}
            }
            this.emit('app_ad_event', {
                status: 'idle',
                current_bytes: 0,
                total_byets: 0
            });
            console.log('===params==', params);
        },
        'download_app_ad': function(params) {
            this.emit('app_ad_event', {
                status: 'download_active',
                current_bytes: 100,
                total_byets: 200
            })
        }
    }

    const onListeners = {};
    const ToutiaoJSBridge = {
        call: function (method, params, cb=()=> {}) {
            let res = mock[method];
            if (typeof res === 'function') {
                res = res.bind(ToutiaoJSBridge);
                cb(res(params));
            } else {
                cb(res);
            }
        },
        on: function (eventName, cb) {
            (onListeners[eventName] || (onListeners[eventName] = [])).push(cb);
        },
        emit: function (eventName, data) {
            (onListeners[eventName] || []).forEach((cb) => cb(data));
        }
    };

    const callHandler = {
        apply(target, ctx, callArgs) {
            console.group(`[${new Date().toLocaleString()}] call '${callArgs[0]}'`);
            console.log('params:', JSON.stringify(callArgs[1], null, 2));

            if (typeof callArgs[2] === 'function') {
                console.log('has callback');
                callArgs[2] = new Proxy(callArgs[2], {
                    apply(target, ctx, args) {
                        console.group(`[${new Date().toLocaleString()}] '${callArgs[0]}' callback`);
                        console.log('params:', JSON.stringify(args[0], null, 2));
                        console.groupEnd();
                        return Reflect.apply(...arguments);
                    }
                });
            } else {
                console.log('no callback');
            }

            console.groupEnd();
            return Reflect.apply(...arguments);
        }
    };

    const onHandler = {
        apply(target, ctx, callArgs) {
            console.log(`[${new Date().toLocaleString()}] on '${callArgs[0]}'`);

            callArgs[1] = new Proxy(callArgs[1], {
                apply(target, ctx, args) {
                    console.group(`[${new Date().toLocaleString()}] '${callArgs[0]}' callback`);
                    console.log('params:', JSON.stringify(args[0], null, 2));
                    console.groupEnd();
                    return Reflect.apply(...arguments);
                }
            });

            return Reflect.apply(...arguments);
        }
    };

    window.ToutiaoJSBridge = {
        call: ToutiaoJSBridge.call,
        // call: new Proxy(ToutiaoJSBridge.call, callHandler),
        on: new Proxy(ToutiaoJSBridge.on, onHandler),
        emit: ToutiaoJSBridge.emit
    };
})();
