'use strict';

let assert = require('assert');

let SynacorVm = require('../src/synacor-vm.js');
let getVmWithProgram = require('./util.js').getVmWithProgram;
let assertChangesIp = require('./util.js').assertChangesIp;

describe('Operation', () => {

  describe('set', () => {
    it('should throw an Error if first argument not a register', () => {
      let vm = getVmWithProgram([1 /* Set */, 50 /* Register a (not a register) */, 50 /* Value b */]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });
    
    it('should be able to change the registry value', () => {
      let vm = getVmWithProgram([1 /* Set */, 32768 /* Register 0 */, 50 /* Value b */]);
      vm.execute();
      let regValueAfter = vm.readRegister(32768);
      assert.equal(regValueAfter, 50, 'Register content was not changed to expected value');
    });
    
    it('should use the register content if the second arg (value) is a register', () => {
      let vm = getVmWithProgram([1 /* Set */, 32768 /* Register 0 */, 32769 /* Value b */]);
      vm.setRegister(32769, 1);
      vm.execute();
      let regValueAfter = vm.readRegister(32768);
      assert.equal(regValueAfter, 1, 'Register content was not changed to expected value');
    });
    
    it('should be able to set all registers', () => {
      let vm = getVmWithProgram([
        1 /* Set */, 32768 /* Register 0 */, 10 /* Value b */,
        1 /* Set */, 32769 /* Register 1 */, 11 /* Value b */,
        1 /* Set */, 32770 /* Register 2 */, 12 /* Value b */,
        1 /* Set */, 32771 /* Register 3 */, 13 /* Value b */,
        1 /* Set */, 32772 /* Register 4 */, 14 /* Value b */,
        1 /* Set */, 32773 /* Register 5 */, 15 /* Value b */,
        1 /* Set */, 32774 /* Register 6 */, 16 /* Value b */,
      ]);
      vm.execute();
      for (let regIndex = 0; regIndex < 7; regIndex++) {
        assert.equal(vm.readRegister(32768 + regIndex), regIndex+10, 
          'Register content was not changed to expected value');
      }
    });
    
    it('should increment the instruction pointer by 3', () => {
      let vm = getVmWithProgram([1 /* Set */, 32768 /* Register 0 */, 1 /* Value b */]);
      assertChangesIp(vm, 3);
    });
  });

  describe('push', () => {
    it('should push a value onto the stack', () => {
      let vm = getVmWithProgram([2 /* Push */, 100 /* Value a */]);
      vm.execute();
      assert.equal(vm.stack[0], 100, 'Value was not pushed onto the stack');
    });
    
    it('should increment the instruction pointer by 2', () => {
      let vm = getVmWithProgram([2 /* Push */, 100 /* Value a */]);
      assertChangesIp(vm, 2);
    });
  });

  describe('pop', () => {
    it('should throw an Error if first argument not a register', () => {
      let vm = getVmWithProgram([4 /* Eq */, 1 /* Invalid register */]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });
    
    it('should pop a value from the stack', () => {
      let vm = getVmWithProgram([3 /* Pop */, 32768 /* Register a */]);
      vm.stack.push(100);
      vm.execute();
      let popedValue = vm.readRegister(32768);
      assert.equal(vm.stack.length, 0, 'Value was not poped from stack');
      assert.equal(popedValue, 100, 'Poped value differs from expected value');
    });

    it('should increment the instruction pointer by 2', () => {
      let vm = getVmWithProgram([3 /* Pop */, 32768 /* Register a */]);
      vm.stack.push(100);
      assertChangesIp(vm, 2);
    });
  });

  describe('eq', () => {
    it('should throw an Error if first argument not a register', () => {
      let vm = getVmWithProgram([4 /* Eq */, 1 /* Invalid register */, 1 , 1]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });
    
    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([4 /* Eq */, 32768 /* Register 0 */, 1 , 1]);
      assertChangesIp(vm, 4);
    });
  });

  describe('gt', () => {
    it('should throw an Error if first argument not a register', () => {
      let vm = getVmWithProgram([5 /* Gt */, 1 /* Invalid register */, 1 , 1]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });
    
    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([5 /* Gt */, 32768 /* Register 0 */, 1 , 1]);
      assertChangesIp(vm, 4);
    });
  });

  describe('jmp', () => {

  });

  describe('jt', () => {

  });

  describe('jf', () => {

  });

  describe('add', () => {
    it('should increment the instruction pointer by 4');
  });

  describe('mult', () => {
    it('should increment the instruction pointer by 4');
  });

  describe('mod', () => {
    it('should increment the instruction pointer by 4');
  });

  describe('and', () => {
    it('should increment the instruction pointer by 4');
  });

  describe('or', () => {
    it('should increment the instruction pointer by 4');
  });

  describe('not', () => {
    it('should increment the instruction pointer by 3');
  });

  describe('rmem', () => {
    it('should increment the instruction pointer by 3');
  });

  describe('wmem', () => {
    it('should increment the instruction pointer by 3');
  });

  describe('call', () => {

  });

  describe('ret', () => {

  });

  describe('out', () => {
    it('should increment the instruction pointer by 2');
  });

  describe('in', () => {
    it('should increment the instruction pointer by 2');
  });

  describe('noop', () => {
    it('should increment the instruction pointer by 1', () => {
      let vm = getVmWithProgram([21]);
      assertChangesIp(vm, 1);
    });
  });
});