const disbut = require("discord-buttons");
const cfg = require('./../config.json');

// shared objects
let message, button;

module.exports = {
	names: ['anek', 'анек'],
	description: 'Запостить случайный анек из МЛЮ',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		// set up shared objects
		message = msg;
		button = null;

		// try to get an anek
		sendRequest();
	},
	executeFromButton(clickedButton) {
		// set up shared objects
		message = clickedButton.message;
		button = clickedButton;

		// try to get an anek
		sendRequest();
	}
};

function sendRequest() {
	// get the VK module and make a request for a random post
	const vk = message.client.modules.get('vk');
	vk.getRandomPost(cfg.anek.ownerID, cfg.anek.offsetLimit, callback);
}

let tries = 0;
function callback(result) {
	// if it's a proper post with text (not too long) and nothing else
	if (result['text'] && !result['attachments'] && result['text'].length < cfg.anek.lengthLimit) {
		displayAnek(`>>> ${result['text']}`);
		tries = 0;
	}
	// if it's not, try again up to N times
	else if (tries < cfg.anek.maxTries) {
		sendRequest();
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
	if (button) {
		button.reply.defer();
		message.edit(anek);
	}
	else {
		let button = new disbut.MessageButton()
			.setLabel("Загрузить другой")
			.setID("anekRefresh")
			.setStyle("grey")

		message.channel.send(anek, button);
	}
}