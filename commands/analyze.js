// shared objects
let message;

module.exports = {
	names: ['analyze'],
	description: 'Вывести информацию о сообщении в консоль',
	args: null,
	restricted: true,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		// save the message object
		message = msg;

		// get the referenced message and call the callback
		const utils = msg.client.modules.get('utils');
		utils.getRefMessageAndCall(msg, callback);
	}
};

function callback(refMsg) {
	console.log('\n******MESSAGE DUMP START******\n');
	console.log(refMsg || message);
	console.log('\n******MESSAGE DUMP END******\n');
}