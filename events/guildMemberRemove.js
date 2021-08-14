const Discord = require('discord.js');
const cfg = require('./../config.json');

module.exports = {
	name: 'guildMemberRemove',
	handler(member) {
		// save the nickname if it exists
		if (member.nickname) this.nicknameMap.set(member.user.id, member.nickname);

		// send the goodbye embed
		if (this.welcomerEnabled) {
			const logChannel = this.channels.cache.get(cfg.channels.log);
			const name = `${member.user.username}#${member.user.discriminator}`;
			logChannel.send(new Discord.MessageEmbed()
				.setColor('#F0F0F0')
				.setAuthor(`${name} больше не с нами`, 'https://cdn.discordapp.com/emojis/456438347259445248.png')
				.setDescription(`Ну и хуй с тобой, ${member.user}`)
			)
		}
	}
};