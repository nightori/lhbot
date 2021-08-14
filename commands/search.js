const Discord = require('discord.js');
const cfg = require('./../config.json');

// shared objects
let message, utils;

module.exports = {
	names: ['search'],
	description: 'Найти картинку в различных поисковых системах',
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
		// construct and send the result embed with links
		message.channel.send(
			new Discord.MessageEmbed()
				.setColor(cfg.embedColor)
				.setTitle('Поиск по картинке')
				.setDescription(
					`**Найти в [Google](http://www.google.com/searchbyimage?image_url=${url}&safe=off)**`
					+ `\n**Найти в [Яндексе](https://yandex.ru/images/search?rpt=imageview&url=${url})**`
					+ `\n**Найти в [SauceNAO](https://saucenao.com/search.php?db=999&url=${url})**`
				)
		)
	}
	// if it wasn't
	else {
		message.respond('Нужно загрузить картинку, указать сообщение с ней или ссылку на неё.');
	}
}
