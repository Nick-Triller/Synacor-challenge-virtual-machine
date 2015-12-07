'use strict';

let SynacorVm = require('./src/synacor-vm.js');

// Clear out.txt
let fs = require('fs');
fs.truncateSync('./out.txt', 0);

let synacorVm = new SynacorVm();
let program = createProgram();

synacorVm.loadProgram(program);
synacorVm.execute();


function createProgram() {
	const buffer = new ArrayBuffer(1000);
	const view = new Uint16Array(buffer);
	
	view[0] = 21; 		// noop
	view[1] = 21; 		// noop
	view[2] = 19; 		// out
	view[3] = 33; 		// 	arg !
	view[4] = 1; 			// Set register
	view[5] = 32768; 	// 	Register0
	view[6] = 35; 		// 	arg #
	view[7] = 19; 		// out
	view[8] = 32768; 	// 	arg register0
	
	return view;
}