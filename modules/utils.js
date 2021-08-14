const humanizeDuration = require('humanize-duration');
const dayjs = require('dayjs');

dayjs.extend(require('dayjs/plugin/duration'));

module.exports = {
	name: 'utils',

	// DISCORD UTILS
	
	getMemberByMessage(msg) {
		const uid = msg.author.id;
		return msg.guild.members.cache.get(uid);
	},
	getName(member) {
		return member.nickname || member.user.username;
	},
	isSnowflake(string) {
		if (!string) return false;
		return !!string.match(/^\d{17,}$/);
	},
	getPictureFromMessage(msg) {
		// dunno about the necessity of "!msg.attachments", too lazy to check
		if (!msg || !msg.attachments) return null;

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
					const id = this.getIdFromObjectString(arg);
					return `https://cdn.discordapp.com/emojis/${id}.${ext}?v=1`;
				}
			}
		}

		// if we found nothing
		return null;
	},
	getIdFromObjectString(str) {
		// the first replace removes emoji names
		// the second replace removes all special characters
		return str.replace(/<a?:.*:/, '').replace(/[<@!&#>]/g, '');
	},
	getRefMessageAndCall(msg, callback) {
		// try to get the ID of the referenced message
		let refID = null;
		if (msg.reference) refID = msg.reference.messageID;
		if (this.isSnowflake(msg.args[0])) refID = msg.args[0];

		// if there's a referenced message
		if (refID) {
			msg.channel.messages.fetch(refID)
				.then(callback)
				.catch(msg.errorHandler);
		}
		// if there isn't, just call the callback directly
		else {
			callback(null);
		}
	},

	// MISC UTILS

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getDurationString(ms) {
		const hrs = dayjs.duration(ms).asHours();
		return (hrs < 24) ? null : humanizeDuration(ms, {
			language: 'ru',
			units: ['y','mo','d'],
			round: true,
			conjunction: ' и ',
			serialComma: false
		});
	},
	getHashtags(text) {
		var regex = /(?:^|\s)(#[^\s@]+)/gm;
		var matches = [];
		while (match = regex.exec(text)) {
			matches.push(match[1]);
		}
		return matches;
	},
	getDeclension(number, ending1, ending2, ending3) {
		const lastDigit = parseInt(number.toString().split('').pop());

		// 11 to 14 is a special case
		if (number >= 11 && number <= 14) return ending3;

		// 1 — first ending
		if (lastDigit == 1) return ending1;

		// 2 to 4 — second ending, otherwise — third ending
		return (lastDigit >= 2 && lastDigit <= 4) ? ending2 : ending3;
	}
};