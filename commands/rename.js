module.exports = {
	names: ['rename'],
	description: 'Изменить ник пользователя',
	args: ['[member]', '[new nickname]'],
	restricted: true,
	serverOnly: true,
	hidden: true,
	execute(msg) {
		// convert mention to an ID
		const uid = msg.args[0].replace(/[<@!>]/g, '');

		// get member by ID and set the nickname
		const member = msg.guild.members.cache.get(uid);
		member.setNickname(msg.args.slice(1).join(' '))
			.then(msg.successHandler)
			.catch(msg.errorHandler);
	}
};