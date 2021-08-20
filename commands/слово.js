const Discord = require('discord.js');
const cfg = require('./../config.json');

module.exports = {
	names: ['слово', 'словарь'],
	description: 'Найти в словаре заданное слово',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		dict = msg.client.modules.get('dictionary');

		// if there's no word provided, just use a random word instead lmao
		const word = msg.args[0] ? msg.args[0].toLowerCase() : dict.getRandomWord();
		
		// get the definition and send it
		const def = dict.getDefinition(word);
		if (def) {
			const embed = new Discord.MessageEmbed()
				.setColor(cfg.embedColor)
				.setTitle(word)
				.setDescription(def);
			msg.channel.send(embed);
		}
		else {
			msg.channel.send('К сожалению, такого слова в словаре нет.');
		}
	}
};