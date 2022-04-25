import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['quotes', 'цитаты'];
export const description = 'Получить цитаты из ВН по названию';
export const args = ['[title]'];
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = false;

// global references
let vndb, message, title, foundVN;

export function execute(msg) {
	// set global references
	vndb = msg.client.modules.get('vndb');
	message = msg;
	title = msg.argsline;

	vndb.vnSearch(title, vnCallback, message.errorHandler);
}

// callback for vnSearch()
function vnCallback(response) {
	foundVN = null;

	// array of vn objects
	const vns = response.items;

	// if there's only one VN, it must be the one we need
	if (vns.length == 1) {
		foundVN = vns[0];
		vndb.getQuotes(foundVN.id, quotesCallback, message.errorHandler);
	}

	// if there's no VNs, well, nothing we can do
	else if (vns.length == 0) {
		message.channel.send('Новелл с похожим названием не найдено.');
	}

	// if there's more than one VN
	else {
		// look through them all to find the full match
		vns.forEach(vn => {
			// compare the titles case-insentively
			if (vn.title.toLowerCase() == title.toLowerCase()) {
				foundVN = vn;
			}
		})

		// if we found a full match, it's the one
		if (foundVN) {
			vndb.getQuotes(foundVN.id, quotesCallback, message.errorHandler);
		}
		// if we didn't, send a message about that
		else {
			// construct the message's text
			let text = `По запросу \`${title}\` нет точного соответствия, укажите полное название.`;
			text += '\nНиже перечислены новеллы, которые могут подходить под этот запрос.';
			vns.forEach(vn => text += `\n> ${vn.title}`);

			message.channel.send(text);
		}
	}
}

// callback for getQuotes()
function quotesCallback(response) {
	if (response.items.length == 0) {
		message.channel.send('В базе VNDB нет цитат из этой новеллы.');
		return;
	}

	// prepare the description
	let quotes = '';
	response.items.forEach(q => quotes += '```' + q.quote + '      ```');

	// construct the embed
	const embed = new MessageEmbed()
		.setColor(cfg.embedColor)
		.setDescription(quotes);
	
	// send the quotes
	message.channel.send({ embeds: [embed] });
}
