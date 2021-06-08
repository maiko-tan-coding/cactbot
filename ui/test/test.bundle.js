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
let callOverlayHandlerOverride;
const callOverlayHandler = (_msg) => {
    init();
    if (callOverlayHandlerOverride) {
        return callOverlayHandlerOverride(_msg);
    }
    return callOverlayHandlerInternal(_msg);
};
const setCallOverlayHandlerOverride = (override) => {
    callOverlayHandlerOverride = override;
    return callOverlayHandlerInternal;
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
                    setTimeout(() => {
                        connectWs();
                    }, 300);
                });
            };
            connectWs();
        }
        else {
            const waitForApi = function () {
                if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
                    setTimeout(waitForApi, 300);
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
        const jobDetail = e.detail.jobDetail;
        if (e.detail.job === 'RDM')
            jobInfo.innerText = `${jobDetail.whiteMana} | ${jobDetail.blackMana}`;
        else if (e.detail.job === 'WAR')
            jobInfo.innerText = jobDetail.beast.toString();
        else if (e.detail.job === 'DRK')
            jobInfo.innerText = `${jobDetail.blood} | ${jobDetail.darksideMilliseconds} | ${jobDetail.darkArts.toString()} | ${jobDetail.livingShadowMilliseconds}`;
        else if (e.detail.job === 'GNB')
            jobInfo.innerText = `${jobDetail.cartridges}${jobDetail.continuationState}`;
        else if (e.detail.job === 'PLD')
            jobInfo.innerText = jobDetail.oath.toString();
        else if (e.detail.job === 'BRD')
            jobInfo.innerText = `${jobDetail.songName} | ${jobDetail.songProcs} | ${jobDetail.soulGauge} | ${jobDetail.songMilliseconds}`;
        else if (e.detail.job === 'DNC')
            jobInfo.innerText = `${jobDetail.feathers} | ${jobDetail.esprit} | (${jobDetail.steps}) | ${jobDetail.currentStep}`;
        else if (e.detail.job === 'NIN')
            jobInfo.innerText = `${jobDetail.hutonMilliseconds} | ${jobDetail.ninkiAmount}`;
        else if (e.detail.job === 'DRG')
            jobInfo.innerText = `${jobDetail.bloodMilliseconds} | ${jobDetail.lifeMilliseconds} | ${jobDetail.eyesAmount}`;
        else if (e.detail.job === 'BLM')
            jobInfo.innerText = `${jobDetail.umbralStacks} (${jobDetail.umbralMilliseconds}) | ${jobDetail.umbralHearts} | ${jobDetail.foulCount} ${jobDetail.enochian.toString()} (${jobDetail.nextPolyglotMilliseconds})`;
        else if (e.detail.job === 'THM')
            jobInfo.innerText = `${jobDetail.umbralStacks} (${jobDetail.umbralMilliseconds})`;
        else if (e.detail.job === 'WHM')
            jobInfo.innerText = `${jobDetail.lilyStacks} (${jobDetail.lilyMilliseconds}) | ${jobDetail.bloodlilyStacks}`;
        else if (e.detail.job === 'SMN')
            jobInfo.innerText = `${jobDetail.aetherflowStacks} | ${jobDetail.dreadwyrmStacks} | ${jobDetail.bahamutStance} | ${jobDetail.bahamutSummoned} (${jobDetail.stanceMilliseconds}) | ${jobDetail.phoenixReady}`;
        else if (e.detail.job === 'SCH')
            jobInfo.innerText = `${jobDetail.aetherflowStacks} | ${jobDetail.fairyGauge} | ${jobDetail.fairyStatus} (${jobDetail.fairyMilliseconds})`;
        else if (e.detail.job === 'ACN')
            jobInfo.innerText = jobDetail.aetherflowStacks.toString();
        else if (e.detail.job === 'AST')
            jobInfo.innerText = `${jobDetail.heldCard} (${jobDetail.arcanums})`;
        else if (e.detail.job === 'MNK')
            jobInfo.innerText = `${jobDetail.lightningStacks} (${jobDetail.lightningMilliseconds}) | ${jobDetail.chakraStacks} | ${jobDetail.lightningTimerFrozen.toString()}`;
        else if (e.detail.job === 'PGL')
            jobInfo.innerText = `${jobDetail.lightningStacks} (${jobDetail.lightningMilliseconds})`;
        else if (e.detail.job === 'MCH')
            jobInfo.innerText = `${jobDetail.heat} (${jobDetail.overheatMilliseconds}) | ${jobDetail.battery} (${jobDetail.batteryMilliseconds}) | last: ${jobDetail.lastBatteryAmount} | ${jobDetail.overheatActive.toString()} | ${jobDetail.robotActive.toString()}`;
        else if (e.detail.job === 'SAM')
            jobInfo.innerText = `${jobDetail.kenki} | ${jobDetail.meditationStacks}(${jobDetail.setsu.toString()},${jobDetail.getsu.toString()},${jobDetail.ka.toString()})`;
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