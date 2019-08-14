/* to be deleted */

// Returns false if any param is not an int.
exports.checkParamsInt = function(params) {
	if (params === null || params === undefined) return false; 
	for (let i = 0; i < params.length; i++) {
		if (Number.isInteger(parseInt(params[i])) === false) return false;
	}
	return true;
};

// Returns false if any param does not exit.
exports.checkParams = function(params) {
	if (params === null || params === undefined) return false; 
	for (let i = 0; i < params.length; i++) {
		if (!params[i]) return false;
	}
	return true;
};
