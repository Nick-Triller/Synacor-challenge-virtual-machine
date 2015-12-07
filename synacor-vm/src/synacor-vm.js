'use strict';

let operations = require('./operations.js');
let logger = require('winston');
let util = require('./util.js');

class SynacorVm {
	constructor() {
		// Registers
		this.registers = {
			32768: 0,
			32769: 0,
			32770: 0,
			32771: 0,
			32772: 0,
			32773: 0,
			32774: 0,
			32775: 0
		};
		// Instruction pointer
		this.ip = 0;
		// Unbounded stack which holds 16-bit values
		this.stack = [];
		// Memory with 15-bit address space storing 16-bit values
		this.ram = [];
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
		// TODO: Check register health on each step
		logger.log('debug', `IP ${this.ip}`);
		const opcode = parseInt(this.ram[this.ip]);
		logger.log('debug', `Opcode ${opcode}`);
		const operation = operations[opcode];
		if ( operation == null) {
			throw new Error('Invalid opcode: ' + opcode);
		}
		logger.log('debug', `Operation ${operation.name}`);
		// Execute op
		const argCount = operations[opcode].argCount;
		// Read arguments
		let args = [];
		for (let i = 1; i <= argCount; ++i) {
			logger.log('debug', 'Reading arg');
			args.push(this.ram[this.ip + i]);
		}
		operations[opcode].execute(this, args);
		// Update instruction pointer
		operations[opcode].updateIp(this);
		logger.log('debug', '-------------');
	}
	
	literalOrRegisterValue(opcode) {
		if (util.isLiteral(opcode)) return opcode;
		if (util.isRegister(opcode)) return this.registers[opcode];
		throw new Error('Invalid opcode in literalOrRegisterValue: ' + opcode);
 	}
	
	setRegister(opcode, value) {
		if (opcode < 32768 || opcode > 32775) throw new Error('Invalid arg index in setRegister: ' + opcode);
		this.registers[opcode] = value;
	}
	
	readRegister(opcode) {
		if (opcode < 32768 || opcode > 32775) throw new Error('Invalid arg index in readRegister: ' + opcode);
		return this.registers[opcode];
	}

	loadProgram(buffer) {
		if (buffer.length * 2 > Math.pow(2, 15)) {
			throw new Error('Can not load program because it is too big');
		}
		this.ram = buffer;
	}
	
}

module.exports = SynacorVm;