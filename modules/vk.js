import { MessageEmbed } from 'discord.js';
import { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider } from 'node-vk-sdk';
import cfg from './../config.js';

export const name = 'vk';

// if on, the sandbox group and the bot channel will be used instead of VNR and #VN
const DEBUG = cfg.vnr.debug;

// global references
let client, vkApi, vkApiVNR;
const posted = [];

export function init(discordClient) {
	// save a reference to the client
	client = discordClient;

	// general API for basic operations
	vkApi = new VKApi({
		logger: new ConsoleLogger(),
		token: cfg.tokens.vk
	});

	// VNR API for long polling
	vkApiVNR = new VKApi({
		logger: new ConsoleLogger(),
		token: DEBUG ? cfg.tokens.vkSandbox : cfg.tokens.vkVNR
	});

	// start listening to updates
	if (cfg.vnr.enabled) {
		const groupId = DEBUG ? cfg.vnr.idSandbox : cfg.vnr.id;
		const updatesProvider = new BotsLongPollUpdatesProvider(vkApiVNR, groupId);
		updatesProvider.getUpdates(vnrUpdatesHandler);
	}
}

export function getRandomPost(owner, offsetLimit, callback) {
	// get the utils module
	const utils = client.modules.get('utils');

	// set the request params
	const params = {
		'owner_id': owner,
		'offset': utils.getRandomInt(1, offsetLimit),
		'count': '1'
	};

	// pass the result to the provided callback function
	vkApi.wallGet(params).then(r => callback(r['items'][0]));
}

////// VNR INTERACTION //////

function vnrUpdatesHandler(updates) {
	// get the utils module
	const utils = client.modules.get('utils');

	// if there's no post in the update, stop
	if (!updates[0] || updates[0]['object']['post_type'] != 'post') return;

	const post = updates[0]['object'];	
	const url = `https://vk.com/wall${post['owner_id']}_${post['id']}`;

	// if we already posted that, stop
	if (posted.indexOf(url) != -1) return;

	let text = post['text'].trim();
	const tags = utils.getHashtags(text);

	// see if any of the post hashtags are in the "ignored" list
	if (tags.some(r => cfg.vnr.ignored.indexOf(r) >= 0)) {
		console.log(`VNR: ignored ${url}`);
		return;
	}

	// if the text is too long, cut it
	if (text.length > cfg.vnr.lengthLimit) {
		text = text.substring(0, cfg.vnr.lengthLimit) + '...';
	}

	// construct the embed with the post data
	const embed = new MessageEmbed()
		.setColor(cfg.embedColor)
		.setTitle(url)
		.setDescription(text)
		.setAuthor(cfg.vnr.name, cfg.vnr.icon)
	
	// if the trimmed message doesn't have all the tags the original one had
	// then we put the tags in the embed's footer
	if (tags.toString() != utils.getHashtags(text).toString()) {
		embed.setFooter(tags.join(' '));
	}

	// get the destination channel
	const channelId = DEBUG ? cfg.channels.bot : cfg.channels.vn;	
	const channel = client.channels.cache.get(channelId);

	// finally, post and log it
	channel.send({ embeds: [embed] });
	posted.push(url);
	console.log(`VNR: posted ${url}`);
}
