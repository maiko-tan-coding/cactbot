'use strict';

// Nameplate toggle
class LineEvent0x22 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];

    this.targetable = !!parseInt(parts[6], 16);
  }
}

class LineEvent34 extends LineEvent0x22 {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x22: LineEvent0x22,
    LineEvent34: LineEvent34,
  };
}
