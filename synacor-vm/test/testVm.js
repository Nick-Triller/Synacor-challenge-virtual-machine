'use strict';

let assert = require('assert');

let SynacorVm = require('../src/synacor-vm.js');
let getVmWithProgram = require('./util.js').getVmWithProgram;

describe('Virtual machine', () => {

  it('should initialize registers to 0', () => {
    let vm = getVmWithProgram([21 /* Noop */]);
    vm.execute();
    for (let regIndex = 0; regIndex < 7; regIndex++) {
      assert.equal(vm.readRegister(32768 + regIndex), 0, 'Register was not initialized to 0');
    }
  });

  describe('loadProgram', () => {

  });

  describe('setRegister', () => {

  });

  describe('readRegister', () => {

  });

  describe('readMemory', () => {

  });

  describe('writeMemory', () => {

  });

  describe('literalOrRegisterValue', () => {

  });
});