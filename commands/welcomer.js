module.exports = {
	names: ['welcomer', 'welcome'],
	description: 'Включить или выключить приветствия',
	args: ['[on/off]'],
	restricted: true,
	serverOnly: true,
	hidden: true,
	execute(msg) {
		// no persistence here, it's just temporary
		switch(msg.args[0]) {
			case "on": case "enable":
				msg.client.welcomerEnabled = true;
				msg.channel.send('Приветственные сообщения включены.');
				break;
			case "off": case "disable":
				msg.client.welcomerEnabled = false;
				msg.channel.send('Приветственные сообщения выключены.');
				break;
			default:
				msg.channel.send('Ты дурак что ли?');
		}
	}
};