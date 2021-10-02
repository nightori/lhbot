import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import cfg from './../config.js';

export const names = ['anonpoll', 'ap'];
export const description = 'Создать анонимный опрос';
export const args = null;
export const restricted = false;
export const serverOnly = true;
export const hidden = false;

// global references
let utils;

export function execute(msg) {
	// construct the embed and the button row
	const question = msg.argsline || '...';
	const embed = getEmbed(question, '', '0 голосов', '0 голосов');
	const row = getButtonRow();

	// send the message and delete the invocation
	msg.channel.send({ embeds: [embed], components: [row] });
	msg.delete().catch(console.error);
}

export function vote(interaction, isYea) {
	// get the utils module
	utils = interaction.client.modules.get('utils');

	// get the unicoder module and encode the ID
	const unicoder = interaction.client.modules.get('unicoder');
	const encoded = unicoder.encodeData(interaction.user.id, interaction.message.id);

	// set up the embed fields
	const embed = interaction.message.embeds[0];
	const question = embed.title;
	const yea = formatVotes(embed.fields[0].value, isYea ? 1 : 0);
	const nay = formatVotes(embed.fields[1].value, isYea ? 0 : 1);

	// extract voters and check if the user has already voted
	const voters = embed.description.replace(/[\[\]\(\)]/g, '').split('|');
	if (voters.includes(encoded)) {
		interaction.reply({ content: 'Вы уже голосовали в этом опросе!', ephemeral: true });
		return;
	}

	// they haven't, add them to the voters list
	voters.push(encoded);
	const newVoters = voters.join('|');

	// construct the new embed
	const newEmbed = getEmbed(question, newVoters, yea, nay);

	// edit the message
	interaction.update({ embeds: [newEmbed] });
}

function getEmbed(question, voters, yea, nay) {
	// convert the first character to upper case
	const title = question.charAt(0).toUpperCase() + question.slice(1);

	return new MessageEmbed()
		.setColor(cfg.embedColor)
		.setTitle(title)
		.setDescription(`[](${voters})`)
		.addField('Да', yea, true)
		.addField('Нет', nay, true);
}

function getButtonRow() {
	return new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('anonpollYea')
				.setLabel('ДА')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('anonpollNay')
				.setLabel('НЕТ')
				.setStyle('DANGER'),
		);
}

function formatVotes(value, increment) {
	const votes = parseInt(value) + increment;
	const ending = utils.getDeclension(votes, '', 'а', 'ов'); 
	return `${votes} голос${ending}`;
}
