import chai from 'chai';

import TimelineParser from '../../ui/raidboss/timeline_parser';

const { assert } = chai;

describe('TimelineParser', () => {
  it('should parse simple timeline', () => {
    const timeline = TimelineParser.parse(`
    3 "A skill"
    6 "Another skill"`);
    assert.equal(timeline.event.length, 2);
    assert.equal(timeline.event[0].time, 3);
    assert.equal(timeline.event[0].name, 'A skill');
    assert.equal(timeline.event[1].time, 6);
    assert.equal(timeline.event[1].name, 'Another skill');
  });

  it('should parse sync part', () => {
    const timeline = TimelineParser.parse(`
    0 "A skill" sync /:test sync:/ window 10 jump 6
    10 "Another skill" sync /:test sync:/ window 10,20`);
    assert.equal(timeline.event[0].sync.regex, ':test sync:');
    assert.equal(timeline.event[0].sync.start, -5);
    assert.equal(timeline.event[0].sync.end, 5);
    assert.equal(timeline.event[0].sync.jump, 6);
    assert.equal(timeline.event[1].sync.regex, ':test sync:');
    assert.equal(timeline.event[1].sync.start, 0);
    assert.equal(timeline.event[1].sync.end, 30);
  });

  it('should parse ignore id', () => {
    const timeline = TimelineParser.parse(`
    hideall "A skill"
    3 "A skill"
    6 "Another skill"`);
    assert.include(timeline.ignore, 'A skill');
  });

  it('should parse popup texts', () => {
    const timeline = TimelineParser.parse(`
    infotext "A skill" before 1
    alerttext "Another skill" before 2.5
    alarmtext "skill" before 2.5 "alternate text"`);
    assert.equal(timeline.popupText[0].type, 'info');
    assert.equal(timeline.popupText[0].name, 'A skill');
    assert.equal(timeline.popupText[0].secondsBefore, 1);
    assert.equal(timeline.popupText[1].type, 'alert');
    assert.equal(timeline.popupText[1].name, 'Another skill');
    assert.equal(timeline.popupText[1].secondsBefore, 2.5);
    assert.equal(timeline.popupText[2].type, 'alarm');
    assert.equal(timeline.popupText[2].text, 'alternate text');
  });

  it('should return proper JSON object', () => {
    const timeline = TimelineParser.parse(`
    hideall "A skill"
    3 "A skill"
    6 "Another skill"`);
    assert.deepEqual(timeline.toJSON(), {
      i: ['A skill'],
      e: [{
        n: 'A skill',
        t: 3,
      }, {
        n: 'Another skill',
        t: 6,
      }],
    });
  });
});
