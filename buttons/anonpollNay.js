export const name = 'anonpollNay';

export function handler(interaction) {
	interaction.client.commands.get('anonpoll').vote(interaction, false);
}
