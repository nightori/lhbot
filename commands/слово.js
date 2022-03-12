import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['слово', 'словарь'];
export const description = 'Найти в словаре заданное слово';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

export function execute(msg) {
	const dict = msg.client.modules.get('dictionary');

	// if there's no word provided, just use a random word instead lmao
	const word = msg.args[0] ? msg.args[0].toLowerCase() : dict.getRandomWord();

	// get the definition and send it
	const def = dict.getDefinition(word);
	if (def) {
		const embed = new MessageEmbed()
			.setColor(cfg.embedColor)
			.setTitle(word)
			.setDescription(def);
		msg.channel.send({ embeds: [embed] });
	}
	else {
		msg.channel.send('К сожалению, такого слова в словаре нет.');
	}
}
