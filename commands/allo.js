module.exports = {
	names: ['allo', 'ping'],
	description: 'Проверить, жив бот или нет',
	args: null,
	restricted: false,
	serverOnly: false,
	hidden: true,
	execute(msg) {
		// reply depending on whether we're in DM or not
		msg.channel.send((msg.channel.type == 'dm') ? 'Да-да?' : '<:areyoustupid:459757690546290711>');
	}
};