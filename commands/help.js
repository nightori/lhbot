const Discord = require('discord.js');
const cfg = require('./../config.json');

module.exports = {
	names: ['help'],
	description: 'Вывести список всех команд',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		// construct an embed
		const embed = new Discord.MessageEmbed()
			.setColor(cfg.embedColor)
			.setAuthor('Список команд');

		// add all commands and their descriptions as fields
		const descriptions = [];
		msg.client.commands.forEach(c => {
			if (!c.hidden && !descriptions.includes(c.description)) {
				let title = cfg.prefix + c.names[0];
				if (c.args) title += ' ' + c.args.join(' ');
				embed.addField(title, c.description);
				descriptions.push(c.description);
			}
		});
		msg.channel.send(embed);
	}
};