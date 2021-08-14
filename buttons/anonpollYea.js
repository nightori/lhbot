module.exports = {
	name: 'anonpollYea',
	handler(button) {
		button.client.commands.get('anonpoll').vote(button, true);
	}
};