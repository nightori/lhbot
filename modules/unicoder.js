const encoder = require('base65536');

// BBS - big binary string, 64 bits
// BDS - big decimal string, decimal representation of BBS

module.exports = {
	name: 'unicoder',
	
	// PUBLIC API

	// encrypt the input with key and convert to base65536
	encode(input, key) {
		let inputBBS = this.getBBS(input);
		let keyBBS = this.getBBS(key);
		let encrypted = this.xorBBSs(inputBBS, keyBBS);
		let encoded = this.encodeTo65536(encrypted);
		return encoded;
	},

	// decrypt the input with key and convert to base10
	decode(input, key) {
		let decoded = this.decodeFrom65536(input);
		let keyBBS = this.getBBS(key);
		let decrypted = this.xorBBSs(decoded, keyBBS);
		let decimal = this.getBDS(decrypted);
		return decimal;
	},

	// INTERNAL STUFF

	// convert a BDS to a BBS
	getBBS(bds) {
		return BigInt(bds).toString(2).padStart(64, '0');
	},

	// convert a BBS to a BDS
	getBDS(bbs) {
		const bigint = BigInt(`0b${bbs}`);
		return bigint.toString();
	},

	// XOR two BBSs into a new BBS
	xorBBSs(bbs1, bbs2) {
		let result = '';
		for (let i = 0; i < 64; i++) {
			result += bbs1[i] ^ bbs2[i];
		}
		return result;
	},

	// encode a BBS into a 4-character-long base65536 string
	encodeTo65536(bbs) {
		let sections = [];

		// divide the number into 8 chunks and convert them to decimal
		for (let i = 0; i < 8; i++) {
			const chunk = bbs.slice(8 * i, 8 * (i+1) ); 
			sections.push(parseInt(chunk, 2));
		}

		// encode the array to base65536
		const array = new Uint8Array(sections);
		return encoder.encode(array);
	},

	// decode a base65536 string into a BBS
	decodeFrom65536(encoded) {
		const array = encoder.decode(encoded);
		
		// reconstruct the BBS
		let bbs = '';
		array.forEach((section) => {
			bbs += section.toString(2).padStart(8, '0');
		});

		return bbs;
	}
};