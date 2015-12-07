'use strict';

let Operation = require('./operation.js');
let opExecutors = require('./opExecutors.js')


// Key is opcode
module.exports = {
	0: new Operation('halt', 0, opExecutors.halt),
	1: new Operation('set', 2, opExecutors.set),
	19: new Operation('out', 1, opExecutors.out),
	21: new Operation('noop', 0, opExecutors.noop),
}

