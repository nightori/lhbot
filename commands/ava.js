import { MessageEmbed } from 'discord.js';

export const names = ['ava', 'ава', 'pfp', 'пфп'];
export const description = 'Получить ссылку на аватарку пользователя';
export const args = ['user'];
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = true;

export function execute(msg) {
    // get the utils module and user id
	const utils = msg.client.modules.get('utils');
    const uid = utils.getIdFromObjectString(msg.args[0]);

    // get and send the avatar url
    msg.client.users.fetch(uid)
        .then(user => {
			const url = `**https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png**`;
            const embed = new MessageEmbed().setColor('#00AFF4').setDescription(url);
            msg.channel.send({ embeds: [embed] });
        })
        .catch(msg.errorHandler);
}
