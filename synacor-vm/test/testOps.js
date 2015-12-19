'use strict';

let assert = require('assert');

let SynacorVm = require('../src/synacor-vm.js');
let getVmWithProgram = require('./util.js').getVmWithProgram;
let assertRunAndChangesIp = require('./util.js').assertRunAndChangesIp;

describe('Operation', () => {

  describe('set', () => {
    it('should throw an error if first argument not a register', () => {
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
        assert.equal(vm.readRegister(32768 + regIndex), regIndex + 10,
          'Register content was not changed to expected value');
      }
    });

    it('should increment the instruction pointer by 3', () => {
      let vm = getVmWithProgram([1 /* Set */, 32768 /* Register 0 */, 1 /* Value b */]);
      assertRunAndChangesIp(vm, 3);
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
      assertRunAndChangesIp(vm, 2);
    });
  });

  describe('pop', () => {
    it('should throw an error if first argument not a register', () => {
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
      assertRunAndChangesIp(vm, 2);
    });
  });

  describe('eq', () => {
    it('should throw an error if first argument not a register', () => {
      let vm = getVmWithProgram([4 /* Eq */, 1 /* Invalid register */, 1, 1]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });

    it('should write a 1 into register if comparison values are equal', () => {
      let vm = getVmWithProgram([4 /* Eq */, 32768 /* Register 0 */, 1, 1]);
      vm.execute();
      let value = vm.readRegister(32768);
      assert.equal(value, 1, 'Register 0 should have been set to one');
    });

    it('should write a 0 into register if comparison values are not equal', () => {
      let vm = getVmWithProgram([4 /* Eq */, 32768 /* Register 0 */, 1, 2]);
      vm.execute();
      let value = vm.readRegister(32768);
      assert.equal(value, 0, 'Register 0 should have been set to zero');
    });

    it('should use values in register/s if args b and/or c are registers', () => {
      let vm = getVmWithProgram([4 /* Eq */, 32768 /* Register 0 */, 32769 /* Register 1 */, 32770 /* Register 2 */]);
      // b and c are registers, values are equal
      vm.setRegister(32769, 5);
      vm.setRegister(32770, 5);
      vm.execute();
      let b = vm.readRegister(32769);
      let c = vm.readRegister(32770);
      let result = vm.readRegister(32768);
      assert(b === c && c === 5, 'Unexpected values');
      assert.equal(result, 1, 'Register 0 (result) should have been set to one');
    });

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([4 /* Eq */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('gt', () => {
    it('should throw an error if first argument not a register', () => {
      let vm = getVmWithProgram([5 /* Gt */, 1 /* Invalid register */, 1, 1]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });

    it('should use values in register/s if args b and/or c are registers', () => {
      let vm = getVmWithProgram([5 /* Gt */, 32768 /* Register 0 */, 32769 /* Register 1 */, 32770 /* Register 2 */]);
      // b and c are registers, b is greater than c, therefore result should be one
      vm.setRegister(32769, 10);
      vm.setRegister(32770, 5);
      vm.execute();
      let result = vm.readRegister(32768);
      assert.equal(result, 1, 'Register 0 (result) should have been set to one');
    });

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([5 /* Gt */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('jmp', () => {
    it('should jump to target value', () => {
      let vm = getVmWithProgram([6 /* Jmp */, 3 /* Target */, 0 /* Halt */, 0 /* Halt */]);
      vm.execute();
      assert.equal(vm.ip, 3, 'Unexpected instruction pointer value');
    });

    it('should use the register value as target if arg a is a register');

    it('should throw an error if target is invalid');
  });

  describe('jt', () => {
    it('should jump to b if a is non-zero', () => {
      let vm = getVmWithProgram([7 /* Jt */, 1 /* Non-zero */, 4, /* Target */, 0 /* Halt */, 0 /* Halt */]);
      vm.execute();
      assert.equal(vm.ip, 4, 'Unexpected instruction pointer value')
    });

    it('should not jump to b if a is zero', () => {
      let vm = getVmWithProgram([7 /* Jt */, 0 /* Zero */, 4, /* Target */, 0 /* Halt */, 0 /* Halt */]);
      vm.execute();
      assert.equal(vm.ip, 3, 'Unexpected instruction pointer value')
    });

    it('should use the register value as target if arg b is a register', () => {
      let vm = getVmWithProgram([7 /* Jt */, 1 /* Non-zero */, 32768 /* Register 0 */, 0 /* Halt */, 0 /* Halt */]);
      // b is a register
      vm.setRegister(32768, 4);
      vm.execute();
      assert.equal(vm.ip, 4, 'Unexpected instruction pointer value');
    });

    it('should use the register content for the condition check if arg a is a register', () => {
      let vm = getVmWithProgram([7 /* Jt */, 32768 /* Register 0 */, 4 /* Register 0 */, 0 /* Halt */, 0 /* Halt */]);
      // a is a register with non-zero value, therefore a jump should be execute
      vm.setRegister(32768, 4);
      vm.execute();
      assert.equal(vm.ip, 4, 'Unexpected instruction pointer value');
    });
    
    // Valid targets: 0-32767 and registers 32768-32775
    it('should throw an error if target is invalid');
  });

  describe('jf', () => {
    it('should jump to b if a is zero', () => {
      let vm = getVmWithProgram([8 /* Jf */, 0 /* Zero */, 4, /* Target */, 0 /* Halt */, 0 /* Halt */]);
      vm.execute();
      assert.equal(vm.ip, 4, 'Unexpected instruction pointer value')
    });

    it('should not jump to b if a is non-zero', () => {
      let vm = getVmWithProgram([8 /* Jf */, 1 /* Non-zero */, 4, /* Target */, 0 /* Halt */, 0 /* Halt */]);
      vm.execute();
      assert.equal(vm.ip, 3, 'Unexpected instruction pointer value')
    });

    it('should use the register value as target if arg a is a register', () => {
      let vm = getVmWithProgram([8 /* Jf */, 32768 /* Register 0 */, 0 /* Halt */, 0 /* Halt */]);
      // a is a register
      vm.setRegister(32768, 3);
      vm.execute();
      assert.equal(vm.ip, 3, 'Unexpected instruction pointer value');
    });

    it('should throw an error if target is invalid');
  });

  describe('add', () => {
    it('should throw an error if first argument not a register', () => {
      let vm = getVmWithProgram([9 /* Add */, 1 /* Invalid register */, 1, 1]);
      let iThrowError = () => vm.execute();
      assert.throws(iThrowError, Error);
    });

    it('should sum numbers', () => {
      let vm = getVmWithProgram([9 /* Add */, 32768 /* Register 0 */, 25, 50]);
      vm.execute();
      let result = vm.readRegister(32768);
      assert.equal(result, 75, 'Unexpected result or result not in register');
    });

    it('should make calculations with modulo 32768', () => {
      let vm = getVmWithProgram([9 /* Add */, 32768 /* Register 0 */, 32760, 50]);
      vm.execute();
      let result = vm.readRegister(32768);
      let expectedResult = (32760 + 50) % 32768;
      assert.equal(result, expectedResult, 'Unexpected result or result not in register');
    });

    it('should use the register values if b and/or c are registers', () => {
      let vm = getVmWithProgram([9 /* Add */, 32768 /* Register 0 */, 32769 /* Register 1 */, 32770 /* Register 2 */]);
      // b and c are registers
      vm.setRegister(32769, 10);
      vm.setRegister(32770, 5);
      vm.execute();
      let result = vm.readRegister(32768);
      assert.equal(result, 15, 'Register 0 (result) should have been set 15');
    });

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([9 /* Add */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('mult', () => {
    it('should make calculations with modulo 32768', () => {
      let vm = getVmWithProgram([10 /* Add */, 32768 /* Register 0 */, 30000, 30000]);
      vm.execute();
      let result = vm.readRegister(32768);
      let expectedResult = (30000 * 30000) % 32768;
      assert.equal(result, expectedResult, 'Unexpected result or result not in register');
    });

    it('should use the register values if b and/or c are registers', () => {
      let vm = getVmWithProgram([10 /* Add */, 32768 /* Register 0 */, 32769 /* Register 1 */, 32770 /* Register 2 */]);
      // b and c are registers
      vm.setRegister(32769, 10);
      vm.setRegister(32770, 5);
      vm.execute();
      let result = vm.readRegister(32768);
      assert.equal(result, 50, 'Register 0 (result) should have been set 50');
    });

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([10 /* Mult */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('mod', () => {
    it('should use the register values if b and/or c are registers');

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([11 /* Mod */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('and', () => {
    it('should use the register values if b and/or c are registers');

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([12 /* And */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('or', () => {
    it('should use the register values if b and/or c are registers');

    it('should increment the instruction pointer by 4', () => {
      let vm = getVmWithProgram([13 /* Or */, 32768 /* Register 0 */, 1, 1]);
      assertRunAndChangesIp(vm, 4);
    });
  });

  describe('not', () => {
    it('should use the register value if b is a register');

    it('should increment the instruction pointer by 3', () => {
      let vm = getVmWithProgram([14 /* Not */, 32768 /* Register 0 */, 1 /* Value */]);
      assertRunAndChangesIp(vm, 3);
    });
  });

  describe('rmem', () => {
    it('should increment the instruction pointer by 3', () => {
      let vm = getVmWithProgram([15 /* Rmem */, 32768 /* Register 0 */, 1 /* Address */]);
      assertRunAndChangesIp(vm, 3);
    });
  });

  describe('wmem', () => {
    it('should increment the instruction pointer by 3', () => {
      let vm = getVmWithProgram([16 /* Wmem */, 1 /* Address */, 2000 /* Value */]);
      assertRunAndChangesIp(vm, 3);
    });
  });

  describe('call', () => {
    it('should write the address of the next instruction to the stack and jump to arg a', () => {
      let vm = getVmWithProgram([17 /* Call */, 3 /* Target */, 0 /* Halt */, 0 /* Halt */]);
      // Jumped to a
      assertRunAndChangesIp(vm, 3);
      // Address of next instruction on stack
      assert.equal(vm.stack[0], 2);
    });

    it('should use the register content as target if a is a register', () => {
      let vm = getVmWithProgram([17 /* Call */, 32768 /* Target, register 0 */, 0 /* Halt */, 0 /* Halt */]);
      vm.setRegister(32768, 3);
      // Jumped to address in register a
      assertRunAndChangesIp(vm, 3);
      // Address of next instruction on stack
      assert.equal(vm.stack[0], 2);
    });
  });

  describe('ret', () => {

  });

  describe('out', () => {
    it('should increment the instruction pointer by 2', () => {
      let vm = getVmWithProgram([19 /* Out */, 65 /* Char A */]);
      assertRunAndChangesIp(vm, 2);
    });
  });

  describe('in', () => {
    it('should increment the instruction pointer by 2');
  });

  describe('noop', () => {
    it('should increment the instruction pointer by 1', () => {
      let vm = getVmWithProgram([21]);
      assertRunAndChangesIp(vm, 1);
    });
  });
});