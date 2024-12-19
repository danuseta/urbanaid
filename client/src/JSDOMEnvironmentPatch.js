const JSDOMEnvironment = require('jest-environment-jsdom').default;

class JSDOMEnvironmentPatch extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);

    if (!this.global.TextEncoder) {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
      this.global.ArrayBuffer = ArrayBuffer;
      this.global.Uint8Array = Uint8Array;
    }
  }
}

module.exports = JSDOMEnvironmentPatch;