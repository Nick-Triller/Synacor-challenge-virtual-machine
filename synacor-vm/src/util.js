
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