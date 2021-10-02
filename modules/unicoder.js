// BBS - big binary string, 64 bits
// BDS - big decimal string, decimal representation of BBS

import { encode, decode } from 'base65536';

export const name = 'unicoder';

// encrypt the input with key and convert to base65536
export function encodeData(input, key) {
	const inputBBS = getBBS(input);
	const keyBBS = getBBS(key);
	const encrypted = xorBBSs(inputBBS, keyBBS);
	const encoded = encodeTo65536(encrypted);
	return encoded;
}

// decrypt the input with key and convert to base10
export function decodeData(input, key) {
	const decoded = decodeFrom65536(input);
	const keyBBS = getBBS(key);
	const decrypted = xorBBSs(decoded, keyBBS);
	const decimal = getBDS(decrypted);
	return decimal;
}

// convert a BDS to a BBS
function getBBS(bds) {
	return BigInt(bds).toString(2).padStart(64, '0');
}

// convert a BBS to a BDS
function getBDS(bbs) {
	const bigint = BigInt(`0b${bbs}`);
	return bigint.toString();
}

// XOR two BBSs into a new BBS
function xorBBSs(bbs1, bbs2) {
	let result = '';
	for (let i = 0; i < 64; i++) {
		result += bbs1[i] ^ bbs2[i];
	}
	return result;
}

// encode a BBS into a 4-character-long base65536 string
function encodeTo65536(bbs) {
	const sections = [];

	// divide the number into 8 chunks and convert them to decimal
	for (let i = 0; i < 8; i++) {
		const chunk = bbs.slice(8 * i, 8 * (i + 1));
		sections.push(parseInt(chunk, 2));
	}

	// encode the array to base65536
	const array = new Uint8Array(sections);
	return encode(array);
}

// decode a base65536 string into a BBS
function decodeFrom65536(encoded) {
	const array = decode(encoded);

	// reconstruct the BBS
	let bbs = '';
	array.forEach((section) => {
		bbs += section.toString(2).padStart(8, '0');
	});

	return bbs;
}
