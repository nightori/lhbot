module.exports = {
	name: 'anekRefresh',
	handler(button) {
		button.client.commands.get('anek').executeFromButton(button);
	}
};