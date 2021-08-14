const Discord = require('discord.js');
const cfg = require('./../config.json');

// shared objects
let message;

module.exports = {
	names: ['quote'],
	description: 'Получить случайную цитату из ВН',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		// save a reference to the message
		message = msg;

		const vndb = msg.client.modules.get('vndb');
		vndb.getRandomQuote(quoteCallback, message.errorHandler);
	}
};

// callback for getRandomQuote()
function quoteCallback(response) {
	const quote = response.items[0];

	if (quote) {
		message.channel.send(
			new Discord.MessageEmbed()
				.setColor(cfg.embedColor)
				.addField(quote.quote, `*from [${quote.title}](https://vndb.org/v${quote.id})*`)
		)
	}
	else {
		message.errorHandler('Каким-то образом цитата не найдена!');
	}
}