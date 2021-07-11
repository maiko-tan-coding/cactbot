/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./resources/overlay_plugin_api.ts
// OverlayPlugin API setup
let inited = false;
let wsUrl = null;
let ws = null;
let queue = [];
let rseqCounter = 0;
const responsePromises = {};
const subscribers = {};
const sendMessage = (msg, cb) => {
    if (ws) {
        if (queue)
            queue.push(msg);
        else
            ws.send(JSON.stringify(msg));
    }
    else {
        if (queue)
            queue.push([msg, cb]);
        else
            window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
    }
};
const processEvent = (msg) => {
    init();
    const subs = subscribers[msg.type];
    subs === null || subs === void 0 ? void 0 : subs.forEach((sub) => sub(msg));
};
const dispatchOverlayEvent = processEvent;
const addOverlayListener = (event, cb) => {
    var _a;
    init();
    if (!subscribers[event]) {
        subscribers[event] = [];
        if (!queue) {
            sendMessage({
                call: 'subscribe',
                events: [event],
            });
        }
    }
    (_a = subscribers[event]) === null || _a === void 0 ? void 0 : _a.push(cb);
};
const removeOverlayListener = (event, cb) => {
    init();
    if (subscribers[event]) {
        const list = subscribers[event];
        const pos = list === null || list === void 0 ? void 0 : list.indexOf(cb);
        if (pos && pos > -1)
            list === null || list === void 0 ? void 0 : list.splice(pos, 1);
    }
};
const callOverlayHandlerInternal = (_msg) => {
    init();
    const msg = {
        ..._msg,
        rseq: 0,
    };
    let p;
    if (ws) {
        msg.rseq = rseqCounter++;
        p = new Promise((resolve) => {
            responsePromises[msg.rseq] = resolve;
        });
        sendMessage(msg);
    }
    else {
        p = new Promise((resolve) => {
            sendMessage(msg, (data) => {
                resolve(data === null ? null : JSON.parse(data));
            });
        });
    }
    return p;
};
const callOverlayHandlerOverrideMap = {};
const callOverlayHandler = (_msg) => {
    var _a;
    init();
    // If this `as` is incorrect, then it will not find an override.
    // TODO: we could also replace this with a type guard.
    const type = _msg.call;
    const callFunc = (_a = callOverlayHandlerOverrideMap[type]) !== null && _a !== void 0 ? _a : callOverlayHandlerInternal;
    // The `IOverlayHandler` type guarantees that parameters/return type match
    // one of the overlay handlers.  The OverrideMap also only stores functions
    // that match by the discriminating `call` field, and so any overrides
    // should be correct here.
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument
    return callFunc(_msg);
};
const setOverlayHandlerOverride = (type, override) => {
    if (!override) {
        delete callOverlayHandlerOverrideMap[type];
        return;
    }
    callOverlayHandlerOverrideMap[type] = override;
};
const init = () => {
    if (inited)
        return;
    if (typeof window !== 'undefined') {
        wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(window.location.href);
        if (wsUrl) {
            const connectWs = function () {
                ws = new WebSocket(wsUrl === null || wsUrl === void 0 ? void 0 : wsUrl[1]);
                ws.addEventListener('error', (e) => {
                    console.error(e);
                });
                ws.addEventListener('open', () => {
                    console.log('Connected!');
                    const q = queue !== null && queue !== void 0 ? queue : [];
                    queue = null;
                    sendMessage({
                        call: 'subscribe',
                        events: Object.keys(subscribers),
                    });
                    for (const msg of q) {
                        if (!Array.isArray(msg))
                            sendMessage(msg);
                    }
                });
                ws.addEventListener('message', (_msg) => {
                    var _a;
                    try {
                        if (typeof _msg.data !== 'string') {
                            console.error('Invalid message data received: ', _msg);
                            return;
                        }
                        const msg = JSON.parse(_msg.data);
                        if (msg.rseq !== undefined && responsePromises[msg.rseq]) {
                            (_a = responsePromises[msg.rseq]) === null || _a === void 0 ? void 0 : _a.call(responsePromises, msg);
                            delete responsePromises[msg.rseq];
                        }
                        else {
                            processEvent(msg);
                        }
                    }
                    catch (e) {
                        console.error('Invalid message received: ', _msg);
                        return;
                    }
                });
                ws.addEventListener('close', () => {
                    queue = null;
                    console.log('Trying to reconnect...');
                    // Don't spam the server with retries.
                    window.setTimeout(() => {
                        connectWs();
                    }, 300);
                });
            };
            connectWs();
        }
        else {
            const waitForApi = function () {
                if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
                    window.setTimeout(waitForApi, 300);
                    return;
                }
                const q = queue !== null && queue !== void 0 ? queue : [];
                queue = null;
                window.__OverlayCallback = processEvent;
                sendMessage({
                    call: 'subscribe',
                    events: Object.keys(subscribers),
                });
                for (const item of q) {
                    if (Array.isArray(item))
                        sendMessage(item[0], item[1]);
                }
            };
            waitForApi();
        }
        // Here the OverlayPlugin API is registered to the window object,
        // but this is mainly for backwards compatibility.For cactbot's built-in files,
        // it is recommended to use the various functions exported in resources/overlay_plugin_api.ts.
        window.addOverlayListener = addOverlayListener;
        window.removeOverlayListener = removeOverlayListener;
        window.callOverlayHandler = callOverlayHandler;
        window.dispatchOverlayEvent = dispatchOverlayEvent;
    }
    inited = true;
};

;// CONCATENATED MODULE: ./ui/test/test.ts


