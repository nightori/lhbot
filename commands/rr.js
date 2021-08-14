const Discord = require('discord.js');
const cfg = require('./../config.json');

let stage = 0;

module.exports = {
	names: ['rr', 'roulette'],
	description: 'Сыграть в русскую рулетку',
	args: null,
	restricted: false,
	serverOnly: true,
	hidden: false,
	execute(msg) {
		// get the utils module
		const utils = msg.client.modules.get('utils');

		const member = utils.getMemberByMessage(msg);
		const name = utils.getName(member);

		// optional argument to spin the barrel
		if (msg.args[0] == 'spin') {
			msg.channel.send(`**${name}** вращает барабан!`);
			stage = 0;
			return;
		}

		// remaining shots and survival chance
		const max = 6 - stage++;
		let chance = 100 - Math.floor(100 / max);
		let shot = utils.getRandomInt(1, max);

		// guaranteed shot if the argument is "suicide"
		if (msg.args[0] == 'suicide') {
			chance = 0;
			shot = 1;
		}

		// construct the message embed
		const embed = new Discord.MessageEmbed()
			.setColor(cfg.embedColor)
			.setAuthor(name, 'https://nightori.ru/f/lhbot/gun.png')
			.setFooter(`Вероятность выживания ${chance}%`);

		// actual game
		if (shot == 1) {
			member.kick().catch(msg.errorHandler);
			embed.setTitle('БУМ НАХУЙ!')
			stage = 0;
		}
		else {
			embed.setTitle('Повезло!')
		}
		msg.channel.send(embed);
	}
};