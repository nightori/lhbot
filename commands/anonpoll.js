const Discord = require('discord.js');
const disbut = require("discord-buttons");
const cfg = require('./../config.json');

// shared objects
let utils;

module.exports = {
	names: ['anonpoll', 'ap'],
	description: 'Создать анонимный опрос (с ответами да/нет)',
	args: null,
	restricted: false,
	serverOnly: true,
	hidden: false,
	execute(msg) {
		// construct the embed and the button row
		const question = msg.args.join(' ') || '...';
		const embed = getEmbed(question, '', '0 голосов', '0 голосов');
		const buttons = getButtonRow();

		// send the message and delete the invocation
		msg.channel.send(embed, buttons);
		msg.delete().catch(console.error);
	},

	vote(button, isYea) {
		// get the utils module
		utils = button.client.modules.get('utils');

		// get the unicoder module and encode the ID
		const unicoder = button.client.modules.get('unicoder');
		const encoded = unicoder.encode(button.clicker.id, button.message.id);

		// set up the embed fields
		const embed = button.message.embeds[0];
		const question = embed.title;
		const yae = formatVotes(embed.fields[0].value, isYea ? 1 : 0);
		const nay = formatVotes(embed.fields[1].value, isYea ? 0 : 1);

		// extract voters and check if the user has already voted
		const voters = embed.description.replace(/[\[\]\(\)]/g,'').split('|');
		if (voters.includes(encoded)) {
			button.reply.send('Вы уже голосовали в этом опросе!', true);
			return;
		}

		// they haven't, add them to the voters list
		voters.push(encoded);
		const newVoters = voters.join('|');

		// construct the new embed
		const newEmbed = getEmbed(question, newVoters, yae, nay);

		// edit the message, unlock the buttons when done
		button.message.edit(newEmbed)
			.then(() => button.reply.defer());
	}
};

function getEmbed(question, voters, yea, nay) {
	// convert the first character to upper case
	const title = question.charAt(0).toUpperCase() + question.slice(1);

	return new Discord.MessageEmbed()
		.setColor(cfg.embedColor)
		.setTitle(title)
		.setDescription(`[](${voters})`)
		.addField('Да', yea, true)
		.addField('Нет', nay, true);
}

function getButtonRow() {
	const buttonYea = new disbut.MessageButton()
		.setStyle('green')
		.setLabel('ДА') 
		.setID('anonpollYea');

	const buttonNay = new disbut.MessageButton()
		.setStyle('red')
		.setLabel('НЕТ') 
		.setID('anonpollNay');

	return new disbut.MessageActionRow()
		.addComponents(buttonYea, buttonNay);
}

function formatVotes(value, increment) {
	const votes = parseInt(value) + increment;
	const ending = utils.getDeclension(votes, '', 'а', 'ов'); 
	return `${votes} голос${ending}`;
}