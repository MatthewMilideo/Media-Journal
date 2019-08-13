const db = require("../db/index.js");

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

exports.modelRet = function(status, message, data) {
	return { status, message, data };
};

exports.errors = {
	"23505": { status: 409, message: "Duplicate Key violates Unique Constraint" },
	"23503": { status: 403, message: "Foreign Key Constraint" }
};

exports.query = async (query, values = null, errors) => {
	let dbRes;
	try {
		dbRes = await db.query(query, values);
	} catch (err) {
		let errArr = Object.keys(errors);

		for (let i = 0; i < errArr.length; i++) {
			let { status, message } = errors[errArr[i]];
			if (err.code === errArr[i]) return exports.modelRet(status, message, err);
		}
		return exports.modelRet(500, "There was an error ", err);
	}
	return dbRes.rowCount === 0
		? exports.modelRet(204, "No entry found", dbRes)
		: exports.modelRet(200, "Success", dbRes);
};
