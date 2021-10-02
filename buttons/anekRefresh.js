export const name = 'anekRefresh';

export function handler(interaction) {
	interaction.client.commands.get('anek').executeFromButton(interaction);
}
