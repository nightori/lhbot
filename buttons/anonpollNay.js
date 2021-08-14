module.exports = {
	name: 'anonpollNay',
	handler(button) {
		button.client.commands.get('anonpoll').vote(button, false);
	}
};