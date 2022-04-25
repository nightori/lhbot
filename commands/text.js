import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';
import fancy from './../static/fancyText.js';

export const names = ['text', 'style', 'текст'];
export const description = 'Вывести заданный текст в разных стилях';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

const lowercase = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const uppercase = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

export function execute(msg) {
	// join all args to get the full input string
	const text = msg.argsline;

	// check whether the input text is empty
	if (!text) {
		msg.channel.send((msg.channel.type == 'DM') ? '...?' : '<:areyoustupid:459757690546290711>');
		return;
	}

	// the embed to be filled with styled text
	const embed = new MessageEmbed().setColor(cfg.embedColor);

	// go through each style
	const styleNames = Object.keys(fancy);
	for (let i = 0; i < styleNames.length; i++) {
		let styledText = '';

		// style each letter and concatenate
		for (const letter of text) {
			let styledLetter = getFancyLetter(letter, fancy[styleNames[i]]);

			// horrible КОСТЫЛЬ for a full-width space
			if (styleNames[i] == 'Full width' && styledLetter == ' ')
				styledLetter = '\u3000';

			styledText += styledLetter;
		}

		embed.addField(styleNames[i], styledText, true);
	}

	// finally, send the filled embed
	msg.channel.send({ embeds: [embed] });
}

// get the char's fancy version from the style
function getFancyLetter(letter, style) {
	// if it's a lowercase letter
	const lowerIndex = lowercase.indexOf(letter);
	if (lowerIndex != -1) return style['lowercase'][lowerIndex];

	// if it's an uppercase letter
	const upperIndex = uppercase.indexOf(letter);
	if (upperIndex != -1) return style['uppercase'][upperIndex];

	// if it's neither, just leave it there
	return letter;
}
