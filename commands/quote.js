import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['quote'];
export const description = 'Получить случайную цитату из ВН';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const hidden = false;

// global references
let message;

export function execute(msg) {
	// save a reference to the message
	message = msg;

	const vndb = msg.client.modules.get('vndb');
	vndb.getRandomQuote(quoteCallback, message.errorHandler);
}

// callback for getRandomQuote()
function quoteCallback(response) {
	const quote = response.items[0];

	if (quote) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(cfg.embedColor)
					.addField(quote.quote, `*from [${quote.title}](https://vndb.org/v${quote.id})*`)
			]
		})
	}
	else {
		message.errorHandler('Каким-то образом цитата не найдена!');
	}
}
