import cfg from './../config.js';

export const names = ['rl', 'roles'];
export const description = 'Управление ролями пользователя';
export const args = ['[operation]', '[role]', '[member]'];
export const restricted = true;
export const serverOnly = true;
export const botChannelOnly = false;
export const hidden = true;

export function execute(msg) {
	// get the role (either by alias or ID)
	const roleId = cfg.roles[msg.args[1]] || msg.args[1];
	const role = msg.guild.roles.cache.get(roleId);

	// convert mention to an ID and get the member
	const uid = msg.args[2].replace(/[<@!>]/g, '');
	msg.guild.members.fetch(uid)
		.then(member => {
			if (role) {
				// if the specified operation exists
				const f = msg.args[0];
				if (member.roles[f]) {
					member.roles[f](role)
						.then(msg.successHandler)
						.catch(msg.errorHandler);
				}
				else msg.errorHandler('Неизвестная операция');
			}
			else msg.errorHandler('Пользователь не найден');
		})
		.catch(msg.errorHandler)
}
