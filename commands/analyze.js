export const names = ['analyze'];
export const description = 'Вывести информацию о сообщении в консоль';
export const args = null;
export const restricted = true;
export const serverOnly = false;
export const hidden = true;

// global references
let message;

export function execute(msg) {
	// save the message object
	message = msg;

	// get the referenced message and call the callback
	const utils = msg.client.modules.get('utils');
	utils.getRefMessageAndCall(msg, callback);
}

function callback(refMsg) {
	console.log('\n******MESSAGE DUMP START******\n');
	console.log(refMsg || message);
	console.log('\n******MESSAGE DUMP END******\n');
}
