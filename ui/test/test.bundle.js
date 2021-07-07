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
            jobInfo.innerText = `${detail.jobDetail.feathers} | ${detail.jobDetail.esprit} | (${detail.jobDetail.steps}) | ${detail.jobDetail.currentStep}`;
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
            jobInfo.innerText = `${detail.jobDetail.heldCard} (${detail.jobDetail.arcanums})`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWN0Ym90Ly4vcmVzb3VyY2VzL292ZXJsYXlfcGx1Z2luX2FwaS50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvdGVzdC90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMEJBQTBCO0FBaUQxQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFFbkIsSUFBSSxLQUFLLEdBQTJCLElBQUksQ0FBQztBQUN6QyxJQUFJLEVBQUUsR0FBcUIsSUFBSSxDQUFDO0FBQ2hDLElBQUksS0FBSyxHQUdJLEVBQUUsQ0FBQztBQUNoQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBNkMsRUFBRSxDQUFDO0FBRXRFLE1BQU0sV0FBVyxHQUFrQyxFQUFFLENBQUM7QUFFdEQsTUFBTSxXQUFXLEdBQUcsQ0FDaEIsR0FBNkIsRUFDN0IsRUFBc0MsRUFDbEMsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO1FBQ04sSUFBSSxLQUFLO1lBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLElBQUksS0FBSztZQUNQLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7WUFFdEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBc0IsR0FBK0IsRUFBUSxFQUFFO0lBQ2xGLElBQUksRUFBRSxDQUFDO0lBRVAsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbkMsQ0FBQyxDQUFDO0FBRUssTUFBTSxvQkFBb0IsR0FBRyxZQUFZLENBQUM7QUFFMUMsTUFBTSxrQkFBa0IsR0FBd0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFRLEVBQUU7O0lBQ3pFLElBQUksRUFBRSxDQUFDO0lBRVAsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QixXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXhCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixXQUFXLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQzthQUNoQixDQUFDLENBQUM7U0FDSjtLQUNGO0lBRUQsaUJBQVcsQ0FBQyxLQUFLLENBQUMsMENBQUUsSUFBSSxDQUFDLEVBQXVCLEVBQUU7QUFDcEQsQ0FBQyxDQUFDO0FBRUssTUFBTSxxQkFBcUIsR0FBMkIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFRLEVBQUU7SUFDL0UsSUFBSSxFQUFFLENBQUM7SUFFUCxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sQ0FBQyxFQUF1QixDQUFDLENBQUM7UUFFbkQsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUU7S0FDeEI7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLDBCQUEwQixHQUFvQixDQUNoRCxJQUE4QixFQUVsQixFQUFFO0lBQ2hCLElBQUksRUFBRSxDQUFDO0lBRVAsTUFBTSxHQUFHLEdBQUc7UUFDVixHQUFHLElBQUk7UUFDUCxJQUFJLEVBQUUsQ0FBQztLQUNSLENBQUM7SUFDRixJQUFJLENBQW1CLENBQUM7SUFFeEIsSUFBSSxFQUFFLEVBQUU7UUFDTixHQUFHLENBQUMsSUFBSSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBQ3pCLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEI7U0FBTTtRQUNMLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFDO0FBR0YsTUFBTSw2QkFBNkIsR0FBZ0IsRUFBRSxDQUFDO0FBRS9DLE1BQU0sa0JBQWtCLEdBQW9CLENBQy9DLElBQThCLEVBRWxCLEVBQUU7O0lBQ2hCLElBQUksRUFBRSxDQUFDO0lBRVAsZ0VBQWdFO0lBQ2hFLHNEQUFzRDtJQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBeUIsQ0FBQztJQUM1QyxNQUFNLFFBQVEsU0FBRyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsbUNBQUksMEJBQTBCLENBQUM7SUFFbkYsMEVBQTBFO0lBQzFFLDJFQUEyRTtJQUMzRSxzRUFBc0U7SUFDdEUsMEJBQTBCO0lBQzFCLG1DQUFtQztJQUNuQyxvR0FBb0c7SUFDcEcsT0FBTyxRQUFRLENBQUMsSUFBVyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBRUssTUFBTSx5QkFBeUIsR0FBRyxDQUN2QyxJQUFPLEVBQUUsUUFBaUMsRUFBUSxFQUFFO0lBQ3BELElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDYixPQUFPLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE9BQU87S0FDUjtJQUNELDZCQUE2QixDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUNqRCxDQUFDLENBQUM7QUFFSyxNQUFNLElBQUksR0FBRyxHQUFTLEVBQUU7SUFDN0IsSUFBSSxNQUFNO1FBQ1IsT0FBTztJQUVULElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1FBQ2pDLEtBQUssR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sU0FBUyxHQUFHO2dCQUNoQixFQUFFLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFHLENBQUMsQ0FBVyxDQUFDLENBQUM7Z0JBRXpDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDakMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRTFCLE1BQU0sQ0FBQyxHQUFHLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLEVBQUUsQ0FBQztvQkFDdEIsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFFYixXQUFXLENBQUM7d0JBQ1YsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDakMsQ0FBQyxDQUFDO29CQUVILEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFO3dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7NEJBQ3JCLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDcEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFOztvQkFDdEMsSUFBSTt3QkFDRixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7NEJBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ3ZELE9BQU87eUJBQ1I7d0JBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUF1QyxDQUFDO3dCQUV4RSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDeEQsc0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQywrQ0FBMUIsZ0JBQWdCLEVBQWEsR0FBRyxFQUFFOzRCQUNsQyxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDbkM7NkJBQU07NEJBQ0wsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNuQjtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNsRCxPQUFPO3FCQUNSO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNoQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUViLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDdEMsc0NBQXNDO29CQUN0QyxVQUFVLENBQUMsR0FBRyxFQUFFO3dCQUNkLFNBQVMsRUFBRSxDQUFDO29CQUNkLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDVixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUVGLFNBQVMsRUFBRSxDQUFDO1NBQ2I7YUFBTTtZQUNMLE1BQU0sVUFBVSxHQUFHO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtvQkFDOUQsVUFBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUIsT0FBTztpQkFDUjtnQkFFRCxNQUFNLENBQUMsR0FBRyxLQUFLLGFBQUwsS0FBSyxjQUFMLEtBQUssR0FBSSxFQUFFLENBQUM7Z0JBQ3RCLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBRWIsTUFBTSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQztnQkFFeEMsV0FBVyxDQUFDO29CQUNWLElBQUksRUFBRSxXQUFXO29CQUNqQixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQ2pDLENBQUMsQ0FBQztnQkFFSCxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDckIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakM7WUFDSCxDQUFDLENBQUM7WUFFRixVQUFVLEVBQUUsQ0FBQztTQUNkO1FBRUQsaUVBQWlFO1FBQ2pFLCtFQUErRTtRQUMvRSw4RkFBOEY7UUFDOUYsTUFBTSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBQy9DLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztRQUNyRCxNQUFNLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDL0MsTUFBTSxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0tBQ3BEO0lBRUQsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7OztBQ3RSMEY7QUFFdEQ7QUFFdEMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDckMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzRCxJQUFJLFdBQVc7UUFDYixXQUFXLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUN2RSxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDakQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxJQUFJLFFBQVE7UUFDVixRQUFRLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ2pJLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUMvQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLElBQUksRUFBRTtRQUNKLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxDQUFDO0lBQ3ZGLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsSUFBSSxFQUFFO1FBQ0osRUFBRSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0QsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxJQUFJLEVBQUU7UUFDSixFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzRCxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLElBQUksRUFBRTtRQUNKLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsSUFBSSxHQUFHO1FBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxJQUFJLEtBQUs7UUFDUCxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBRXRDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsSUFBSSxPQUFPLEVBQUU7UUFDWCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hCLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDMUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDakYsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ25ELElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO2FBQ2pMLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUN2RixJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDbEQsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3ZKLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDN0ksSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzNGLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ2pJLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDO2FBQ3ZQLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsQ0FBQzthQUM3RixJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDL0gsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFrQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDcFAsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLENBQUM7YUFDbkssSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDOUQsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQzthQUMvRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzthQUM1TCxJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixHQUFHLENBQUM7YUFDbkcsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztZQUMvQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixhQUFhLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzthQUMxUyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7O1lBRXBNLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQzFCO0lBRUQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxJQUFJLEdBQUc7UUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzRyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELElBQUksUUFBUTtRQUNWLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxJQUFJLElBQUk7UUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlDLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUMzQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELElBQUksTUFBTTtRQUNSLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLElBQUksR0FBRztRQUNMLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDM0QsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2RCxJQUFJLFNBQVM7UUFDWCxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQzdDLGtEQUFrRDtBQUNwRCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLDBCQUEwQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEQsa0RBQWtEO0FBQ3BELENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDckMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDNUIsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDYixLQUFLLGtCQUFrQixDQUFDO2dCQUN0QixJQUFJLEVBQUUsWUFBWTtnQkFDbEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssa0JBQWtCLENBQUMsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxDQUFDIiwiZmlsZSI6InVpL3Rlc3QvdGVzdC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPdmVybGF5UGx1Z2luIEFQSSBzZXR1cFxyXG5cclxuaW1wb3J0IHsgRXZlbnRNYXAsIEV2ZW50VHlwZSwgSU92ZXJsYXlIYW5kbGVyLCBPdmVybGF5SGFuZGxlckZ1bmNzLCBPdmVybGF5SGFuZGxlclR5cGVzIH0gZnJvbSAnLi4vdHlwZXMvZXZlbnQnO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIGludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgX19PdmVybGF5Q2FsbGJhY2s6IEV2ZW50TWFwW0V2ZW50VHlwZV07XHJcbiAgICBkaXNwYXRjaE92ZXJsYXlFdmVudD86IHR5cGVvZiBwcm9jZXNzRXZlbnQ7XHJcbiAgICBPdmVybGF5UGx1Z2luQXBpOiB7XHJcbiAgICAgIHJlYWR5OiBib29sZWFuO1xyXG4gICAgICBjYWxsSGFuZGxlcjogKG1zZzogc3RyaW5nLCBjYj86ICh2YWx1ZTogc3RyaW5nKSA9PiB1bmtub3duKSA9PiB2b2lkO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgVGhpcyBpcyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cclxuICAgICAqXHJcbiAgICAgKiBJdCBpcyByZWNvbW1lbmRlZCB0byBpbXBvcnQgZnJvbSB0aGlzIGZpbGU6XHJcbiAgICAgKlxyXG4gICAgICogYGltcG9ydCB7IGFkZE92ZXJsYXlMaXN0ZW5lciB9IGZyb20gJy9wYXRoL3RvL292ZXJsYXlfcGx1Z2luX2FwaSc7YFxyXG4gICAgICovXHJcbiAgICBhZGRPdmVybGF5TGlzdGVuZXI6IElBZGRPdmVybGF5TGlzdGVuZXI7XHJcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIFRoaXMgaXMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXHJcbiAgICAgKlxyXG4gICAgICogSXQgaXMgcmVjb21tZW5kZWQgdG8gaW1wb3J0IGZyb20gdGhpcyBmaWxlOlxyXG4gICAgICpcclxuICAgICAqIGBpbXBvcnQgeyByZW1vdmVPdmVybGF5TGlzdGVuZXIgfSBmcm9tICcvcGF0aC90by9vdmVybGF5X3BsdWdpbl9hcGknO2BcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlT3ZlcmxheUxpc3RlbmVyOiBJUmVtb3ZlT3ZlcmxheUxpc3RlbmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxyXG4gICAgICpcclxuICAgICAqIEl0IGlzIHJlY29tbWVuZGVkIHRvIGltcG9ydCBmcm9tIHRoaXMgZmlsZTpcclxuICAgICAqXHJcbiAgICAgKiBgaW1wb3J0IHsgY2FsbE92ZXJsYXlIYW5kbGVyIH0gZnJvbSAnL3BhdGgvdG8vb3ZlcmxheV9wbHVnaW5fYXBpJztgXHJcbiAgICAgKi9cclxuICAgIGNhbGxPdmVybGF5SGFuZGxlcjogSU92ZXJsYXlIYW5kbGVyO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbnR5cGUgSUFkZE92ZXJsYXlMaXN0ZW5lciA9IDxUIGV4dGVuZHMgRXZlbnRUeXBlPihldmVudDogVCwgY2I6IEV2ZW50TWFwW1RdKSA9PiB2b2lkO1xyXG50eXBlIElSZW1vdmVPdmVybGF5TGlzdGVuZXIgPSA8VCBleHRlbmRzIEV2ZW50VHlwZT4oZXZlbnQ6IFQsIGNiOiBFdmVudE1hcFtUXSkgPT4gdm9pZDtcclxuXHJcbnR5cGUgU3Vic2NyaWJlcjxUPiA9IHtcclxuICBba2V5IGluIEV2ZW50VHlwZV0/OiBUW107XHJcbn07XHJcbnR5cGUgRXZlbnRQYXJhbWV0ZXIgPSBQYXJhbWV0ZXJzPEV2ZW50TWFwW0V2ZW50VHlwZV0+WzBdO1xyXG50eXBlIFZvaWRGdW5jPFQ+ID0gKC4uLmFyZ3M6IFRbXSkgPT4gdm9pZDtcclxuXHJcbmxldCBpbml0ZWQgPSBmYWxzZTtcclxuXHJcbmxldCB3c1VybDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbCA9IG51bGw7XHJcbmxldCB3czogV2ViU29ja2V0IHwgbnVsbCA9IG51bGw7XHJcbmxldCBxdWV1ZTogKFxyXG4gIHsgW3M6IHN0cmluZ106IHVua25vd24gfSB8XHJcbiAgW3sgW3M6IHN0cmluZ106IHVua25vd24gfSwgKCh2YWx1ZTogc3RyaW5nIHwgbnVsbCkgPT4gdW5rbm93bikgfCB1bmRlZmluZWRdXHJcbilbXSB8IG51bGwgPSBbXTtcclxubGV0IHJzZXFDb3VudGVyID0gMDtcclxuY29uc3QgcmVzcG9uc2VQcm9taXNlczogUmVjb3JkPG51bWJlciwgKHZhbHVlOiB1bmtub3duKSA9PiB2b2lkPiA9IHt9O1xyXG5cclxuY29uc3Qgc3Vic2NyaWJlcnM6IFN1YnNjcmliZXI8Vm9pZEZ1bmM8dW5rbm93bj4+ID0ge307XHJcblxyXG5jb25zdCBzZW5kTWVzc2FnZSA9IChcclxuICAgIG1zZzogeyBbczogc3RyaW5nXTogdW5rbm93biB9LFxyXG4gICAgY2I/OiAodmFsdWU6IHN0cmluZyB8IG51bGwpID0+IHVua25vd24sXHJcbik6IHZvaWQgPT4ge1xyXG4gIGlmICh3cykge1xyXG4gICAgaWYgKHF1ZXVlKVxyXG4gICAgICBxdWV1ZS5wdXNoKG1zZyk7XHJcbiAgICBlbHNlXHJcbiAgICAgIHdzLnNlbmQoSlNPTi5zdHJpbmdpZnkobXNnKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChxdWV1ZSlcclxuICAgICAgcXVldWUucHVzaChbbXNnLCBjYl0pO1xyXG4gICAgZWxzZVxyXG4gICAgICB3aW5kb3cuT3ZlcmxheVBsdWdpbkFwaS5jYWxsSGFuZGxlcihKU09OLnN0cmluZ2lmeShtc2cpLCBjYik7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcHJvY2Vzc0V2ZW50ID0gPFQgZXh0ZW5kcyBFdmVudFR5cGU+KG1zZzogUGFyYW1ldGVyczxFdmVudE1hcFtUXT5bMF0pOiB2b2lkID0+IHtcclxuICBpbml0KCk7XHJcblxyXG4gIGNvbnN0IHN1YnMgPSBzdWJzY3JpYmVyc1ttc2cudHlwZV07XHJcbiAgc3Vicz8uZm9yRWFjaCgoc3ViKSA9PiBzdWIobXNnKSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGlzcGF0Y2hPdmVybGF5RXZlbnQgPSBwcm9jZXNzRXZlbnQ7XHJcblxyXG5leHBvcnQgY29uc3QgYWRkT3ZlcmxheUxpc3RlbmVyOiBJQWRkT3ZlcmxheUxpc3RlbmVyID0gKGV2ZW50LCBjYik6IHZvaWQgPT4ge1xyXG4gIGluaXQoKTtcclxuXHJcbiAgaWYgKCFzdWJzY3JpYmVyc1tldmVudF0pIHtcclxuICAgIHN1YnNjcmliZXJzW2V2ZW50XSA9IFtdO1xyXG5cclxuICAgIGlmICghcXVldWUpIHtcclxuICAgICAgc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgIGNhbGw6ICdzdWJzY3JpYmUnLFxyXG4gICAgICAgIGV2ZW50czogW2V2ZW50XSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJzY3JpYmVyc1tldmVudF0/LnB1c2goY2IgYXMgVm9pZEZ1bmM8dW5rbm93bj4pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZU92ZXJsYXlMaXN0ZW5lcjogSVJlbW92ZU92ZXJsYXlMaXN0ZW5lciA9IChldmVudCwgY2IpOiB2b2lkID0+IHtcclxuICBpbml0KCk7XHJcblxyXG4gIGlmIChzdWJzY3JpYmVyc1tldmVudF0pIHtcclxuICAgIGNvbnN0IGxpc3QgPSBzdWJzY3JpYmVyc1tldmVudF07XHJcbiAgICBjb25zdCBwb3MgPSBsaXN0Py5pbmRleE9mKGNiIGFzIFZvaWRGdW5jPHVua25vd24+KTtcclxuXHJcbiAgICBpZiAocG9zICYmIHBvcyA+IC0xKVxyXG4gICAgICBsaXN0Py5zcGxpY2UocG9zLCAxKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjYWxsT3ZlcmxheUhhbmRsZXJJbnRlcm5hbDogSU92ZXJsYXlIYW5kbGVyID0gKFxyXG4gICAgX21zZzogeyBbczogc3RyaW5nXTogdW5rbm93biB9LFxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICBpbml0KCk7XHJcblxyXG4gIGNvbnN0IG1zZyA9IHtcclxuICAgIC4uLl9tc2csXHJcbiAgICByc2VxOiAwLFxyXG4gIH07XHJcbiAgbGV0IHA6IFByb21pc2U8dW5rbm93bj47XHJcblxyXG4gIGlmICh3cykge1xyXG4gICAgbXNnLnJzZXEgPSByc2VxQ291bnRlcisrO1xyXG4gICAgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIHJlc3BvbnNlUHJvbWlzZXNbbXNnLnJzZXFdID0gcmVzb2x2ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNlbmRNZXNzYWdlKG1zZyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBzZW5kTWVzc2FnZShtc2csIChkYXRhKSA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZShkYXRhID09PSBudWxsID8gbnVsbCA6IEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHA7XHJcbn07XHJcblxyXG50eXBlIE92ZXJyaWRlTWFwID0geyBbY2FsbCBpbiBPdmVybGF5SGFuZGxlclR5cGVzXT86IE92ZXJsYXlIYW5kbGVyRnVuY3NbY2FsbF0gfTtcclxuY29uc3QgY2FsbE92ZXJsYXlIYW5kbGVyT3ZlcnJpZGVNYXA6IE92ZXJyaWRlTWFwID0ge307XHJcblxyXG5leHBvcnQgY29uc3QgY2FsbE92ZXJsYXlIYW5kbGVyOiBJT3ZlcmxheUhhbmRsZXIgPSAoXHJcbiAgICBfbXNnOiB7IFtzOiBzdHJpbmddOiB1bmtub3duIH0sXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4pOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gIGluaXQoKTtcclxuXHJcbiAgLy8gSWYgdGhpcyBgYXNgIGlzIGluY29ycmVjdCwgdGhlbiBpdCB3aWxsIG5vdCBmaW5kIGFuIG92ZXJyaWRlLlxyXG4gIC8vIFRPRE86IHdlIGNvdWxkIGFsc28gcmVwbGFjZSB0aGlzIHdpdGggYSB0eXBlIGd1YXJkLlxyXG4gIGNvbnN0IHR5cGUgPSBfbXNnLmNhbGwgYXMga2V5b2YgT3ZlcnJpZGVNYXA7XHJcbiAgY29uc3QgY2FsbEZ1bmMgPSBjYWxsT3ZlcmxheUhhbmRsZXJPdmVycmlkZU1hcFt0eXBlXSA/PyBjYWxsT3ZlcmxheUhhbmRsZXJJbnRlcm5hbDtcclxuXHJcbiAgLy8gVGhlIGBJT3ZlcmxheUhhbmRsZXJgIHR5cGUgZ3VhcmFudGVlcyB0aGF0IHBhcmFtZXRlcnMvcmV0dXJuIHR5cGUgbWF0Y2hcclxuICAvLyBvbmUgb2YgdGhlIG92ZXJsYXkgaGFuZGxlcnMuICBUaGUgT3ZlcnJpZGVNYXAgYWxzbyBvbmx5IHN0b3JlcyBmdW5jdGlvbnNcclxuICAvLyB0aGF0IG1hdGNoIGJ5IHRoZSBkaXNjcmltaW5hdGluZyBgY2FsbGAgZmllbGQsIGFuZCBzbyBhbnkgb3ZlcnJpZGVzXHJcbiAgLy8gc2hvdWxkIGJlIGNvcnJlY3QgaGVyZS5cclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55LEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXJndW1lbnRcclxuICByZXR1cm4gY2FsbEZ1bmMoX21zZyBhcyBhbnkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldE92ZXJsYXlIYW5kbGVyT3ZlcnJpZGUgPSA8VCBleHRlbmRzIGtleW9mIE92ZXJsYXlIYW5kbGVyRnVuY3M+KFxyXG4gIHR5cGU6IFQsIG92ZXJyaWRlPzogT3ZlcmxheUhhbmRsZXJGdW5jc1tUXSk6IHZvaWQgPT4ge1xyXG4gIGlmICghb3ZlcnJpZGUpIHtcclxuICAgIGRlbGV0ZSBjYWxsT3ZlcmxheUhhbmRsZXJPdmVycmlkZU1hcFt0eXBlXTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY2FsbE92ZXJsYXlIYW5kbGVyT3ZlcnJpZGVNYXBbdHlwZV0gPSBvdmVycmlkZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gIGlmIChpbml0ZWQpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgd3NVcmwgPSAvW1xcPyZdT1ZFUkxBWV9XUz0oW14mXSspLy5leGVjKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgIGlmICh3c1VybCkge1xyXG4gICAgICBjb25zdCBjb25uZWN0V3MgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB3cyA9IG5ldyBXZWJTb2NrZXQod3NVcmw/LlsxXSBhcyBzdHJpbmcpO1xyXG5cclxuICAgICAgICB3cy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3cy5hZGRFdmVudExpc3RlbmVyKCdvcGVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Nvbm5lY3RlZCEnKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBxID0gcXVldWUgPz8gW107XHJcbiAgICAgICAgICBxdWV1ZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICBjYWxsOiAnc3Vic2NyaWJlJyxcclxuICAgICAgICAgICAgZXZlbnRzOiBPYmplY3Qua2V5cyhzdWJzY3JpYmVycyksXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IG1zZyBvZiBxKSB7XHJcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShtc2cpKVxyXG4gICAgICAgICAgICAgIHNlbmRNZXNzYWdlKG1zZyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoX21zZykgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfbXNnLmRhdGEgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBtZXNzYWdlIGRhdGEgcmVjZWl2ZWQ6ICcsIF9tc2cpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKF9tc2cuZGF0YSkgYXMgRXZlbnRQYXJhbWV0ZXIgJiB7IHJzZXE/OiBudW1iZXIgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtc2cucnNlcSAhPT0gdW5kZWZpbmVkICYmIHJlc3BvbnNlUHJvbWlzZXNbbXNnLnJzZXFdKSB7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VQcm9taXNlc1ttc2cucnNlcV0/Lihtc2cpO1xyXG4gICAgICAgICAgICAgIGRlbGV0ZSByZXNwb25zZVByb21pc2VzW21zZy5yc2VxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBwcm9jZXNzRXZlbnQobXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIG1lc3NhZ2UgcmVjZWl2ZWQ6ICcsIF9tc2cpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgKCkgPT4ge1xyXG4gICAgICAgICAgcXVldWUgPSBudWxsO1xyXG5cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUcnlpbmcgdG8gcmVjb25uZWN0Li4uJyk7XHJcbiAgICAgICAgICAvLyBEb24ndCBzcGFtIHRoZSBzZXJ2ZXIgd2l0aCByZXRyaWVzLlxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbm5lY3RXcygpO1xyXG4gICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbm5lY3RXcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgd2FpdEZvckFwaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghd2luZG93Lk92ZXJsYXlQbHVnaW5BcGkgfHwgIXdpbmRvdy5PdmVybGF5UGx1Z2luQXBpLnJlYWR5KSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KHdhaXRGb3JBcGksIDMwMCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBxID0gcXVldWUgPz8gW107XHJcbiAgICAgICAgcXVldWUgPSBudWxsO1xyXG5cclxuICAgICAgICB3aW5kb3cuX19PdmVybGF5Q2FsbGJhY2sgPSBwcm9jZXNzRXZlbnQ7XHJcblxyXG4gICAgICAgIHNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgIGNhbGw6ICdzdWJzY3JpYmUnLFxyXG4gICAgICAgICAgZXZlbnRzOiBPYmplY3Qua2V5cyhzdWJzY3JpYmVycyksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBxKSB7XHJcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSlcclxuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoaXRlbVswXSwgaXRlbVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgd2FpdEZvckFwaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhlcmUgdGhlIE92ZXJsYXlQbHVnaW4gQVBJIGlzIHJlZ2lzdGVyZWQgdG8gdGhlIHdpbmRvdyBvYmplY3QsXHJcbiAgICAvLyBidXQgdGhpcyBpcyBtYWlubHkgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LkZvciBjYWN0Ym90J3MgYnVpbHQtaW4gZmlsZXMsXHJcbiAgICAvLyBpdCBpcyByZWNvbW1lbmRlZCB0byB1c2UgdGhlIHZhcmlvdXMgZnVuY3Rpb25zIGV4cG9ydGVkIGluIHJlc291cmNlcy9vdmVybGF5X3BsdWdpbl9hcGkudHMuXHJcbiAgICB3aW5kb3cuYWRkT3ZlcmxheUxpc3RlbmVyID0gYWRkT3ZlcmxheUxpc3RlbmVyO1xyXG4gICAgd2luZG93LnJlbW92ZU92ZXJsYXlMaXN0ZW5lciA9IHJlbW92ZU92ZXJsYXlMaXN0ZW5lcjtcclxuICAgIHdpbmRvdy5jYWxsT3ZlcmxheUhhbmRsZXIgPSBjYWxsT3ZlcmxheUhhbmRsZXI7XHJcbiAgICB3aW5kb3cuZGlzcGF0Y2hPdmVybGF5RXZlbnQgPSBkaXNwYXRjaE92ZXJsYXlFdmVudDtcclxuICB9XHJcblxyXG4gIGluaXRlZCA9IHRydWU7XHJcbn07XHJcbiIsImltcG9ydCB7IGNhbGxPdmVybGF5SGFuZGxlciwgYWRkT3ZlcmxheUxpc3RlbmVyIH0gZnJvbSAnLi4vLi4vcmVzb3VyY2VzL292ZXJsYXlfcGx1Z2luX2FwaSc7XHJcblxyXG5pbXBvcnQgJy4uLy4uL3Jlc291cmNlcy9kZWZhdWx0cy5jc3MnO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdDaGFuZ2Vab25lJywgKGUpID0+IHtcclxuICBjb25zdCBjdXJyZW50Wm9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50Wm9uZScpO1xyXG4gIGlmIChjdXJyZW50Wm9uZSlcclxuICAgIGN1cnJlbnRab25lLmlubmVyVGV4dCA9IGBjdXJyZW50Wm9uZTogJHtlLnpvbmVOYW1lfSAoJHtlLnpvbmVJRH0pYDtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ29uSW5Db21iYXRDaGFuZ2VkRXZlbnQnLCAoZSkgPT4ge1xyXG4gIGNvbnN0IGluQ29tYmF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luQ29tYmF0Jyk7XHJcbiAgaWYgKGluQ29tYmF0KVxyXG4gICAgaW5Db21iYXQuaW5uZXJUZXh0ID0gYGluQ29tYmF0OiBhY3Q6ICR7ZS5kZXRhaWwuaW5BQ1RDb21iYXQgPyAneWVzJyA6ICdubyd9IGdhbWU6ICR7KGUuZGV0YWlsLmluR2FtZUNvbWJhdCA/ICd5ZXMnIDogJ25vJyl9YDtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ29uUGxheWVyQ2hhbmdlZEV2ZW50JywgKGUpID0+IHtcclxuICBjb25zdCBocCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdocCcpO1xyXG4gIGlmIChocClcclxuICAgIGhwLmlubmVyVGV4dCA9IGAke2UuZGV0YWlsLmN1cnJlbnRIUH0vJHtlLmRldGFpbC5tYXhIUH0gKCR7ZS5kZXRhaWwuY3VycmVudFNoaWVsZH0pYDtcclxuICBjb25zdCBtcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtcCcpO1xyXG4gIGlmIChtcClcclxuICAgIG1wLmlubmVyVGV4dCA9IGAke2UuZGV0YWlsLmN1cnJlbnRNUH0vJHtlLmRldGFpbC5tYXhNUH1gO1xyXG4gIGNvbnN0IGNwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NwJyk7XHJcbiAgaWYgKGNwKVxyXG4gICAgY3AuaW5uZXJUZXh0ID0gYCR7ZS5kZXRhaWwuY3VycmVudENQfS8ke2UuZGV0YWlsLm1heENQfWA7XHJcbiAgY29uc3QgZ3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3AnKTtcclxuICBpZiAoZ3ApXHJcbiAgICBncC5pbm5lclRleHQgPSBgJHtlLmRldGFpbC5jdXJyZW50R1B9LyR7ZS5kZXRhaWwubWF4R1B9YDtcclxuICBjb25zdCBqb2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam9iJyk7XHJcbiAgaWYgKGpvYilcclxuICAgIGpvYi5pbm5lclRleHQgPSBgJHtlLmRldGFpbC5sZXZlbH0gJHtlLmRldGFpbC5qb2J9YDtcclxuICBjb25zdCBkZWJ1ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWJ1ZycpO1xyXG4gIGlmIChkZWJ1ZylcclxuICAgIGRlYnVnLmlubmVyVGV4dCA9IGUuZGV0YWlsLmRlYnVnSm9iO1xyXG5cclxuICBjb25zdCBqb2JJbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvYmluZm8nKTtcclxuICBpZiAoam9iSW5mbykge1xyXG4gICAgY29uc3QgZGV0YWlsID0gZS5kZXRhaWw7XHJcbiAgICBpZiAoZGV0YWlsLmpvYiA9PT0gJ1JETScgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLndoaXRlTWFuYX0gfCAke2RldGFpbC5qb2JEZXRhaWwuYmxhY2tNYW5hfWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnV0FSJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGRldGFpbC5qb2JEZXRhaWwuYmVhc3QudG9TdHJpbmcoKTtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdEUksnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5ibG9vZH0gfCAke2RldGFpbC5qb2JEZXRhaWwuZGFya3NpZGVNaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmRhcmtBcnRzLnRvU3RyaW5nKCl9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmxpdmluZ1NoYWRvd01pbGxpc2Vjb25kc31gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ0dOQicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmNhcnRyaWRnZXN9JHtkZXRhaWwuam9iRGV0YWlsLmNvbnRpbnVhdGlvblN0YXRlfWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnUExEJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGRldGFpbC5qb2JEZXRhaWwub2F0aC50b1N0cmluZygpO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ0JSRCcgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLnNvbmdOYW1lfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5zb25nUHJvY3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLnNvdWxHYXVnZX0gfCAke2RldGFpbC5qb2JEZXRhaWwuc29uZ01pbGxpc2Vjb25kc31gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ0ROQycgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmZlYXRoZXJzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5lc3ByaXR9IHwgKCR7ZGV0YWlsLmpvYkRldGFpbC5zdGVwc30pIHwgJHtkZXRhaWwuam9iRGV0YWlsLmN1cnJlbnRTdGVwfWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnTklOJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwuaHV0b25NaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLm5pbmtpQW1vdW50fWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnRFJHJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwuYmxvb2RNaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmxpZmVNaWxsaXNlY29uZHN9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmV5ZXNBbW91bnR9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdCTE0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC51bWJyYWxTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwudW1icmFsTWlsbGlzZWNvbmRzfSkgfCAke2RldGFpbC5qb2JEZXRhaWwudW1icmFsSGVhcnRzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5mb3VsQ291bnR9ICR7ZGV0YWlsLmpvYkRldGFpbC5lbm9jaGlhbi50b1N0cmluZygpfSAoJHtkZXRhaWwuam9iRGV0YWlsLm5leHRQb2x5Z2xvdE1pbGxpc2Vjb25kc30pYDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdUSE0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC51bWJyYWxTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwudW1icmFsTWlsbGlzZWNvbmRzfSlgO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1dITScgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmxpbHlTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwubGlseU1pbGxpc2Vjb25kc30pIHwgJHtkZXRhaWwuam9iRGV0YWlsLmJsb29kbGlseVN0YWNrc31gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1NNTicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmRyZWFkd3lybVN0YWNrc30gfCAke2RldGFpbC5qb2JEZXRhaWwuYmFoYW11dFN0YW5jZX0gfCAke2RldGFpbC5qb2JEZXRhaWwuYmFoYW11dFN1bW1vbmVkfSAoJHtkZXRhaWwuam9iRGV0YWlsLnN0YW5jZU1pbGxpc2Vjb25kc30pIHwgJHtkZXRhaWwuam9iRGV0YWlsLnBob2VuaXhSZWFkeX1gO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ1NDSCcgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBgJHtkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3N9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5R2F1Z2V9IHwgJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5U3RhdHVzfSAoJHtkZXRhaWwuam9iRGV0YWlsLmZhaXJ5TWlsbGlzZWNvbmRzfSlgO1xyXG4gICAgZWxzZSBpZiAoZGV0YWlsLmpvYiA9PT0gJ0FDTicgJiYgZGV0YWlsLmpvYkRldGFpbClcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSBkZXRhaWwuam9iRGV0YWlsLmFldGhlcmZsb3dTdGFja3MudG9TdHJpbmcoKTtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdBU1QnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5oZWxkQ2FyZH0gKCR7ZGV0YWlsLmpvYkRldGFpbC5hcmNhbnVtc30pYDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdNTksnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5saWdodG5pbmdTdGFja3N9ICgke2RldGFpbC5qb2JEZXRhaWwubGlnaHRuaW5nTWlsbGlzZWNvbmRzfSkgfCAke2RldGFpbC5qb2JEZXRhaWwuY2hha3JhU3RhY2tzfSB8ICR7ZGV0YWlsLmpvYkRldGFpbC5saWdodG5pbmdUaW1lckZyb3plbi50b1N0cmluZygpfWA7XHJcbiAgICBlbHNlIGlmIChkZXRhaWwuam9iID09PSAnUEdMJyAmJiBkZXRhaWwuam9iRGV0YWlsKVxyXG4gICAgICBqb2JJbmZvLmlubmVyVGV4dCA9IGAke2RldGFpbC5qb2JEZXRhaWwubGlnaHRuaW5nU3RhY2tzfSAoJHtkZXRhaWwuam9iRGV0YWlsLmxpZ2h0bmluZ01pbGxpc2Vjb25kc30pYDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdNQ0gnICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5oZWF0fSAoJHtkZXRhaWwuam9iRGV0YWlsLm92ZXJoZWF0TWlsbGlzZWNvbmRzfSkgfCAke2RldGFpbC5qb2JEZXRhaWwuYmF0dGVyeX0gKCR7ZGV0YWlsLmpvYkRldGFpbC5iYXR0ZXJ5TWlsbGlzZWNvbmRzfSkgfCBsYXN0OiAke2RldGFpbC5qb2JEZXRhaWwubGFzdEJhdHRlcnlBbW91bnR9IHwgJHtkZXRhaWwuam9iRGV0YWlsLm92ZXJoZWF0QWN0aXZlLnRvU3RyaW5nKCl9IHwgJHtkZXRhaWwuam9iRGV0YWlsLnJvYm90QWN0aXZlLnRvU3RyaW5nKCl9YDtcclxuICAgIGVsc2UgaWYgKGRldGFpbC5qb2IgPT09ICdTQU0nICYmIGRldGFpbC5qb2JEZXRhaWwpXHJcbiAgICAgIGpvYkluZm8uaW5uZXJUZXh0ID0gYCR7ZGV0YWlsLmpvYkRldGFpbC5rZW5raX0gfCAke2RldGFpbC5qb2JEZXRhaWwubWVkaXRhdGlvblN0YWNrc30oJHtkZXRhaWwuam9iRGV0YWlsLnNldHN1LnRvU3RyaW5nKCl9LCR7ZGV0YWlsLmpvYkRldGFpbC5nZXRzdS50b1N0cmluZygpfSwke2RldGFpbC5qb2JEZXRhaWwua2EudG9TdHJpbmcoKX0pYDtcclxuICAgIGVsc2VcclxuICAgICAgam9iSW5mby5pbm5lclRleHQgPSAnJztcclxuICB9XHJcblxyXG4gIGNvbnN0IHBvcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3MnKTtcclxuICBpZiAocG9zKVxyXG4gICAgcG9zLmlubmVyVGV4dCA9IGAke2UuZGV0YWlsLnBvcy54LnRvRml4ZWQoMil9LCR7ZS5kZXRhaWwucG9zLnkudG9GaXhlZCgyKX0sJHtlLmRldGFpbC5wb3Muei50b0ZpeGVkKDIpfWA7XHJcbiAgY29uc3Qgcm90YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm90YXRpb24nKTtcclxuICBpZiAocm90YXRpb24pXHJcbiAgICByb3RhdGlvbi5pbm5lclRleHQgPSBlLmRldGFpbC5yb3RhdGlvbi50b1N0cmluZygpO1xyXG4gIGNvbnN0IGJhaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFpdCcpO1xyXG4gIGlmIChiYWl0KVxyXG4gICAgYmFpdC5pbm5lclRleHQgPSBlLmRldGFpbC5iYWl0LnRvU3RyaW5nKCk7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdFbm1pdHlUYXJnZXREYXRhJywgKGUpID0+IHtcclxuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFyZ2V0Jyk7XHJcbiAgaWYgKHRhcmdldClcclxuICAgIHRhcmdldC5pbm5lclRleHQgPSBlLlRhcmdldCA/IGUuVGFyZ2V0Lk5hbWUgOiAnLS0nO1xyXG4gIGNvbnN0IHRpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aWQnKTtcclxuICBpZiAodGlkKVxyXG4gICAgdGlkLmlubmVyVGV4dCA9IGUuVGFyZ2V0ID8gZS5UYXJnZXQuSUQudG9TdHJpbmcoMTYpIDogJyc7XHJcbiAgY29uc3QgdGRpc3RhbmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RkaXN0YW5jZScpO1xyXG4gIGlmICh0ZGlzdGFuY2UpXHJcbiAgICB0ZGlzdGFuY2UuaW5uZXJUZXh0ID0gZS5UYXJnZXQgPyBlLlRhcmdldC5EaXN0YW5jZS50b1N0cmluZygpIDogJyc7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdvbkdhbWVFeGlzdHNFdmVudCcsIChfZSkgPT4ge1xyXG4gIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBleGlzdHM6IFwiICsgZS5kZXRhaWwuZXhpc3RzKTtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ29uR2FtZUFjdGl2ZUNoYW5nZWRFdmVudCcsIChfZSkgPT4ge1xyXG4gIC8vIGNvbnNvbGUubG9nKFwiR2FtZSBhY3RpdmU6IFwiICsgZS5kZXRhaWwuYWN0aXZlKTtcclxufSk7XHJcblxyXG5hZGRPdmVybGF5TGlzdGVuZXIoJ29uTG9nRXZlbnQnLCAoZSkgPT4ge1xyXG4gIGUuZGV0YWlsLmxvZ3MuZm9yRWFjaCgobG9nKSA9PiB7XHJcbiAgICAvLyBNYXRjaCBcIi9lY2hvIHR0czo8c3R1ZmY+XCJcclxuICAgIGNvbnN0IHIgPSAvMDA6MDAzODp0dHM6KC4qKS8uZXhlYyhsb2cpO1xyXG4gICAgaWYgKHIgJiYgclsxXSkge1xyXG4gICAgICB2b2lkIGNhbGxPdmVybGF5SGFuZGxlcih7XHJcbiAgICAgICAgY2FsbDogJ2NhY3Rib3RTYXknLFxyXG4gICAgICAgIHRleHQ6IHJbMV0sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KTtcclxuXHJcbmFkZE92ZXJsYXlMaXN0ZW5lcignb25Vc2VyRmlsZUNoYW5nZWQnLCAoZSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKGBVc2VyIGZpbGUgJHtlLmZpbGV9IGNoYW5nZWQhYCk7XHJcbn0pO1xyXG5cclxuYWRkT3ZlcmxheUxpc3RlbmVyKCdGaWxlQ2hhbmdlZCcsIChlKSA9PiB7XHJcbiAgY29uc29sZS5sb2coYEZpbGUgJHtlLmZpbGV9IGNoYW5nZWQhYCk7XHJcbn0pO1xyXG5cclxudm9pZCBjYWxsT3ZlcmxheUhhbmRsZXIoeyBjYWxsOiAnY2FjdGJvdFJlcXVlc3RTdGF0ZScgfSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=