import humanizeDuration from 'humanize-duration';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

export const name = 'utils';

dayjs.extend(duration);

export function getMemberByMessage(msg) {
	const uid = msg.author.id;
	return msg.guild.members.cache.get(uid);
}

export function getName(member) {
	return member.nickname || member.user.username;
}

export function isSnowflake(string) {
	return string ? !!string.match(/^\d{17,}$/) : false;
}

export function getPictureFromMessage(msg) {
	// dunno about the necessity of "!msg.attachments", too lazy to check
	if (!msg || !msg.attachments)
		return null;

	// get the message args and the first attachment
	const args = msg.content.replace('><', '> <').trim().split(/ +/);
	const attachment = msg.attachments.entries().next().value;

	// if the attachment exists and is a picture
	if (attachment && attachment[1].height) {
		return attachment[1].url;
	}


	// if there's a simple image embed
	else if (msg.embeds[0] && msg.embeds[0].type == 'image') {
		return msg.embeds[0].url;
	}


	// if there's a rich embed with a picture
	else if (msg.embeds[0] && msg.embeds[0].type == 'rich' && msg.embeds[0].image) {
		return msg.embeds[0].image.url;
	}

	// try to find a URL or an emoji
	else if (args) {
		for (const arg of args) {
			// if it's a URL, assume it's a picture
			if (arg.startsWith('http')) {
				return arg;
			}
			// if it starts with '<', it's an emoji
			if (arg.startsWith('<')) {
				const ext = arg.startsWith('<a') ? 'gif' : 'png';
				const id = getIdFromObjectString(arg);
				return `https://cdn.discordapp.com/emojis/${id}.${ext}?v=1`;
			}
		}
	}

	// if we found nothing
	return null;
}

export function getIdFromObjectString(str) {
	// the first replace removes emoji names
	// the second replace removes all special characters
	return str.replace(/<a?:.*:/, '').replace(/[<@!&#>]/g, '');
}

export function getRefMessageAndCall(msg, callback) {
	// try to get the ID of the referenced message
	let refId = null;
	if (msg.reference)
		refId = msg.reference.messageId;
	if (isSnowflake(msg.args[0]))
		refId = msg.args[0];

	// if there's a referenced message
	if (refId) {
		msg.channel.messages.fetch(refId)
			.then(callback)
			.catch(msg.errorHandler);
	}

	// if there isn't, just call the callback directly
	else {
		callback(null);
	}
}

export function getMessageByLinkAndCall(link, msg, callback) {
	// get the server id, channel id, message id
	const ids = link
		.replace(/https:\/\/discord.com\/channels\//g, '')
		.split('/');

	// validate the input
	if (ids.length == 3) {
		// get the server, the channel, the message...
		msg.client.guilds.fetch(ids[0])
			.then(guild => {
				guild.channels.fetch(ids[1])
					.then(channel => {
						channel.messages.fetch(ids[2])
							.then(callback)
							.catch(msg.errorHandler);
					})
					.catch(msg.errorHandler);
			})
			.catch(msg.errorHandler);
	}
}

export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDurationString(ms) {
	const hrs = dayjs.duration(ms).asHours();
	return (hrs < 24) ? null : humanizeDuration(ms, {
		language: 'ru',
		units: ['y', 'mo', 'd'],
		round: true,
		conjunction: ' и ',
		serialComma: false
	});
}

export function getHashtags(text) {
	const regex = /(?:^|\s)(#[^\s@]+)/gm;
	const matches = [];
	while (true) {
		const match = regex.exec(text);
		if (match) matches.push(match[1]);
		else break;
	}
	return matches;
}

export function getDeclension(number, ending1, ending2, ending3) {
	const lastDigit = number % 10;

	if (number >= 11 && number <= 14)
		return ending3;

	if (lastDigit == 1)
		return ending1;

	if (lastDigit >= 2 && lastDigit <= 4)
		return ending2;

	return ending3;
}
