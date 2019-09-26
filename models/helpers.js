/* Helper Functions for validation in the models. */

/* I need to switch over to Typescript...
Given an object {ints: [], strings: []}
This function returns true either if the arrays are empty, or 
if the arrays contain all values of their 'type' */

function flatten(arr) {
	return arr.reduce(function(flat, toFlatten) {
		return flat.concat(
			Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
		);
	}, []);
}

exports.checkArgs = function(ints, strings = []) {
	if (ints instanceof Array && strings instanceof Array) {
		ints = flatten(ints);
		for (let i = 0; i < ints.length; i++) {
			if (typeof ints[i] === "object") {
				return false;
			}
			if (!Number.isInteger(parseInt(ints[i]))) {
				return false;
			}
		}
		strings = flatten(strings);
		for (let i = 0; i < strings.length; i++) {
			if (!strings[i] || typeof strings[i] !== "string") {
				return false;
			}
		}
		return true;
	}
	return false;
};

/* Given a media object (representation of a media database entry)
This function returns true if valid and false if invalid. */
const typeArr = ["MOVIE", "TV", "BOOK", "GAME"];
exports.checkMediaObj = function(obj) {
	console.log(' the obj in media obj is', obj);
	if (typeof obj === "object" && obj !== null) {
		if (!obj.title) return false;
		if (typeof obj.title !== "string") return false;
		if (!obj.type) return false;
		if (!typeArr.includes(obj.type)) return false;
		if (!obj.CID) return false;
		console.log('hallo');
		return true;
	}
	return false;
};

/* Checks that the type is valid */
exports.checkMediaType = function(type) {
	if (typeof type !== "string") return false;
	if (!typeArr.includes(type)) return false;
	return true;
};

/* Checks that an array of objects containg CID Type pairs is valid */
exports.checkCIDType = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;
		if (!arr[i].CID) return false;
		if (!arr[i].type) return false;
		if (!exports.checkMediaType(arr[i].type)) return false;
	}
	return true;
};

/* Checks that an array of objects containg CID Type pairs is valid */
exports.checkCIDTypeUser = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;

		if (!arr[i].CID) return false;
		if (!arr[i].type) return false;
		if (!exports.checkMediaType(arr[i].type)) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
	}
	return true;
};

exports.checkMediaIDUserID = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;
		if (!arr[i].media_id) return false;
		if (!Number.isInteger(parseInt(arr[i].media_id))) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
	}
	return true;
};

exports.checkTagIDUserID = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i].tag_id) return false;
		if (!Number.isInteger(parseInt(arr[i].tag_id))) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
	}
	return true;
};

exports.checkNoteIDUserID = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;
		if (!arr[i].note_id) return false;
		if (!Number.isInteger(parseInt(arr[i].note_id))) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
	}
	return true;
};

exports.checkNoteTag = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;
		if (!arr[i].note_id) return false;
		if (!Number.isInteger(parseInt(arr[i].note_id))) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
		if (!arr[i].title) return false;
	}
	return true;
};

exports.checkNTAll = function(arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) return false;
		if (!arr[i].note_id) return false;
		if (!Number.isInteger(parseInt(arr[i].note_id))) return false;
		if (!arr[i].user_id) return false;
		if (!Number.isInteger(parseInt(arr[i].user_id))) return false;
		if (!arr[i].tag_id) return false;
		if (!Number.isInteger(parseInt(arr[i].tag_id))) return false;
	}
	return true;
};

/* Wrapper function for checkArgs and CheckMediaObj together.  */

exports.checkArgsAndMedia = function(ints, strings, mediaObj) {
	console.log(ints, strings, mediaObj);
	if (!(exports.checkArgs(ints, strings) && exports.checkMediaObj(mediaObj))) {
		return false;
	}
	return true;
};

exports.checkArgsType = function(ints, strings, type) {
	if (!(exports.checkArgs(ints, strings) && exports.checkMediaType(type))) {
		return false;
	}
	return true;
};

/* ~~~~~ Variables for testing ~~~~~ */

/*

let validInts1 = [1, 2, 3, 4]; 
let validInts2 = []; 
let invalidInts1 = ['hello']; 
let invalidInts2 = [{}]; 
let invalidInts3 = [[1]]; 

let validStrings1 = ['hello', 'hello'];
let validStrings2 = [];
let invalidStrings1 = [1]
let invalidStrings2 = [{}]; 
let invalidStrings3 = [['hi']]; 



let validMediaObj = {
	title: "The Movie",
	CID: "1234",
	type: "MOVIE"
};

let invalidArgsObj = {
	strings: ["hello", "hello"],
	ints: [1, 2, 3, "hello"]
};

let invalidMediaObj = {
	title: "The Movie",
	CID: "1234",
	type: "test"
};

console.log('~~~~ Should Print true ~~~~~~~~~~')

console.log(checkArgs(validInts1, validStrings1)); 
console.log(checkArgs(validInts2, validStrings1)); 
console.log(checkArgsAndMedia(validInts1,validStrings1, validMediaObj));


console.log('~~~~ Should Print false ~~~~~~~~~~')
console.log(checkArgs(invalidInts1, validStrings1)); 
console.log(checkArgs(invalidInts2, validStrings1)); 
console.log(checkArgs(invalidInts3, validStrings1)); 
console.log(checkArgs(validInts1, invalidStrings1)); 
console.log(checkArgs(validInts1, invalidStrings2)); 
console.log(checkArgs(validInts1, invalidStrings3)); 


console.log(checkArgsAndMedia(invalidInts1,validStrings1, validMediaObj));
console.log(checkArgsAndMedia(validInts1,invalidStrings1, validMediaObj));
console.log(checkArgsAndMedia(validInts1,validStrings1, invalidMediaObj));
console.log(checkArgsAndMedia(invalidInts1,invalidStrings1, invalidMediaObj));

*/
