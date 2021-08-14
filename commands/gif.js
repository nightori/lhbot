const Discord = require('discord.js');
const request = require('request');

// shared objects
let message, utils;

module.exports = {
	names: ['gif'],
	description: 'Сконвертировать картинку в gif',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		// save the message object
		message = msg;

		// get the referenced message and call the callback
		utils = msg.client.modules.get('utils');
		utils.getRefMessageAndCall(msg, refCallback);
	}
};

function refCallback(refMessage) {
	// get the direct picture URL from the message/refMessage
	const url = utils.getPictureFromMessage(message) || utils.getPictureFromMessage(refMessage);
		
	// if a URL was found
	if (url) {
		// download and resend with "gif" extension
		// dunno why this works but I'm not complaining
		request({url, encoding: null}, (err, resp, buffer) => {
			message.channel.send(new Discord.MessageAttachment(buffer, `converted.gif`));
		});
	}
	// if it wasn't
	else {
		message.respond('Нужно загрузить картинку, указать сообщение с ней или ссылку на неё.');
	}
}