import { MessageEmbed } from 'discord.js';
import request from 'request';
import cfg from './../config.js';

export const name = 'vnr';

// global references
let client;

export function init(discordClient) {
	// save a reference to the client
	client = discordClient;
}

export function checkTags(tags, url) {
	const apiURL = cfg.vnr.tagApiURL + '/check';
	const content = tags.join(',');

	request({url: apiURL, body: content}, (err, resp, body) => {
		// if there was an error, just log it
		if (err) console.error(err);

		// if the response isn't empty, there are new tags
		if (body) {
			const newTags = '`' + body.replace(/,/g, '`, `') + '`';
			const manager = '<@!' + cfg.vnr.tagManager + '>';

			// construct the embed
			const embed = new MessageEmbed()
				.setColor(cfg.embedColor)
				.setAuthor('Предложен пост с новыми тегами', cfg.vnr.icon)
				.setTitle(url)
				.setURL(url)
				.setDescription('Новые теги: ' + newTags);

			// send the message
			getChannel().send({ content: manager, embeds: [embed]})
		}
	});
}

export function addVn(vn, callback) {
	const apiURL = cfg.vnr.tagApiURL + '/add';
	request({url: apiURL, method: "POST", body: vn, json: true}, callback);
}

// get the destination channel
function getChannel() {
	const channelId = cfg.channels.bot;
	return client.channels.cache.get(channelId);
}
