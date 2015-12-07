'use strict';

let operations = require('./operations.js');
let logger = require('winston');
let util = require('./util.js');
let fs = require('fs');


class SynacorVm {
	constructor() {
		// Registers 32768-32775
		this.registers = {};
		for (let i = 32768; i < 32776; i++) {
			this.registers[i] = 0;
		}
		// Instruction pointer
		this.ip = 0;
		// Unbounded stack which holds 16-bit values
		this.stack = [];
		// Memory with 15-bit address space storing 16-bit values
		let ramBuffer = new ArrayBuffer(Math.pow(2, 16));
		this.ram = new DataView(ramBuffer);
		// Halt flag
		this.halt = false;
		// Logger
		this.logger = logger;
		this.logger.level = 'debug';
	}

	execute() {
		while (!this.halt) this.executeStep();
	}

	executeStep() {
		// TODO: Check register and memory health on each step
		logger.log('debug', `IP ${this.ip}`);
		const opcode = parseInt(this.readMemory(this.ip));
		logger.log('debug', `Opcode ${opcode}`);
		const operation = operations[opcode];
		if (operation == null) {
			throw new Error('Invalid opcode: ' + opcode);
		}
		logger.log('debug', `Operation ${operation.name}`);
		const argCount = operations[opcode].argCount;
		// Read arguments
		let args = [];
		for (let i = 1; i <= argCount; ++i) {
			let arg = this.readMemory(this.ip + i);
			logger.log('debug', 'Reading arg at ' + (this.ip + i) + ': ' + arg);
			args.push(arg);
		}
		// Execute op
		operations[opcode].execute(this, args);
		logger.log('debug', '-------------');
	}

	literalOrRegisterValue(opcode) {
		if (util.isLiteral(opcode)) return opcode;
		if (util.isRegister(opcode)) return this.registers[opcode];
		throw new Error('Invalid opcode in literalOrRegisterValue: ' + opcode);
	}

	readMemory(address) {
		// TODO: Implement range check
		address *= 2;
		return this.ram.getUint16(address, true);
	}

	writeMemory(address, value) {
		address *= 2;
		if (!util.isLiteralOrRegister(value)) {
			throw new Error('Invalid value in writeMemory: ' + value);
		}
		this.ram.setUint16(address, value, true);
	}

	setRegister(opcode, value) {
		if (opcode < 32768 || opcode > 32775) throw new Error('Invalid arg index in setRegister: ' + opcode);
		logger.log('debug', `Setting register ${opcode-32768} to ${value}`);
		this.registers[opcode] = value;
	}

	readRegister(opcode) {
		if (opcode < 32768 || opcode > 32775) throw new Error('Invalid arg index in readRegister: ' + opcode);
		return this.registers[opcode];
	}

	loadProgram(arrBuffer) {
		const view = new DataView(arrBuffer);
		// TODO: reset memory
		for (let i = 0; i < view.byteLength/2; ++i) {
			let value = view.getUint16(i*2, true);
			this.writeMemory(i, value);
		}
	}

	loadProgramFromFile(path) {
		let buffer = fs.readFileSync(path);
		let arrBuffer = util.toArrayBuffer(buffer);
		this.loadProgram(arrBuffer);
	}
}

module.exports = SynacorVm;