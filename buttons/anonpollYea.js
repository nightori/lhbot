export const name = 'anonpollYea';

export function handler(interaction) {
	interaction.client.commands.get('anonpoll').vote(interaction, true);
}
