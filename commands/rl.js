const cfg = require('./../config.json');

module.exports = {
	names: ['rl', 'roles'],
	description: 'Управление ролями пользователя',
	args: ['[operation]', '[role]', '[member]'],
	restricted: true,
	serverOnly: true,
	hidden: true,
	execute(msg) {
		// get the role (either by alias or ID)
		const roleID = cfg.roles[msg.args[1]] || msg.args[1];
		const role = msg.guild.roles.cache.get(roleID);

		// convert mention to an ID and get the member
		const uid = msg.args[2].replace(/[<@!>]/g, '');
		const member = msg.guild.members.cache.get(uid);

		// if both were found
		if (member && role) {
			// if the specified operation exists
			const f = msg.args[0];
			if (member.roles[f]) {
				member.roles[f](role)
					.then(msg.successHandler)
					.catch(msg.errorHandler);
			}
			else msg.errorHandler('Unknown operation');
		}
		else if (role) msg.errorHandler('Member not found');
		else msg.errorHandler('Role not found');
	}
};