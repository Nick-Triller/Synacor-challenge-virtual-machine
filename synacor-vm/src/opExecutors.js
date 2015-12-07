'use strict';

let util = require('./util.js');

const executors = {
	halt: function halt(vm, args) {
		vm.halt = true;
	},
	
	set: function set(vm, args) {
		const register = args[0];
		let value = vm.literalOrRegisterValue(args[1]);
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op set');
		}
		vm.setRegister(register, value);
	},
	
	out: function out(vm, args) {
		const fs = require('fs');
		let value = vm.	literalOrRegisterValue(args[0]);
		let char = String.fromCharCode(value);
		fs.appendFileSync('./out.txt', char);
	},
	
	jmp: function jmp(vm, args) {
		// TODO: Check arg for validity
		// Target is exact address where execution is to be continued
		let target = vm.literalOrRegisterValue(args[0]) - args.length * 2;
		vm.ip = target * 2;
	},
	
	noop: function noop(vm, args) {
		return;
	}
};

module.exports = executors;