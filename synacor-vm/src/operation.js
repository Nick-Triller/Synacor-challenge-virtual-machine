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
		vm.ip += 1 + this.argCount;
	}
}

module.exports = Operation;