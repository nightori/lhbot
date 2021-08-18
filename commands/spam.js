let intID, message;

module.exports = {
	names: ['spam', 'flood'],
	description: 'Включить или выключить спам заданным текстом',
	args: ['[text]'],
	restricted: true,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		if (msg.args[0] == 'off') {
			clearInterval(intID);
		}
		else {
			message = msg;
			clearInterval(intID);
			intID = setInterval(() => {
				message.channel.send(message.argsline)
			}, 2500);
		}
	}
};