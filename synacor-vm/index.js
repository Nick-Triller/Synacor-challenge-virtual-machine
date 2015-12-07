'use strict';

let SynacorVm = require('./src/synacor-vm.js');

// Clear out.txt
let fs = require('fs');
fs.truncateSync('./out.txt', 0);

let synacorVm = new SynacorVm();
runChallenge();
synacorVm.execute();

function runTestProgram() {
	let program = createProgram();
	synacorVm.loadProgram(program);
}

function runChallenge() {
	synacorVm.loadProgramFromFile('../challenge.bin');
}

function createProgram() {
	const arrBuff = new ArrayBuffer(20);
	const view = new DataView(arrBuff);
	
	view.setUint16(0, 21, true);		// noop
	view.setUint16(2, 21, true);		// noop
	view.setUint16(4, 19, true);		// out
	view.setUint16(6, 33, true);			// 	arg !
	view.setUint16(8, 1, true);			// Set register
	view.setUint16(10, 32768, true);		// 	Register0
	view.setUint16(12, 35, true);			// 	arg #
	view.setUint16(14, 19, true);		// out
	view.setUint16(16, 32768, true);		// 	arg register0
	view.setUint16(18, 0, true);		// halt
	
	return arrBuff;
}