import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['search', 'поиск'];
export const description = 'Найти картинку в поисковых системах';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = false;

// global references
let message, utils;

export function execute(msg) {
	// save the message object
	message = msg;

	// get the referenced message and call the callback
	utils = msg.client.modules.get('utils');
	utils.getRefMessageAndCall(msg, refCallback);
}

function refCallback(refMessage) {
	// get the direct picture URL from the message/refMessage
	const url = utils.getPictureFromMessage(message) || utils.getPictureFromMessage(refMessage);
		
	// if a URL was found
	if (url) {
		// construct and send the result embed with links
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(cfg.embedColor)
					.setTitle('Поиск по картинке')
					.setDescription(
						`**Найти в [Google](http://www.google.com/searchbyimage?image_url=${url}&safe=off)**`
						+ `\n**Найти в [Яндексе](https://yandex.ru/images/search?rpt=imageview&url=${url})**`
						+ `\n**Найти в [SauceNAO](https://saucenao.com/search.php?db=999&url=${url})**`
					)
			]
		});
	}
	// if it wasn't
	else {
		message.reply('Нужно загрузить картинку, указать сообщение с ней или ссылку на неё.');
	}
}
