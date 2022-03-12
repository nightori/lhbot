import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['docs'];
export const description = 'Вывести ссылки на документацию';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = true;

export function execute(msg) {
	msg.channel.send({
		embeds: [
			new MessageEmbed()
				.setColor(cfg.embedColor)
				.addField('Руководство', 'https://discordjs.guide/')
				.addField('Документация', 'https://discord.js.org/#/docs')
		]
	});
}
