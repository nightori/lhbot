export const names = ['rename'];
export const description = 'Изменить ник пользователя';
export const args = ['[member]', '[new nickname]'];
export const restricted = true;
export const serverOnly = true;
export const hidden = true;

export function execute(msg) {
	// convert mention to an ID
	const uid = msg.args[0].replace(/[<@!>]/g, '');

	// get member by ID and set the nickname
	msg.guild.members.fetch(uid)
		.then(member => {
			member.setNickname(msg.args.slice(1).join(' '))
				.then(msg.successHandler)
				.catch(msg.errorHandler);
		})
		.catch(msg.errorHandler);
}
