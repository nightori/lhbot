import { MessageEmbed } from 'discord.js';
import cfg from './../config.js';

export const name = 'guildMemberAdd';

export function handler(member) {
	const name = `${member.user.username}#${member.user.discriminator}`;

	// ban automatically based on the filter
	let ban = false;
	cfg.autoban.forEach(w => ban |= (name.toLowerCase().search(w) != -1));
	if (ban) {
		member.ban();
		return;
	}

	// if the nickname was saved, restore it
	const nickname = this.nicknameMap.get(member.user.id);
	if (nickname) {
		member.setNickname(nickname).catch(console.error);
		this.nicknameMap.delete(member.user.id);
	}

	// send the welcome embed
	if (this.welcomerEnabled) {
		const logChannel = this.channels.cache.get(cfg.channels.log);
		logChannel.send({
			embeds: [
				new MessageEmbed()
					.setColor('#3F61A7')
					.setAuthor(`${name} зашёл на сервер`, 'https://cdn.discordapp.com/emojis/453969908292780037.png')
					.setDescription(`Добро пожаловать, ${member.user}, загляни в <#${cfg.channels.info}>`)
			]
		});
	}
}