addOverlayListener('ChangeZone', (e) => {
    const currentZone = document.getElementById('currentZone');
    if (currentZone)
        currentZone.innerText = `currentZone: ${e.zoneName} (${e.zoneID})`;
});
addOverlayListener('onInCombatChangedEvent', (e) => {
    const inCombat = document.getElementById('inCombat');
    if (inCombat)
        inCombat.innerText = `inCombat: act: ${e.detail.inACTCombat ? 'yes' : 'no'} game: ${(e.detail.inGameCombat ? 'yes' : 'no')}`;
});
addOverlayListener('onPlayerChangedEvent', (e) => {
    const hp = document.getElementById('hp');
    if (hp)
        hp.innerText = `${e.detail.currentHP}/${e.detail.maxHP} (${e.detail.currentShield})`;
    const mp = document.getElementById('mp');
    if (mp)
        mp.innerText = `${e.detail.currentMP}/${e.detail.maxMP}`;
    const cp = document.getElementById('cp');
    if (cp)
        cp.innerText = `${e.detail.currentCP}/${e.detail.maxCP}`;
    const gp = document.getElementById('gp');
    if (gp)
        gp.innerText = `${e.detail.currentGP}/${e.detail.maxGP}`;
    const job = document.getElementById('job');
    if (job)
        job.innerText = `${e.detail.level} ${e.detail.job}`;
    const debug = document.getElementById('debug');
    if (debug)
        debug.innerText = e.detail.debugJob;
    const jobInfo = document.getElementById('jobinfo');
    if (jobInfo) {
        const detail = e.detail;
        if (detail.job === 'RDM' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.whiteMana} | ${detail.jobDetail.blackMana}`;
        else if (detail.job === 'WAR' && detail.jobDetail)
            jobInfo.innerText = detail.jobDetail.beast.toString();
        else if (detail.job === 'DRK' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.blood} | ${detail.jobDetail.darksideMilliseconds} | ${detail.jobDetail.darkArts.toString()} | ${detail.jobDetail.livingShadowMilliseconds}`;
        else if (detail.job === 'GNB' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.cartridges}${detail.jobDetail.continuationState}`;
        else if (detail.job === 'PLD' && detail.jobDetail)
            jobInfo.innerText = detail.jobDetail.oath.toString();
        else if (detail.job === 'BRD' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.songName} | ${detail.jobDetail.songProcs} | ${detail.jobDetail.soulGauge} | ${detail.jobDetail.songMilliseconds}`;
        else if (detail.job === 'DNC' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.feathers} | ${detail.jobDetail.esprit} | [${detail.jobDetail.steps.join(', ')}] | ${detail.jobDetail.currentStep}`;
        else if (detail.job === 'NIN' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.hutonMilliseconds} | ${detail.jobDetail.ninkiAmount}`;
        else if (detail.job === 'DRG' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.bloodMilliseconds} | ${detail.jobDetail.lifeMilliseconds} | ${detail.jobDetail.eyesAmount}`;
        else if (detail.job === 'BLM' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.umbralStacks} (${detail.jobDetail.umbralMilliseconds}) | ${detail.jobDetail.umbralHearts} | ${detail.jobDetail.foulCount} ${detail.jobDetail.enochian.toString()} (${detail.jobDetail.nextPolyglotMilliseconds})`;
        else if (detail.job === 'THM' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.umbralStacks} (${detail.jobDetail.umbralMilliseconds})`;
        else if (detail.job === 'WHM' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.lilyStacks} (${detail.jobDetail.lilyMilliseconds}) | ${detail.jobDetail.bloodlilyStacks}`;
        else if (detail.job === 'SMN' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.aetherflowStacks} | ${detail.jobDetail.dreadwyrmStacks} | ${detail.jobDetail.bahamutStance} | ${detail.jobDetail.bahamutSummoned} (${detail.jobDetail.stanceMilliseconds}) | ${detail.jobDetail.phoenixReady}`;
        else if (detail.job === 'SCH' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.aetherflowStacks} | ${detail.jobDetail.fairyGauge} | ${detail.jobDetail.fairyStatus} (${detail.jobDetail.fairyMilliseconds})`;
        else if (detail.job === 'ACN' && detail.jobDetail)
            jobInfo.innerText = detail.jobDetail.aetherflowStacks.toString();
        else if (detail.job === 'AST' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.heldCard} [${detail.jobDetail.arcanums.join(', ')}]`;
        else if (detail.job === 'MNK' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.lightningStacks} (${detail.jobDetail.lightningMilliseconds}) | ${detail.jobDetail.chakraStacks} | ${detail.jobDetail.lightningTimerFrozen.toString()}`;
        else if (detail.job === 'PGL' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.lightningStacks} (${detail.jobDetail.lightningMilliseconds})`;
        else if (detail.job === 'MCH' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.heat} (${detail.jobDetail.overheatMilliseconds}) | ${detail.jobDetail.battery} (${detail.jobDetail.batteryMilliseconds}) | last: ${detail.jobDetail.lastBatteryAmount} | ${detail.jobDetail.overheatActive.toString()} | ${detail.jobDetail.robotActive.toString()}`;
        else if (detail.job === 'SAM' && detail.jobDetail)
            jobInfo.innerText = `${detail.jobDetail.kenki} | ${detail.jobDetail.meditationStacks}(${detail.jobDetail.setsu.toString()},${detail.jobDetail.getsu.toString()},${detail.jobDetail.ka.toString()})`;
        else
            jobInfo.innerText = '';
    }
    const pos = document.getElementById('pos');
    if (pos)
        pos.innerText = `${e.detail.pos.x.toFixed(2)},${e.detail.pos.y.toFixed(2)},${e.detail.pos.z.toFixed(2)}`;
    const rotation = document.getElementById('rotation');
    if (rotation)
        rotation.innerText = e.detail.rotation.toString();
    const bait = document.getElementById('bait');
    if (bait)
        bait.innerText = e.detail.bait.toString();
});
addOverlayListener('EnmityTargetData', (e) => {
    const target = document.getElementById('target');
    if (target)
        target.innerText = e.Target ? e.Target.Name : '--';
    const tid = document.getElementById('tid');
    if (tid)
        tid.innerText = e.Target ? e.Target.ID.toString(16) : '';
    const tdistance = document.getElementById('tdistance');
    if (tdistance)
        tdistance.innerText = e.Target ? e.Target.Distance.toString() : '';
});
addOverlayListener('onGameExistsEvent', (_e) => {
    // console.log("Game exists: " + e.detail.exists);
});
addOverlayListener('onGameActiveChangedEvent', (_e) => {
    // console.log("Game active: " + e.detail.active);
});
addOverlayListener('onLogEvent', (e) => {
    e.detail.logs.forEach((log) => {
        // Match "/echo tts:<stuff>"
        const r = /00:0038:tts:(.*)/.exec(log);
        if (r && r[1]) {
            void callOverlayHandler({
                call: 'cactbotSay',
                text: r[1],
            });
        }
    });
});
addOverlayListener('onUserFileChanged', (e) => {
    console.log(`User file ${e.file} changed!`);
});
addOverlayListener('FileChanged', (e) => {
    console.log(`File ${e.file} changed!`);
});
void callOverlayHandler({ call: 'cactbotRequestState' });

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWN0Ym90Ly4vcmVzb3VyY2VzL292ZXJsYXlfcGx1Z2luX2FwaS50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvdGVzdC90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMEJBQTBCO0FBaUQxQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFFbkIsSUFBSSxLQUFLLEdBQTJCLElBQUksQ0FBQztBQUN6QyxJQUFJLEVBQUUsR0FBcUIsSUFBSSxDQUFDO0FBQ2hDLElBQUksS0FBSyxHQUdJLEVBQUUsQ0FBQztBQUNoQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBNkMsRUFBRSxDQUFDO0FBRXRFLE1BQU0sV0FBVyxHQUFrQyxFQUFFLENBQUM7QUFFdEQsTUFBTSxXQUFXLEdBQUcsQ0FDaEIsR0FBNkIsRUFDN0IsRUFBc0MsRUFDbEMsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO1FBQ04sSUFBSSxLQUFLO1lBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLElBQUksS0FBSztZQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7WUFFdEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBc0IsR0FBK0IsRUFBUSxFQUFFO0lBQ2xGLElBQUksRUFBRSxDQUFDO0lBRVAsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxJ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LENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDN0Msa0RBQWtEO0FBQ3BELENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwRCxrREFBa0Q7QUFDcEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNyQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUM1Qiw0QkFBNEI7UUFDNUIsTUFBTSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNiLEtBQUssa0JBQWtCLENBQUM7Z0JBQ3RCLElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoidWkvdGVzdC90ZXN0LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE92ZXJsYXlQbHVnaW4gQVBJIHNldHVwXHJcblxyXG5pbXBvcnQgeyBFdmVudE1hcCwgRXZlbnRUeXBlLCBJT3ZlcmxheUhhbmRsZXIsIE92ZXJsYXlIYW5kbGVyRnVuY3MsIE92ZXJsYXlIYW5kbGVyVHlwZXMgfSBmcm9tICcuLi90eXBlcy9ldmVudCc7XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICBfX092ZXJsYXlDYWxsYmFjazogRXZlbnRNYXBbRXZlbnRUeXBlXTtcclxuICAgIGRpc3BhdGNoT3ZlcmxheUV2ZW50PzogdHlwZW9mIHByb2Nlc3NFdmVudDtcclxuICAgIE92ZXJsYXlQbHVnaW5BcGk6IHtcclxuICAgICAgcmVhZHk6IGJvb2xlYW47XHJcbiAgICAgIGNhbGxIYW5kbGVyOiAobXNnOiBzdHJpbmcsIGNiPzogKHZhbHVlOiBzdHJpbmcpID0+IHVua25vd24pID0+IHZvaWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxyXG4gICAgICpcclxuICAgICAqIEl0IGlzIHJlY29tbWVuZGVkIHRvIGltcG9ydCBmcm9tIHRoaXMgZmlsZTpcclxuICAgICAqXHJcbiAgICAgKiBgaW1wb3J0IHsgYWRkT3ZlcmxheUxpc3RlbmVyIH0gZnJvbSAnL3BhdGgvdG8vb3ZlcmxheV9wbHVnaW5fYXBpJztgXHJcbiAgICAgKi9cclxuICAgIGFkZE92ZXJsYXlMaXN0ZW5lcjogSUFkZE92ZXJsYXlMaXN0ZW5lcjtcclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgVGhpcyBpcyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cclxuICAgICAqXHJcbiAgICAgKiBJdCBpcyByZWNvbW1lbmRlZCB0byBpbXBvcnQgZnJvbSB0aGlzIGZpbGU6XHJcbiAgICAgKlxyXG4gICAgICogYGltcG9ydCB7IHJlbW92ZU92ZXJsYXlMaXN0ZW5lciB9IGZyb20gJy9wYXRoL3RvL292ZXJsYXlfcGx1Z2luX2FwaSc7YFxyXG4gICAgICovXHJcbiAgICByZW1vdmVPdmVybGF5TGlzdGVuZXI6IElSZW1vdmVPdmVybGF5TGlzdGVuZXI7XHJcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIFRoaXMgaXMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXHJcbiAgICAgKlxyXG4gICAgICogSXQgaXMgcmVjb21tZW5kZWQgdG8gaW1wb3J0IGZyb20gdGhpcyBmaWxlOlxyXG4gICAgICpcclxuICAgICAqIGBpbXBvcnQgeyBjYWxsT3ZlcmxheUhhbmRsZXIgfSBmcm9tICcvcGF0aC90by9vdmVybGF5X3BsdWdpbl9hcGknO2BcclxuICAgICAqL1xyXG4gICAgY2FsbE92ZXJsYXlIYW5kbGVyOiBJT3ZlcmxheUhhbmRsZXI7XHJcbiAgfVxyXG59XHJcblxyXG5cclxudHlwZSBJQWRkT3ZlcmxheUxpc3RlbmVyID0gPFQgZXh0ZW5kcyBFdmVudFR5cGU+KGV2ZW50OiBULCBjYjogRXZlbnRNYXBbVF0pID0+IHZvaWQ7XHJcbnR5cGUgSVJlbW92ZU92ZXJsYXlMaXN0ZW5lciA9IDxUIGV4dGVuZHMgRXZlbnRUeXBlPihldmVudDogVCwgY2I6IEV2ZW50TWFwW1RdKSA9PiB2b2lkO1xyXG5cclxudHlwZSBTdWJzY3JpYmVyPFQ+ID0ge1xyXG4gIFtrZXkgaW4gRXZlbnRUeXBlXT86IFRbXTtcclxufTtcclxudHlwZSBFdmVudFBhcmFtZXRlciA9IFBhcmFtZXRlcnM8RXZlbnRNYXBbRXZlbnRUeXBlXT5bMF07XHJcbnR5cGUgVm9pZEZ1bmM8VD4gPSAoLi4uYXJnczogVFtdKSA9PiB2b2lkO1xyXG5cclxubGV0IGluaXRlZCA9IGZhbHNlO1xyXG5cclxubGV0IHdzVXJsOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsID0gbnVsbDtcclxubGV0IHdzOiBXZWJTb2NrZXQgfCBudWxsID0gbnVsbDtcclxubGV0IHF1ZXVlOiAoXHJcbiAgeyBbczogc3RyaW5nXTogdW5rbm93biB9IHxcclxuICBbeyBbczogc3RyaW5nXTogdW5rbm93biB9LCAoKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiB1bmtub3duKSB8IHVuZGVmaW5lZF1cclxuKVtdIHwgbnVsbCA9IFtdO1xyXG5sZXQgcnNlcUNvdW50ZXIgPSAwO1xyXG5jb25zdCByZXNwb25zZVByb21pc2VzOiBSZWNvcmQ8bnVtYmVyLCAodmFsdWU6IHVua25vd24pID0+IHZvaWQ+ID0ge307XHJcblxyXG5jb25zdCBzdWJzY3JpYmVyczogU3Vic2NyaWJlcjxWb2lkRnVuYzx1bmtub3duPj4gPSB7fTtcclxuXHJcbmNvbnN0IHNlbmRNZXNzYWdlID0gKFxyXG4gICAgbXNnOiB7IFtzOiBzdHJpbmddOiB1bmtub3duIH0sXHJcbiAgICBjYj86ICh2YWx1ZTogc3RyaW5nIHwgbnVsbCkgPT4gdW5rbm93bixcclxuKTogdm9pZCA9PiB7XHJcbiAgaWYgKHdzKSB7XHJcbiAgICBpZiAocXVldWUpXHJcbiAgICAgIHF1ZXVlLnB1c2gobXNnKTtcclxuICAgIGVsc2VcclxuICAgICAgd3Muc2VuZChKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHF1ZXVlKVxyXG4gICAgICBxdWV1ZS5wdXNoKFttc2csIGNiXSk7XHJcbiAgICBlbHNlXHJcbiAgICAgIHdpbmRvdy5PdmVybGF5UGx1Z2luQXBpLmNhbGxIYW5kbGVyKEpTT04uc3RyaW5naWZ5KG1zZyksIGNiKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBwcm9jZXNzRXZlbnQgPSA8VCBleHRlbmRzIEV2ZW50VHlwZT4obXNnOiBQYXJhbWV0ZXJzPEV2ZW50TWFwW1RdPlswXSk6IHZvaWQgPT4ge1xyXG4gIGluaXQoKTtcclxuXHJcbiAgY29uc3Qgc3VicyA9IHN1YnNjcmliZXJzW21zZy50eXBlXTtcclxuICBzdWJzPy5mb3JFYWNoKChzdWIpID0+IHN1Yihtc2cpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkaXNwYXRjaE92ZXJsYXlFdmVudCA9IHByb2Nlc3NFdmVudDtcclxuXHJcbmV4cG9ydCBjb25zdCBhZGRPdmVybGF5TGlzdGVuZXI6IElBZGRPdmVybGF5TGlzdGVuZXIgPSAoZXZlbnQsIGNiKTogdm9pZCA9PiB7XHJcbiAgaW5pdCgpO1xyXG5cclxuICBpZiAoIXN1YnNjcmliZXJzW2V2ZW50XSkge1xyXG4gICAgc3Vic2NyaWJlcnNbZXZlbnRdID0gW107XHJcblxyXG4gICAgaWYgKCFxdWV1ZSkge1xyXG4gICAgICBzZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgY2FsbDogJ3N1YnNjcmliZScsXHJcbiAgICAgICAgZXZlbnRzOiBbZXZlbnRdLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZXJzW2V2ZW50XT8ucHVzaChjYiBhcyBWb2lkRnVuYzx1bmtub3duPik7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlT3ZlcmxheUxpc3RlbmVyOiBJUmVtb3ZlT3ZlcmxheUxpc3RlbmVyID0gKGV2ZW50LCBjYik6IHZvaWQgPT4ge1xyXG4gIGluaXQoKTtcclxuXHJcbiAgaWYgKHN1YnNjcmliZXJzW2V2ZW50XSkge1xyXG4gICAgY29uc3QgbGlzdCA9IHN1YnNjcmliZXJzW2V2ZW50XTtcclxuICAgIGNvbnN0IHBvcyA9IGxpc3Q/LmluZGV4T2YoY2IgYXMgVm9pZEZ1bmM8dW5rbm93bj4pO1xyXG5cclxuICAgIGlmIChwb3MgJiYgcG9zID4gLTEpXHJcbiAgICAgIGxpc3Q/LnNwbGljZShwb3MsIDEpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNhbGxPdmVybGF5SGFuZGxlckludGVybmFsOiBJT3ZlcmxheUhhbmRsZXIgPSAoXHJcbiAgICBfbXNnOiB7IFtzOiBzdHJpbmddOiB1bmtub3duIH0sXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4pOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gIGluaXQoKTtcclxuXHJcbiAgY29uc3QgbXNnID0ge1xyXG4gICAgLi4uX21zZyxcclxuICAgIHJzZXE6IDAsXHJcbiAgfTtcclxuICBsZXQgcDogUHJvbWlzZTx1bmtub3duPjtcclxuXHJcbiAgaWYgKHdzKSB7XHJcbiAgICBtc2cucnNlcSA9IHJzZXFDb3VudGVyKys7XHJcbiAgICBwID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgcmVzcG9uc2VQcm9taXNlc1ttc2cucnNlcV0gPSByZXNvbHZlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2VuZE1lc3NhZ2UobXNnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIHNlbmRNZXNzYWdlKG1zZywgKGRhdGEpID0+IHtcclxuICAgICAgICByZXNvbHZlKGRhdGEgPT09IG51bGwgPyBudWxsIDogSlNPTi5wYXJzZShkYXRhKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcDtcclxufTtcclxuXHJcbnR5cGUgT3ZlcnJpZGVNYXAgPSB7IFtjYWxsIGluIE92ZXJsYXlIYW5kbGVyVHlwZXNdPzogT3ZlcmxheUhhbmRsZXJGdW5jc1tjYWxsXSB9O1xyXG5jb25zdCBjYWxsT3ZlcmxheUhhbmRsZXJPdmVycmlkZU1hcDogT3ZlcnJpZGVNYXAgPSB7fTtcclxuXHJcbmV4cG9ydCBjb25zdCBjYWxsT3ZlcmxheUhhbmRsZXI6IElPdmVybGF5SGFuZGxlciA9IChcclxuICAgIF9tc2c6IHsgW3M6IHN0cmluZ106IHVua25vd24gfSxcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbik6IFByb21pc2U8YW55PiA9PiB7XHJcbiAgaW5pdCgpO1xyXG5cclxuICAvLyBJZiB0aGlzIGBhc2AgaXMgaW5jb3JyZWN0LCB0aGVuIGl0IHdpbGwgbm90IGZpbmQgYW4gb3ZlcnJpZGUuXHJcbiAgLy8gVE9ETzogd2UgY291bGQgYWxzbyByZXBsYWNlIHRoaXMgd2l0aCBhIHR5cGUgZ3VhcmQuXHJcbiAgY29uc3QgdHlwZSA9IF9tc2cuY2FsbCBhcyBrZXlvZiBPdmVycmlkZU1hcDtcclxuICBjb25zdCBjYWxsRnVuYyA9IGNhbGxPdmVybGF5SGFuZGxlck92ZXJyaWRlTWFwW3R5cGVdID8/IGNhbGxPdmVybGF5SGFuZGxlckludGVybmFsO1xyXG5cclxuICAvLyBUaGUgYElPdmVybGF5SGFuZGxlcmAgdHlwZSBndWFyYW50ZWVzIHRoYXQgcGFyYW1ldGVycy9yZXR1cm4gdHlwZSBtYXRjaFxyXG4gIC8vIG9uZSBvZiB0aGUgb3ZlcmxheSBoYW5kbGVycy4gIFRoZSBPdmVycmlkZU1hcCBhbHNvIG9ubHkgc3RvcmVzIGZ1bmN0aW9uc1xyXG4gIC8vIHRoYXQgbWF0Y2ggYnkgdGhlIGRpc2NyaW1pbmF0aW5nIGBjYWxsYCBmaWVsZCwgYW5kIHNvIGFueSBvdmVycmlkZXNcclxuICAvLyBzaG91bGQgYmUgY29ycmVjdCBoZXJlLlxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnksQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hcmd1bWVudFxyXG4gIHJldHVybiBjYWxsRnVuYyhfbXNnIGFzIGFueSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0T3ZlcmxheUhhbmRsZXJPdmVycmlkZSA9IDxUIGV4dGVuZHMga2V5b2YgT3ZlcmxheUhhbmRsZXJGdW5jcz4oXHJcbiAgdHlwZTogVCwgb3ZlcnJpZGU/OiBPdmVybGF5SGFuZGxlckZ1bmNzW1RdKTogdm9pZCA9PiB7XHJcbiAgaWYgKCFvdmVycmlkZSkge1xyXG4gICAgZGVsZXRlIGNhbGxPdmVybGF5SGFuZGxlck92ZXJyaWRlTWFwW3R5cGVdO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjYWxsT3ZlcmxheUhhbmRsZXJPdmVycmlkZU1hcFt0eXBlXSA9IG92ZXJyaWRlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgaWYgKGluaXRlZClcclxuICAgIHJldHVybjtcclxuXHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB3c1VybCA9IC9bXFw/Jl1PVkVSTEFZX1dTPShbXiZdKykvLmV4ZWMod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgaWYgKHdzVXJsKSB7XHJcbiAgICAgIGNvbnN0IGNvbm5lY3RXcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHdzID0gbmV3IFdlYlNvY2tldCh3c1VybD8uWzFdIGFzIHN0cmluZyk7XHJcblxyXG4gICAgICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGVkIScpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHEgPSBxdWV1ZSA/PyBbXTtcclxuICAgICAgICAgIHF1ZXVlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICBzZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIGNhbGw6ICdzdWJzY3JpYmUnLFxyXG4gICAgICAgICAgICBldmVudHM6IE9iamVjdC5rZXlzKHN1YnNjcmliZXJzKSxcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGZvciAoY29uc3QgbXNnIG9mIHEpIHtcclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1zZykpXHJcbiAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UobXNnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChfbXNnKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9tc2cuZGF0YSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIG1lc3NhZ2UgZGF0YSByZWNlaXZlZDogJywgX21zZyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UoX21zZy5kYXRhKSBhcyBFdmVudFBhcmFtZXRlciAmIHsgcnNlcT86IG51bWJlciB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKG1zZy5yc2VxICE9PSB1bmRlZmluZWQgJiYgcmVzcG9uc2VQcm9taXNlc1ttc2cucnNlcV0pIHtcclxuICAgICAgICAgICAgICByZXNwb25zZVByb21pc2VzW21zZy5yc2VxXT8uKG1zZyk7XHJcbiAgICAgICAgICAgICAgZGVsZXRlIHJlc3BvbnNlUHJvbWlzZXNbbXNnLnJzZXFdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHByb2Nlc3NFdmVudChtc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgbWVzc2FnZSByZWNlaXZlZDogJywgX21zZyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd3MuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICBxdWV1ZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RyeWluZyB0byByZWNvbm5lY3QuLi4nKTtcclxuICAgICAgICAgIC8vIERvbid0IHNwYW0gdGhlIHNlcnZlciB3aXRoIHJldHJpZXMuXHJcbiAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbm5lY3RXcygpO1xyXG4gICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbm5lY3RXcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgd2FpdEZvckFwaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghd2luZG93Lk92ZXJsYXlQbHVnaW5BcGkgfHwgIXdpbmRvdy5PdmVybGF5UGx1Z2luQXBpLnJlYWR5KSB7XHJcbiAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCh3YWl0Rm9yQXBpLCAzMDApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcSA9IHF1ZXVlID8/IFtdO1xyXG4gICAgICAgIHF1ZXVlID0gbnVsbDtcclxuXHJcbiAgICAgICAgd2luZG93Ll9fT3ZlcmxheUNhbGxiYWNrID0gcHJvY2Vzc0V2ZW50O1xyXG5cclxuICAgICAgICBzZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICBjYWxsOiAnc3Vic2NyaWJlJyxcclxuICAgICAgICAgIGV2ZW50czogT2JqZWN0LmtleXMoc3Vic2NyaWJlcnMpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcSkge1xyXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpXHJcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlKGl0ZW1bMF0sIGl0ZW1bMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHdhaXRGb3JBcGkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIZXJlIHRoZSBPdmVybGF5UGx1Z2luIEFQSSBpcyByZWdpc3RlcmVkIHRvIHRoZSB3aW5kb3cgb2JqZWN0LFxyXG4gICAgLy8gYnV0IHRoaXMgaXMgbWFpbmx5IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5Gb3IgY2FjdGJvdCdzIGJ1aWx0LWluIGZpbGVzLFxyXG4gICAgLy8gaXQgaXMgcmVjb21tZW5kZWQgdG8gdXNlIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucyBleHBvcnRlZCBpbiByZXNvdXJjZXMvb3ZlcmxheV9wbHVnaW5fYXBpLnRzLlxyXG4gICAgd2luZG93LmFkZE92ZXJsYXlMaXN0ZW5lciA9IGFkZE92ZXJsYXlMaXN0ZW5lcjtcclxuICAgIHdpbmRvdy5yZW1vdmVPdmVybGF5TGlzdGVuZXIgPSByZW1vdmVPdmVybGF5TGlzdGVuZXI7XHJcbiAgICB3aW5kb3cuY2FsbE92ZXJsYXlIYW5kbGVyID0gY2FsbE92ZXJsYXlIYW5kbGVyO1xyXG4gICAgd2luZG93LmRpc3BhdGNoT3ZlcmxheUV2ZW50ID0gZGlzcGF0Y2hPdmVybGF5RXZlbnQ7XHJcbiAgfVxyXG5cclxuICBpbml0ZWQgPSB0cnVlO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBjYWxsT3ZlcmxheUhhbmRsZXIsIGFkZE92ZXJsYXlMaXN0ZW5lciB9IGZyb20gJy4uLy4uL3Jlc291cmNlcy9vdmVybGF5X3BsdWdpbl9hcGknO1xyXG5cclxuaW1wb3J0ICcuLi8uLi9yZXNvdXJjZXMvZGVmYXVsdHMuY3NzJztcclxuXHJcbmFkZE92ZXJsYXlMaXN0ZW5lcignQ2hhbmdlWm9uZScsIChlKSA9PiB7XHJcbiAgY29uc3QgY3VycmVudFpvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudFpvbmUnKTtcclxuICBpZiAoY3VycmVudFpvbmUpXHJcbiAgICBjdXJyZW50Wm9uZS5pbm5lclRleHQgPSBgY3VycmVudFpvbmU6ICR7ZS56b25lTmFtZX0gKCR7ZS56b25lSUR9KWA7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdvbkluQ29tYmF0Q2hhbmdlZEV2ZW50JywgKGUpID0+IHtcclxuICBjb25zdCBpbkNvbWJhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbkNvbWJhdCcpO1xyXG4gIGlmIChpbkNvbWJhdClcclxuICAgIGluQ29tYmF0LmlubmVyVGV4dCA9IGBpbkNvbWJhdDogYWN0OiAke2UuZGV0YWlsLmluQUNUQ29tYmF0ID8gJ3llcycgOiAnbm8nfSBnYW1lOiAkeyhlLmRldGFpbC5pbkdhbWVDb21iYXQgPyAneWVzJyA6ICdubycpfWA7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdvblBsYXllckNoYW5nZWRFdmVudCcsIChlKSA9PiB7XHJcbiAgY29uc3QgaHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaHAnKTtcclxuICBpZiAoaHApXHJcbiAgICBocC5pbm5lclRleHQgPSBgJHtlLmRldGFpbC5jdXJyZW50SFB9LyR7ZS5kZXRhaWwubWF4SFB9ICgke2UuZGV0YWlsLmN1cnJlbnRTaGllbGR9KWA7XHJcbiAgY29uc3QgbXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXAnKTtcclxuICBpZiAobXApXHJcbiAgICBtcC5pbm5lclRleHQgPSBgJHtlLmRldGFpbC5jdXJyZW50TVB9LyR7ZS5kZXRhaWwubWF4TVB9YDtcclxuICBjb25zdCBjcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcCcpO1xyXG4gIGlmIChjcClcclxuICAgIGNwLmlubmVyVGV4dCA9IGAke2UuZGV0YWlsLmN1cnJlbnRDUH0vJHtlLmRldGFpbC5tYXhDUH1gO1xyXG4gIGNvbnN0IGdwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dwJyk7XHJcbiAgaWYgKGdwKVxyXG4gICAgZ3AuaW5uZXJUZXh0ID0gYCR7ZS5kZXRhaWwuY3VycmVudEdQfS8ke2UuZGV0YWlsLm1heEdQfWA7XHJcbiAgY29uc3Qgam9iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvYicpO1xyXG4gIGlmIChqb2IpXHJcbiAgICBqb2IuaW5uZXJUZXh0ID0gYCR7ZS5kZXRhaWwubGV2ZWx9ICR7ZS5kZXRhaWwuam9ifWA7XHJcbiAgY29uc3QgZGVidWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVidWcnKTtcclxuICBpZiAoZGVidWcpXHJcbiAgICBkZWJ1Zy5pbm5lclRleHQgPSBlLmRldGFpbC5kZWJ1Z0pvYjtcclxuXHJcbiAgY29uc3Qgam9iSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqb2JpbmZvJyk7XHJcbiAgaWYgKGpvYkluZm8pIHtcclxuICAgIGNvbnN0IGRldGFpbCA9IGUuZGV0YWlsO1xyXG4gICAgaWYgKGRldGFpbC5qb2IgPT09ICdSRE0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC53aGl0ZU1hbmF9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmJsYWNrTWFuYX1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1dBUicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBkZXRhaWwuam9iRGV0YWlsLmJlYXN0LnRvU3RyaW5nKCk7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnRFJLJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwuYmxvb2R9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmRhcmtzaWRlTWlsbGlzZWNvbmRzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5kYXJrQXJ0cy50b1N0cmluZygpfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5saXZpbmdTaGFkb3dNaWxsaXNlY29uZHN9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdHTkInICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5jYXJ0cmlkZ2VzfSR7ZGV0YWlsLmpvYkRldGFpbC5jb250aW51YXRpb25TdGF0ZX1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1BMRCcgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBkZXRhaWwuam9iRGV0YWlsLm9hdGgudG9TdHJpbmcoKTtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdCUkQnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5zb25nTmFtZX0gfCAke2RldGFpbC5qb2JEZXRhaWwuc29uZ1Byb2NzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5zb3VsR2F1Z2V9IHwgJHtkZXRhaWwuam9iRGV0YWlsLnNvbmdNaWxsaXNlY29uZHN9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdETkMnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5mZWF0aGVyc30gfCAke2RldGFpbC5qb2JEZXRhaWwuZXNwcml0fSB8IFske2RldGFpbC5qb2JEZXRhaWwuc3RlcHMuam9pbignLCAnKX1dIHwgJHtkZXRhaWwuam9iRGV0YWlsLmN1cnJlbnRTdGVwfWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnTklOJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwuaHV0b25NaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLm5pbmtpQW1vdW50fWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnRFJHJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwuYmxvb2RNaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmxpZmVNaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmV5ZXNBbW91bnR9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdCTE0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC51bWJyYWxTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwudW1icmFsTWlsbGlzZWNvbmRzfSkgfCAke2RldGFpbC5qb2JEZXRhaWwudW1icmFsSGVhcnRzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5mb3VsQ291bnR9ICR7ZGV0YWlsLmpvYkRldGFpbC5lbm9jaGlhbi50b1N0cmluZygpfSAoJHtkZXRhaWwuam9iRGV0YWlsLm5leHRQb2x5Z2xvdE1pbGxpc2Vjb25kc30pYDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdUSE0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC51bWJyYWxTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwudW1icmFsTWlsbGlzZWNvbmRzfSlgO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1dITScgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmxpbHlTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwubGlseU1pbGxpc2Vjb25kc30pIHwgJHtkZXRhaWwuam9iRGV0YWlsLmJsb29kbGlseVN0YWNrc31gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1NNTicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmRyZWFkd3lybVN0YWNrc30gfCAke2RldGFpbC5qb2JEZXRhaWwuYmFoYW11dFN0YW5jZX0gfCAke2RldGFpbC5qb2JEZXRhaWwuYmFoYW11dFN1bW1vbmVkfSAoJHtkZXRhaWwuam9iRGV0YWlsLnN0YW5jZU1pbGxpc2Vjb25kc30pIHwgJHtkZXRhaWwuam9iRGV0YWlsLnBob2VuaXhSZWFkeX1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1NDSCcgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5R2F1Z2V9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5U3RhdHVzfSAoJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5TWlsbGlzZWNvbmRzfSlgO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ0FDTicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3MudG9TdHJpbmcoKTtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdBU1QnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5oZWxkQ2FyZH0gWyR7ZGV0YWlsLmpvYkRldGFpbC5hcmNhbnVtcy5qb2luKCcsICcpfV1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ01OSycgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmxpZ2h0bmluZ1N0YWNrc30gKCR7ZGV0YWlsLmpvYkRldGFpbC5saWdodG5pbmdNaWxsaXNlY29uZHN9KSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5jaGFrcmFTdGFja3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmxpZ2h0bmluZ1RpbWVyRnJvemVuLnRvU3RyaW5nKCl9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdQR0wnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5saWdodG5pbmdTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwubGlnaHRuaW5nTWlsbGlzZWNvbmRzfSlgO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ01DSCcgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmhlYXR9ICgke2RldGFpbC5qb2JEZXRhaWwub3ZlcmhlYXRNaWxsaXNlY29uZHN9KSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5iYXR0ZXJ5fSAoJHtkZXRhaWwuam9iRGV0YWlsLmJhdHRlcnlNaWxsaXNlY29uZHN9KSB8IGxhc3Q6ICR7ZGV0YWlsLmpvYkRldGFpbC5sYXN0QmF0dGVyeUFtb3VudH0gfCAke2RldGFpbC5qb2JEZXRhaWwub3ZlcmhlYXRBY3RpdmUudG9TdHJpbmcoKX0gfCAke2RldGFpbC5qb2JEZXRhaWwucm9ib3RBY3RpdmUudG9TdHJpbmcoKX1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1NBTScgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmtlbmtpfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5tZWRpdGF0aW9uU3RhY2tzfSgke2RldGFpbC5qb2JEZXRhaWwuc2V0c3UudG9TdHJpbmcoKX0sJHtkZXRhaWwuam9iRGV0YWlsLmdldHN1LnRvU3RyaW5nKCl9LCR7ZGV0YWlsLmpvYkRldGFpbC5rYS50b1N0cmluZygpfSlgO1xyXG4gICAgZWxzZVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9ICcnO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcG9zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcycpO1xyXG4gIGlmIChwb3MpXHJcbiAgICBwb3MuaW5uZXJUZXh0ID0gYCR7ZS5kZXRhaWwucG9zLngudG9GaXhlZCgyKX0sJHtlLmRldGFpbC5wb3MueS50b0ZpeGVkKDIpfSwke2UuZGV0YWlsLnBvcy56LnRvRml4ZWQoMil9YDtcclxuICBjb25zdCByb3RhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3RhdGlvbicpO1xyXG4gIGlmIChyb3RhdGlvbilcclxuICAgIHJvdGF0aW9uLmlubmVyVGV4dCA9IGUuZGV0YWlsLnJvdGF0aW9uLnRvU3RyaW5nKCk7XHJcbiAgY29uc3QgYmFpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWl0Jyk7XHJcbiAgaWYgKGJhaXQpXHJcbiAgICBiYWl0LmlubmVyVGV4dCA9IGUuZGV0YWlsLmJhaXQudG9TdHJpbmcoKTtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ0VubWl0eVRhcmdldERhdGEnLCAoZSkgPT4ge1xyXG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXJnZXQnKTtcclxuICBpZiAodGFyZ2V0KVxyXG4gICAgdGFyZ2V0LmlubmVyVGV4dCA9IGUuVGFyZ2V0ID8gZS5UYXJnZXQuTmFtZSA6ICctLSc7XHJcbiAgY29uc3QgdGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpZCcpO1xyXG4gIGlmICh0aWQpXHJcbiAgICB0aWQuaW5uZXJUZXh0ID0gZS5UYXJnZXQgPyBlLlRhcmdldC5JRC50b1N0cmluZygxNikgOiAnJztcclxuICBjb25zdCB0ZGlzdGFuY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGRpc3RhbmNlJyk7XHJcbiAgaWYgKHRkaXN0YW5jZSlcclxuICAgIHRkaXN0YW5jZS5pbm5lclRleHQgPSBlLlRhcmdldCA/IGUuVGFyZ2V0LkRpc3RhbmNlLnRvU3RyaW5nKCkgOiAnJztcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ29uR2FtZUV4aXN0c0V2ZW50JywgKF9lKSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJHYW1lIGV4aXN0czogXCIgKyBlLmRldGFpbC5leGlzdHMpO1xyXG59KTtcclxuXHJcbmFkZE92ZXJsYXlMaXN0ZW5lcignb25HYW1lQWN0aXZlQ2hhbmdlZEV2ZW50JywgKF9lKSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJHYW1lIGFjdGl2ZTogXCIgKyBlLmRldGFpbC5hY3RpdmUpO1xyXG59KTtcclxuXHJcbmFkZE92ZXJsYXlMaXN0ZW5lcignb25Mb2dFdmVudCcsIChlKSA9PiB7XHJcbiAgZS5kZXRhaWwubG9ncy5mb3JFYWNoKChsb2cpID0+IHtcclxuICAgIC8vIE1hdGNoIFwiL2VjaG8gdHRzOjxzdHVmZj5cIlxyXG4gICAgY29uc3QgciA9IC8wMDowMDM4OnR0czooLiopLy5leGVjKGxvZyk7XHJcbiAgICBpZiAociAmJiByWzFdKSB7XHJcbiAgICAgIHZvaWQgY2FsbE92ZXJsYXlIYW5kbGVyKHtcclxuICAgICAgICBjYWxsOiAnY2FjdGJvdFNheScsXHJcbiAgICAgICAgdGV4dDogclsxXSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdvblVzZXJGaWxlQ2hhbmdlZCcsIChlKSA9PiB7XHJcbiAgY29uc29sZS5sb2coYFVzZXIgZmlsZSAke2UuZmlsZX0gY2hhbmdlZCFgKTtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ0ZpbGVDaGFuZ2VkJywgKGUpID0+IHtcclxuICBjb25zb2xlLmxvZyhgRmlsZSAke2UuZmlsZX0gY2hhbmdlZCFgKTtcclxufSk7XHJcblxyXG52b2lkIGNhbGxPdmVybGF5SGFuZGxlcih7IGNhbGw6ICdjYWN0Ym90UmVxdWVzdFN0YXRlJyB9KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==