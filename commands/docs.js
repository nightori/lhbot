const Discord = require('discord.js');
const cfg = require('./../config.json');

module.exports = {
	names: ['docs'],
	description: 'Вывести ссылки на документацию',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(cfg.embedColor)
				.addField('Руководство', 'https://discordjs.guide/')
				.addField('Документация', 'https://discord.js.org/#/docs')
				.addField('Про кнопки', 'https://discord-buttons.js.org/docs/stable/')
		);
	}
};