module.exports = {
	name: 'clickButton',
	handler(clickedButton) {
		try {
			const button = clickedButton.client.buttons.get(clickedButton.id);
			if (button) button.handler(clickedButton);
		}
		catch (e) {
			console.error(e);
		}
	}
};