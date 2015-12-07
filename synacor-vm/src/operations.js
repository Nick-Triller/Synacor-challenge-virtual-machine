'use strict';

let Operation = require('./operation.js');
let opExecutors = require('./opExecutors.js')


// Key is opcode
module.exports = {
	0: new Operation('halt', 0, opExecutors.halt),
	1: new Operation('set', 2, opExecutors.set),
	2: new Operation('push', 1, opExecutors.push),
	3: new Operation('pop', 1, opExecutors.pop),	
	4: new Operation('eq', 3, opExecutors.eq),
	6: new Operation('jmp', 1, opExecutors.jmp),
	7: new Operation('jt', 2, opExecutors.jt),
	8: new Operation('jf', 2, opExecutors.jf),	
	9: new Operation('add', 3, opExecutors.add),	
	19: new Operation('out', 1, opExecutors.out),
	21: new Operation('noop', 0, opExecutors.noop),
}

