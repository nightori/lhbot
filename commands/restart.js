module.exports = {
	names: ['restart'],
	description: 'Перезапустить бота',
	args: null,
	restricted: true,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		// this actually just shuts it down
		// but systemd will restart it automatically
		msg.client.shutdown();
	}
};