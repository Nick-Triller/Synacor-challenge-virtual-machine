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
	
	// push <a> onto the stack
	push: function push(vm, args) {
		let value = vm.literalOrRegisterValue(args[0]);
		vm.stack.push(value);
		vm.ip += 1 + args.length;
	},
	
	// remove the top element from the stack and write it into <a>; empty stack = error
	pop: function pop(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op pop');
		}
		let value = vm.stack.pop();
		if (value == null) throw new Error('Can not execute pop because stack is empty');
		vm.setRegister(register, value);
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
		if (b === c) vm.setRegister(register, 1);
		else vm.setRegister(register, 0);
		vm.ip += 1 + args.length;
	},
	
	// set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
	gt: function gt(vm, args) {
		const register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op eq');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		if (b > c) vm.setRegister(register, 1);
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
		let result = (c+b) % 32768;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length;
	},
	
	// store into <a> the product of <b> and <c> (modulo 32768)
	mult: function mult(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op mult');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		let result = (c*b) % 32768;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length
	},
	
	// store into <a> the remainder of <b> divided by <c>
	mod: function mod(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op mult');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		let result = b % c;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length;
	},
	
	// stores into <a> the bitwise and of <b> and <c>
	and: function and(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op and');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		let result = b & c;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length;
	},
	
	// stores into <a> the bitwise or of <b> and <c>
	or: function or(vm, args) {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op and');
		}
		let b = vm.literalOrRegisterValue(args[1]); 
		let c = vm.literalOrRegisterValue(args[2]);
		let result = b | c;
		vm.setRegister(register, result);
		vm.ip += 1 + args.length;
	},
	
	// stores 15-bit bitwise inverse of <b> in <a>
	not: (vm, args) => {
		let register = args[0];
		if (!util.isRegister(register)) {
			throw new Error('Expected register as first argument in op not');
		}
		let value = vm.literalOrRegisterValue(args[1]);
		
		let bitstring = "";
		while (value > 0 )
		{
			// Modulo
			let bit = value % 2 ;
			// Div
			let quotient = Math.floor(value/2);
			bitstring += bit.toString();
			value = quotient;
		}
		// Fill bitstring with zeros
		while (bitstring.length < 15) {
			bitstring += '0';
		}
		// Reverse
		bitstring.split('').reverse().join('');
		// Invert
		bitstring = bitstring.replace(/0/g, 'x');
		bitstring = bitstring.replace(/1/g, '0');
		bitstring = bitstring.replace(/x/g, '1');
		// Convert bitstring to number
		value = 0;
		for (let i = 0; i < bitstring.length; i++) {
			value += parseInt(bitstring[i]) *  Math.pow(2, i);
		}
		vm.setRegister(register, value);
		vm.ip += 1 + args.length;
	},
	
	// read memory at address <b> and write it to <a>
	rmem: function rmem(vm, args) {
		let writeTarget = args[0];
		let readAddress = vm.literalOrRegisterValue(args[1]);
		let value = vm.readMemory(readAddress);
		if (util.isRegister(writeTarget)) {
			vm.setRegister(writeTarget, value);
		}
		else if (util.isLiteral(writeTarget)) {
			vm.writeMemory(writeTarget, value)
		}
		else {
			throw new Error('Invalid write target in rmem');
		}
		vm.ip += 1 + args.length;
	},
	
	// write the value from <b> into memory at address <a>
	wmem: function wmem(vm, args) {
		let targetAddress = vm.literalOrRegisterValue(args[0]);
		let value = vm.literalOrRegisterValue(args[1]);
		vm.writeMemory(targetAddress, value);
		vm.ip += 1 + args.length;
	},
	
	// write the address of the next instruction to the stack and jump to <a>
	call: function call(vm, args) {
		vm.stack.push(vm.ip + 1 + args.length);
		let address = vm.literalOrRegisterValue(args[0]);
		vm.ip = address;
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