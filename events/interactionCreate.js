export const name = 'interactionCreate';

export function handler(interaction) {
	// this event is only for button interactions (for now)
	if (!interaction.isButton())
		return;

	try {
		const button = interaction.client.buttons.get(interaction.component.customId);
		if (button)
			button.handler(interaction);
	}
	catch (e) {
		console.error(e);
	}
}
