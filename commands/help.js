import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['help', 'хелп', 'справка', 'помощь'];
export const description = 'Вывести список всех команд';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = true;

export function execute(msg) {
	// construct an embed
	const embed = new MessageEmbed()
		.setColor(cfg.embedColor)
		.setAuthor('Список команд')
		.setFooter('Отмеченные курсивом команды можно использовать только в бот-каналe.');

	// add all commands and their descriptions as fields
	const descriptions = [];
	msg.client.commands.forEach(c => {
		if (!c.hidden && !descriptions.includes(c.description)) {
			let title = cfg.prefix + c.names[0];
			if (c.args) {
				title += ' ' + c.args.join(' ');
			}
			if (c.botChannelOnly) {
				title = `*${title}*`;
			}

			embed.addField(title, c.description, true);
			descriptions.push(c.description);
		}
	});
	msg.channel.send({ embeds: [embed] });
}
