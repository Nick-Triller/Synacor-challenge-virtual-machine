
module.exports.isLiteral = function isLiteral(opcode) {
	if (opcode < 0) throw new Error('Opcodes can not be negative');
	if (opcode > 32767) return false;
	return true;
}
	
// 32 768 - 32 775
module.exports.isRegister = function isRegister(opcode) {
	if (opcode < 32768 || opcode > 32775) return false;
	return true;
}

module.exports.isLiteralOrRegister = function isRegister(opcode) {
	if (module.exports.isRegister(opcode)) return true;
	if (module.exports.isLiteral(opcode)) return true;
    return false;
}

module.exports.isValidMemoryAddress = function isValidMemoryAddress(opcode) {
	// TODO: Implement
}

module.exports.toArrayBuffer = function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}