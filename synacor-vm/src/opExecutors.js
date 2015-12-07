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
		// Update ip
		vm.ip += 1 + args.length;
	},
	
	// set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
	eq: function eq(vm, args) {
		const register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op eq');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		console.log('b', b, 'c', c);
		if (b === c) vm.setRegister(register, 1);
		else vm.setRegister(register, 0);
		vm.ip += 1 + args.length;
	},
	
	out: function out(vm, args) {
		const fs = require('fs');
		let value = vm.literalOrRegisterValue(args[0]);
		let char = String.fromCharCode(value);
		fs.appendFileSync('./out.txt', char);
		// Update ip
		vm.ip += 1 + args.length;
	},
	
	jmp: function jmp(vm, args) {
		// TODO: Check arg for validity
		let target = vm.literalOrRegisterValue(args[0]);
		// Update ip
		vm.ip = target;
	},
	
	// if <a> is nonzero, jump to <b>
	jt: function jt(vm, args) {
		let condition = vm.literalOrRegisterValue(args[0]);
		let target = vm.literalOrRegisterValue(args[1]);
		if (condition === 0){
			vm.ip += 1 + args.length;
		}
		else {
			vm.ip = target;
		}
	},
	
	// assign into <a> the sum of <b> and <c> (modulo 32768)
	add: function add(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op add');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		console.log('B', b);
		console.log('C', c);
		let result = (c+b) % 32768;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length;
	},
	
	// if <a> is zero, jump to <b>
	jf: function jf(vm, args) {
		let condition = vm.literalOrRegisterValue(args[0]);
		let target = vm.literalOrRegisterValue(args[1]);
		if (condition !== 0){
			vm.ip += 1 + args.length;
		}
		else {
			vm.ip = target;
		}
	},
	
	noop: function noop(vm, args) {
		// Update ip
		vm.ip += 1;
		return;
	}
};

module.exports = executors;