/* Helper Functions for validation in the controllers. */

/*
I need to switch over to Typescript...
Given an object {ints: [], strings: []}
This function returns true either if the arrays are empty, or 
if the arrays contain all values of their 'type'
*/

exports.checkArgs = function(argObj) {
	if (
		typeof argObj === "object" &&
		argObj !== null &&
		!(argObj instanceof Array)
	) {
		const { ints, strings } = argObj;
		if (ints instanceof Array && strings instanceof Array) {
			for (let i = 0; i < ints.length; i++) {
				if (!Number.isInteger(parseInt(ints[i]))) return false;
			}
			for (let i = 0; i < strings.length; i++) {
				if (!strings[i] || typeof strings[i] !== "string") {
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

/*
Given a media object (representation of a media database entry)
This function returns true if valid and false if invalid. 
*/

exports.checkMediaObj = function(obj) {
	const typeArr = ["MOVIE", "TV_SEASON", "BOOK", "GAME"];
	if (typeof obj === "object" && obj !== null) {
		if (!obj.title) return false;
		if (typeof obj.title !== "string") return false;
		if (!obj.type) return false;
		if (!typeArr.includes(obj.type)) return false;
		if (!obj.CID) return false;
		if (typeof obj.CID !== "string") return false;
		return true;
	}
	return false;
};

exports.checkArgsAndMedia = function(argObj, mediaObj){
    if ( ! (checkArgs(argObj) && checkMediaObj(mediaObj)) ) return false; 
    return true; 
}


/* ~~~~~ Variables for testing ~~~~~ */

let validArgsObj = {
    strings: ['hello', 'hello'],
    ints: [1,2,3,4]
}

let validMediaObj = {
    title: 'The Movie',
    CID: '1234',
    type: 'MOVIE'
}

let invalidArgsObj = {
    strings: ['hello', 'hello'],
    ints: [1,2,3,'hello']
}

let invalidMediaObj = {
    title: 'The Movie',
    CID: '1234',
    type: 'test'
}


