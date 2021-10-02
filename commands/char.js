import { MessageEmbed } from 'discord.js';
import dayjs from 'dayjs';

export const names = ['char', 'character'];
export const description = 'Получить информацию о персонаже ВН по имени';
export const args = ['[name]'];
export const restricted = false;
export const serverOnly = false;
export const hidden = false;

// global references
let vndb, message, foundChar;

export function execute(msg) {
	// set global references
	vndb = msg.client.modules.get('vndb');
	message = msg;

	vndb.getCharInfo(msg.argsline, charCallback, message.errorHandler);
}

// callback for getCharInfo()
function charCallback(response) {
	// get the first character in the response
	foundChar = response.items[0];
	
	// if it exists
	if (foundChar) {
		// get an array of VNs this character appears in
		const vns = [];
		foundChar.vns.forEach(vn => vns.push(vn[0]));

		vndb.getVnInfo(vns, vnsCallback, message.errorHandler);
	}

	// if it doesn't, well, nothing we can do
	else {
		message.channel.send('Персонажей с похожим именем не найдено.');
	}
}

// callback for getVnInfo()
function vnsCallback(response) {
	// replace former vns array with new array of full vn info
	foundChar.vns = response.items;

	// if there's no data about CV
	if (foundChar.voiced.length == 0) {
		// just skip to the next step
		printInfo();
	}
	else {
		// get an array of staff IDs this character was voiced by
		const ids = [];
		foundChar.voiced.forEach(cv => ids.push(cv.id));

		vndb.getStaffInfo(ids, staffCallback, message.errorHandler);
	}
}

// callback for getStaffInfo()
function staffCallback(response) {
	// replace former voiced array with new array of full staff info
	foundChar.voiced = response.items;
	printInfo();
}

function printInfo() {
	// get various character properties
	const description = vndb.formatDescription(foundChar.description);

	const colors = {m: '#1A90D5', f: '#CC1A46', b: '#8D1ACC'};
	const genderedColor = colors[foundChar.gender] || '#A5A5A5';

	const birthday = getBirthdayField();

	const voiced = [], vns = [];
	foundChar.voiced.forEach(cv => voiced.push(`[${cv.name}](https://vndb.org/s${cv.id})`));
	foundChar.vns.forEach(vn =>	vns.push(`[${vn.title}](https://vndb.org/v${vn.id})`));

	// required fields
	const embed = new MessageEmbed()
		.setColor(genderedColor)
		.setTitle(foundChar.name)
		.setURL(`https://vndb.org/c${foundChar.id}`)
	
	// optional fields
	if (foundChar.image) embed.setThumbnail(foundChar.image);
	if (foundChar.description) embed.setDescription(description);
	if (birthday) embed.addField(birthday.name, birthday.value, true);
	if (voiced.length > 0) embed.addField('Voiced by', voiced.join(', '), true);
	if (vns.length > 0) embed.addField('Appears in', vns.join(', '), false);

	// send the vn info
	message.channel.send({ embeds: [embed] });
}

function getBirthdayField() {
	const bday = foundChar.birthday;
	const age = `${foundChar.age} years`;

	// if day and month are present
	if (bday[0] && bday[1]) {
		const formatted = dayjs().day(bday[0]).month(bday[1]-1).format('D MMMM');

		// + birthday, + age
		if (foundChar.age) {
			return {name: 'Birthday & Age', value: `${formatted} (${age})`}
		}

		// + birthday, - age
		else {
			return {name: 'Birthday', value: formatted};
		}
	}

	// - birthday, + age
	else if (foundChar.age) {
		return {name: 'Age', value: age};
	}
	
	// - birthday, - age
	return null;
}

/*
	gender			пол: m/f/b						color			?
	image			URL картинки					thumbnail		?
	name			просто имя персонажа			title			+
	id				просто ID для ссылки			title url		+
	description		просто описание					description		?
	birthday		[day, month]					inline field	array +, contents ?
	age				возраст числом					-> birthday		?
	voiced			[ID, aID, vnID, note]			inline field	array +, contents ?
	vns				[vnID, rID, spoiler, role]		field			+
*/
