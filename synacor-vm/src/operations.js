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
	5: new Operation('gt', 3, opExecutors.gt),
	6: new Operation('jmp', 1, opExecutors.jmp),
	7: new Operation('jt', 2, opExecutors.jt),
	8: new Operation('jf', 2, opExecutors.jf),	
	9: new Operation('add', 3, opExecutors.add),	
	10: new Operation('mult', 3, opExecutors.mult),	
	11: new Operation('mod', 3, opExecutors.mod),	
	12: new Operation('and', 3, opExecutors.and),	
	13: new Operation('or', 3, opExecutors.or),		
	14: new Operation('not', 2, opExecutors.not),		
	15: new Operation('rmem', 2, opExecutors.rmem),
	16: new Operation('wmem', 2, opExecutors.wmem),
	17: new Operation('call', 1, opExecutors.call),		
	19: new Operation('out', 1, opExecutors.out),
	21: new Operation('noop', 0, opExecutors.noop),
}

