'use strict';

class Operation {
	constructor(name, argCount, execute) {
		if (name == null || argCount == null || execute == null) {
			throw new Error('Argument null exception in Operation constructor');
		}
		this.name = name;
		this.argCount = argCount;
		this.executor = execute;
	}
	
	execute(vm, args) {
		if(args.length != this.argCount) {
			throw new Error(`Operation ${this.name} received wrong number of arguments`);
		}
		this.executor(vm, args);
	}
	
	// Update instruction pointer
	updateIp(vm) {
		// 2 byte steps
		vm.ip += 2 + this.argCount * 2;
	}
}

module.exports = Operation;