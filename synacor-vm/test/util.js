'use strict';

let assert = require('assert');

let SynacorVm = require('../src/synacor-vm.js');

module.exports.getVmWithProgram = (opArray) => {
  let programBuf = module.exports.createProgram(opArray);
  let vm = new SynacorVm();
  vm.logger.level = 'info';
  vm.loadProgram(programBuf);
  return vm;
}

// Create program buffer from number array
module.exports.createProgram = (opArray) => {
  let buf = new ArrayBuffer(opArray.length * 2);
  let view = new DataView(buf);
  for (let i = 0; i < opArray.length; i++) {
    view.setInt16(i*2, opArray[i], true);
  }
  return buf;
}

module.exports.assertRunAndChangesIp = (vmWithProgram, expectedIp) => {
  vmWithProgram.execute();
  let ipAfter = vmWithProgram.ip;
  assert.equal(ipAfter, expectedIp, 'Instruction pointer was not changed to expected value');
}