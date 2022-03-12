import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const names = ['vn'];
export const description = 'Получить информацию о ВН по названию';
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
		vndb.getFullReleases(foundVN.id, releaseCallback, message.errorHandler);
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
			vndb.getFullReleases(foundVN.id, releaseCallback, message.errorHandler);
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

// callback for getFullReleases()
function releaseCallback(response) {
	let en = false, ru = false;

	// look through the releases to see if there are full en/ru releases
	response.items.forEach(r => {
		en |= r.languages.includes('en');
		ru |= r.languages.includes('ru');
	});

	// format the result as "translation" field
	let translation = 'None';
	if (en && ru) translation = 'English & Russian';
	else if (en && !ru) translation = 'English only';
	else if (!en && ru) translation = 'Russian only';
	foundVN.translation = translation;

	printInfo();
}

function printInfo() {
	// get various VN properties
	const description = vndb.formatDescription(foundVN.description);

	let length = ['<2', '2-10', '10-30', '30-50', '50+'][foundVN.length-1];
	if (length) length += ' hours';

	const writers = [], composers = [];
	foundVN.staff.forEach(s => {
		if (s.role == 'scenario') writers.push(`[${s.name}](https://vndb.org/s${s.sid})`);
		if (s.role == 'music')  composers.push(`[${s.name}](https://vndb.org/s${s.sid})`);
	});

	// required fields
	const embed = new MessageEmbed()
		.setColor(cfg.embedColor)
		.setTitle(foundVN.title)
		.setURL(`https://vndb.org/v${foundVN.id}`)
		.addField('Translation', foundVN.translation, true)
	
	// optional fields
	if (foundVN.image) embed.setThumbnail(foundVN.image);
	if (description) embed.setDescription(description);
	if (length) embed.addField('Length', length, true);
	if (writers.length > 0) embed.addField('Scenario', writers.join(', '), false);
	if (composers.length > 0) embed.addField('Music', composers.join(', '), false);
	if (foundVN.released) embed.setFooter(`Released in ${foundVN.released.substr(0, 4)}`);

	// send the vn info
	message.channel.send({ embeds: [embed] });
}
