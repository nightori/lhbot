export const names = ['allo'];
export const description = 'Проверить, жив бот или нет';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const hidden = true;

export function execute(msg) {
	// reply depending on whether we're in DM or not
	msg.channel.send((msg.channel.type == 'DM') ? 'Да-да?' : '<:areyoustupid:459757690546290711>');
}
