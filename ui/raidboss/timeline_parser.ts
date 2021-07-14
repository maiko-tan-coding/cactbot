import { UnreachableCode } from '../../resources/not_reached';

type PopupText = {
  type: 'info' | 'alert' | 'alarm' | 'tts';
  name: string;
  secondsBefore?: number;
  text?: string;
};

type EventLine = {
  time: number;
  name: string;
  sync?: {
    regex: string;
    start: number;
    end: number;
    jump?: number;
  };
  duration?: number;
}

type Error = {
  lineNumber: number;
  line: string;
  error: string;
}

interface Timeline {
  ignore?: string[];
  popupText?: PopupText[];
  event?: EventLine[];
}

type TimelineJson = {
  i?: string[];
  t?: {
    t: 'info' | 'alert' | 'alarm' | 'tts';
    n: string;
    s?: number;
    x?: string;
  }[];
  e?: {
    t: number;
    n: string;
    s?: {
      r: string;
      s: number;
      e: number;
      j?: number;
    };
    d?: number;
  }[];
}

export default class TimelineParser implements Timeline {
  ignore: string[];
  popupText: PopupText[];
  event: EventLine[];

  constructor() {
    this.ignore = [];
    this.popupText = [];
    this.event = [];
  }

  error(error: Error, filepath = 'file'): void {
    console.error(`${filepath}:${error.lineNumber}:error ${error.error} occured, original line content is \`${error.line}\``);
  }

