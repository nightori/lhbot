import { MessageActionRow, MessageButton } from 'discord.js';
import cfg from './../config.js';

export const names = ['anek', 'анек'];
export const description = 'Запостить случайный анек из МЛЮ';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = false;

// global references
let message, interaction;
let tries = 0;

export function execute(msg) {
	// set up global references
	message = msg;
	interaction = null;

	// try to get an anek
	sendRequest();
}

export function executeFromButton(int) {
	// set up global references
	message = int.message;
	interaction = int;

	// try to get an anek
	sendRequest();
}

function sendRequest() {
	// get the VK module and make a request for a random post
	const vk = message.client.modules.get('vk');
	vk.getRandomPost(cfg.anek.ownerId, cfg.anek.offsetLimit, callback);
}

function callback(result) {
	// if it's a proper post with text (not too long) and nothing else
	if (result['text'] && !result['attachments'] && result['text'].length < cfg.anek.lengthLimit) {
		displayAnek(`>>> ${result['text']}`);
		tries = 0;
	}
	// if it's not, try again up to N times
	else if (tries < cfg.anek.maxTries) {
		setTimeout(sendRequest, cfg.anek.retryDelay);
		tries++;
	}
	// we didn't manage to find an anek in N tries
	else {
		// send the default response
		displayAnek('>>> Купил мужик шляпу, а она ему как раз.');
		tries = 0;
	}
}

// either send a new message or edit an old one
function displayAnek(anek) {
	if (interaction) {
		interaction.update(anek);
	}
	else {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('anekRefresh')
					.setLabel('Загрузить другой')
					.setStyle('SECONDARY')
			);

		message.channel.send({ content: anek, components: [row] });
	}
}