  static parse(timelineText: string, timelinePath?: string): TimelineParser {
    const timeline = new TimelineParser();

    const errors: Error[] = [];
    const regexes = {
      comment: /^\s*#/,
      commentLine: /#.*$/,
      durationCommand: /(?:[^#]*?\s)?(?<text>duration\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(\s.*)?$/,
      ignore: /^hideall\s+\"(?<id>[^"]+)\"$/,
      jumpCommand: /(?:[^#]*?\s)?(?<text>jump\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
      line: /^(?<text>(?<time>[0-9]+(?:\.[0-9]+)?)\s+"(?<name>.*?)")(\s+(.*))?/,
      popupText: /^(?<type>info|alert|alarm)text\s+\"(?<id>[^"]+)\"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)(?:\s+\"(?<text>[^"]+)\")?$/,
      soundAlert: /^define\s+soundalert\s+"[^"]*"\s+"[^"]*"$/,
      speaker: /define speaker "[^"]*"(\s+"[^"]*")?\s+(-?[0-9]+(?:\.[0-9]+)?)\s+(-?[0-9]+(?:\.[0-9]+)?)/,
      syncCommand: /(?:[^#]*?\s)?(?<text>sync\s*\/(?<regex>.*)\/)(?<args>\s.*)?$/,
      tts: /^alertall\s+"(?<id>[^"]*)"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)\s+(?<command>sound|speak\s+"[^"]*")\s+"(?<text>[^"]*)"$/,
      windowCommand: /(?:[^#]*?\s)?(?<text>window\s+(?:(?<start>[0-9]+(?:\.[0-9]+)?),)?(?<end>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
    };
    const lines = timelineText.split('\n');
    let lineNumber = 0;

    for (let line of lines) {
      ++lineNumber;
      line = line.trim();
      // Drop comments and empty lines.
      if (!line || regexes.comment.test(line))
        continue;
      const originalLine = line;

      let match = regexes.ignore.exec(line);
      if (match && match['groups']) {
        timeline.ignore ??= [];
        const ignore = match['groups'];
        if (ignore.id && !(ignore.id in timeline.ignore))
          timeline.ignore.push(ignore.id);
        continue;
      }

      match = regexes.tts.exec(line);
      if (match && match['groups']) {
        const tts = match['groups'];
        if (!tts.id || !tts.beforeSeconds || !tts.command)
          throw new UnreachableCode();
        // TODO: Support alert sounds?
        if (tts.command === 'sound')
          continue;
        timeline.popupText.push({
          type: 'tts',
          name: tts.id,
          secondsBefore: parseFloat(tts.beforeSeconds),
          text: tts.text,
        });
        continue;
      }
      match = regexes.soundAlert.exec(line);
      if (match)
        continue;
      match = regexes.speaker.exec(line);
      if (match)
        continue;

      match = regexes.popupText.exec(line);
      if (match && match['groups']) {
        const popupText = match['groups'];
        if (!popupText.type || !popupText.id || !popupText.beforeSeconds)
          throw new UnreachableCode();
        const type = popupText.type;
        if (type !== 'info' && type !== 'alert' && type !== 'alarm')
          continue;
        timeline.popupText.push({
          type: type,
          name: popupText.id,
          secondsBefore: parseFloat(popupText.beforeSeconds),
          text: popupText.text ? popupText.text : popupText.id,
        });
        continue;
      }
      match = regexes.line.exec(line);
      if (!(match && match['groups'])) {
        errors.push({
          line: originalLine,
          error: 'Invalid format',
          lineNumber: lineNumber,
        });
        continue;
      }
      const parsedLine = match['groups'];
      // Technically the name can be empty
      if (!parsedLine.text || !parsedLine.time || parsedLine.name === undefined)
        throw new UnreachableCode();
      line = line.replace(parsedLine.text, '').trim();
      // There can be # in the ability name, but probably not in the regex.
      line = line.replace(regexes.commentLine, '').trim();

      const seconds = parseFloat(parsedLine.time);
      const e: EventLine = {
        time: seconds,
        // The original ability name in the timeline.  Used for hideall, infotext, etc.
        name: parsedLine.name,
      };
      if (line) {
        let commandMatch = regexes.durationCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const durationCommand = commandMatch['groups'];
          if (!durationCommand.text || !durationCommand.seconds)
            throw new UnreachableCode();
          line = line.replace(durationCommand.text, '').trim();
          e.duration = parseFloat(durationCommand.seconds);
        }

        commandMatch = regexes.syncCommand.exec(line);
        if (commandMatch && commandMatch['groups']) {
          const syncCommand = commandMatch['groups'];
          if (!syncCommand.text || !syncCommand.regex)
            throw new UnreachableCode();
          line = line.replace(syncCommand.text, '').trim();
          const sync: EventLine['sync'] = {
            regex: syncCommand.regex,
            start: seconds - 2.5,
            end: seconds + 2.5,
          };
          if (syncCommand.args) {
            let argMatch = regexes.windowCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const windowCommand = argMatch['groups'];
              if (!windowCommand.text || !windowCommand.end)
                throw new UnreachableCode();
              line = line.replace(windowCommand.text, '').trim();
              if (windowCommand.start) {
                sync.start = seconds - parseFloat(windowCommand.start);
                sync.end = seconds + parseFloat(windowCommand.end);
              } else {
                sync.start = seconds - (parseFloat(windowCommand.end) / 2);
                sync.end = seconds + (parseFloat(windowCommand.end) / 2);
              }
            }
            argMatch = regexes.jumpCommand.exec(syncCommand.args);
            if (argMatch && argMatch['groups']) {
              const jumpCommand = argMatch['groups'];
              if (!jumpCommand.text || !jumpCommand.seconds)
                throw new UnreachableCode();
              line = line.replace(jumpCommand.text, '').trim();
              sync.jump = parseFloat(jumpCommand.seconds);
            }
          }
          e.sync = sync;
        }
      }
      // If there's text left that isn't a comment then we didn't parse that text so report it.
      if (line && !regexes.comment.exec(line)) {
        console.log(`Unknown content '${line}' in timeline: ${originalLine}`);
        errors.push({
          lineNumber: lineNumber,
          line: originalLine,
          error: 'Extra text',
        });
      } else {
        timeline.event.push(e);
      }
    }

    errors.forEach((error) => {
      timeline.error(error, timelinePath);
    });

    return timeline;
  }

  toJSON(): TimelineJson {
    const ret: TimelineJson = {};
    if (this.ignore.length)
      ret.i = this.ignore;

    if (this.popupText.length) {
      ret.t = [];
      for (const popup of this.popupText) {
        ret.t.push({
          t: popup.type,
          n: popup.name,
          s: popup.secondsBefore,
          x: popup.text,
        });
      }
    }
    if (this.event.length) {
      ret.e = [];
      for (const event of this.event) {
        ret.e.push({
          t: event.time,
          n: event.name,
          d: event.duration,
          s: event.sync ? {
            r: event.sync.regex,
            s: event.sync.start,
            e: event.sync.end,
            j: event.sync.jump,
          } : undefined,
        });
      }
    }
    // omit undefined values
    return JSON.parse(JSON.stringify(ret)) as TimelineJson;
  }

  static fromJSON(json: TimelineJson): TimelineParser {
    const timeline = new TimelineParser();
    timeline.ignore = json['i'] || [];
    timeline.popupText = json['t']?.map((text) => {
      return {
        type: text['t'],
        name: text['n'],
        secondsBefore: text['s'],
        text: text['x'],
      };
    }) || [];
    timeline.event = json['e']?.map((event) => {
      return {
        time: event['t'],
        name: event['n'],
        duration: event['d'],
        sync: event['s'] ? {
          regex: event['s']['r'],
          start: event['s']['s'],
          end: event['s']['e'],
          jump: event['s']['j'],
        } : undefined,
      };
    }) || [];

    return timeline;
  }
}
